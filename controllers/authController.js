const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Move transporter creation to a function to ensure env vars are loaded
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
    logger: true,
  });
};

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  user.refreshTokens.push(refreshToken);
  await user.save();
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, password, firstName, lastName, phoneNumber, role });
    await user.save();

    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, email, firstName, lastName, role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://localhost:5001/api/auth/reset-password/${resetToken}`; //post request to reset password, token is passed in the url
    console.log('Reset Token:', resetToken);
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS);

    const transporter = createTransporter(); // Create transporter here
    const info = await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset for your ServicePro account.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link expires in 1 hour. If you didn’t request this, ignore this email.</p>
      `,
    });
    console.log('Email sent:', info.response);

    res.json({ message: 'Reset link sent to email' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Failed to send reset link', error: error.message });
  }
};

// ... rest of the file (resetPassword, getProfile, refreshToken) ...

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findOne({ _id: decoded.id, refreshTokens: refreshToken });
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    const { accessToken: newAccessToken } = await generateTokens(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

