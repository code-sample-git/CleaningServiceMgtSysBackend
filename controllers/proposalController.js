const Proposal = require('../models/Proposal');
const User = require('../models/User');
const nodemailer = require('nodemailer');

exports.createProposal = async (req, res) => {
  try {
    const proposal = new Proposal(req.body);
    await proposal.save();
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProposalsByClient = async (req, res) => {
  try {
    const proposals = await Proposal.find({ clientId: req.params.clientId });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProposal = async (req, res) => {
  try {
    const updated = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Proposal not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProposal = async (req, res) => {
  try {
    const deleted = await Proposal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Proposal not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Proposal not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendProposalEmail = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).lean();
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const client = await User.findById(proposal.clientId);
    if (!client || !client.email) return res.status(404).json({ message: 'Client email not found' });

    // Setup email transporter (use your SMTP creds or a test service like Ethereal)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use a custom SMTP
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: '"ServicePro Proposals" <noreply@yourcompany.com>',
      to: client.email,
      subject: 'Your Service Proposal',
      html: `
        <h2>Hello ${client.firstName},</h2>
        <p>Here is your proposal:</p>
        <p><strong>Frequency:</strong> ${proposal.frequency}</p>
        <p><strong>Notes:</strong> ${proposal.notes || 'N/A'}</p>
        <p><strong>Total:</strong> $${proposal.totalAmount}</p>
        <p>Status: <strong>${proposal.status}</strong></p>
        <br/>
        <p>Thank you for choosing us!</p>
      `
    };

    console.log("Proposal:", proposal);
    console.log("Client ID:", proposal.clientId);
    console.log(mailOptions);
    console.log("Sending to:", client?.email);

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Proposal email sent to client.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
};