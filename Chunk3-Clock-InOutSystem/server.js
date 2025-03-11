const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000; // Allows dynamic port selection

app.use(express.json());

const users = [];
const clockIns = [];
const tasks = [
    { id: 1, name: 'Clean Room 101', assignedTo: 'staff1', status: 'locked' },
    { id: 2, name: 'Clean Room 102', assignedTo: 'staff2', status: 'locked' }
];

// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, role });
    res.status(201).send('User registered');
});

// User login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username, role: user.role }, 'secret_key', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (token) {
        jwt.verify(token, 'secret_key', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Middleware to validate GPS data
const validateGPS = (req, res, next) => {
    const { latitude, longitude } = req.body;
    next();
};

// Clock-in endpoint
app.post('/clock-in', authenticateJWT, validateGPS, (req, res) => {
    const { latitude, longitude } = req.body;
    const timestamp = new Date();
    clockIns.push({ userId: req.user.username, latitude, longitude, timestamp });

    tasks.forEach(task => {
        if (task.assignedTo === req.user.username) {
            task.status = 'unlocked';
            sendPushNotification(req.user.username, `Task ${task.name} is now unlocked`);
        }
    });

    res.send('Clocked in and tasks unlocked');
});

// Clock-out endpoint
app.post('/clock-out', authenticateJWT, validateGPS, (req, res) => {
    const { latitude, longitude } = req.body;
    const timestamp = new Date();
    clockIns.push({ userId: req.user.username, latitude, longitude, timestamp, clockOut: true });
    res.send('Clocked out');
});

// Function to send push notifications (pseudo-code)
const sendPushNotification = (user, message) => {
    console.log(`Push notification to ${user}: ${message}`);
};

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        console.error(err);
    }
});
