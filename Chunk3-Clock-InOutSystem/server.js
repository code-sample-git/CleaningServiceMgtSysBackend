const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const SECRET_KEY = "supersecret"; // Change this in production

app.use(cors());
app.use(bodyParser.json());

// Utility functions to load and save data
const loadData = (filename) => {
    try {
        return JSON.parse(fs.readFileSync(`./data/${filename}`, "utf-8"));
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return [];
    }
};

const saveData = (filename, data) => {
    try {
        fs.writeFileSync(`./data/${filename}`, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error saving ${filename}:`, error);
    }
};

// Load initial data
let users = loadData("users.json");
let tasks = loadData("tasks.json");
let supplies = loadData("supplies.json");

// Middleware: Authenticate Requests
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = decoded;
        next();
    });
};

// Register a new user (staff or manager)
app.post("/register", (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).json({ error: "Missing fields" });

    const newUser = { id: users.length + 1, username, password, role };
    users.push(newUser);
    saveData("users.json", users);
    
    res.status(201).json({ message: "User registered", user: newUser });
});

// Login and get a JWT token
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// Staff Clock-In (GPS-based)
app.post("/clock-in", authenticate, (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) return res.status(400).json({ error: "GPS data required" });

    const timestamp = new Date().toISOString();
    
    tasks.forEach(task => {
        if (task.assignedTo === req.user.username) task.status = "unlocked";
    });

    saveData("tasks.json", tasks);
    res.json({ message: "Clocked in and tasks unlocked", timestamp });
});

// Staff Clock-Out (GPS-based)
app.post("/clock-out", authenticate, (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) return res.status(400).json({ error: "GPS data required" });

    const timestamp = new Date().toISOString();
    res.json({ message: "Clocked out", timestamp });
});

// Task Notifications (View Tasks)
app.get("/tasks", authenticate, (req, res) => {
    const staffTasks = tasks.filter(task => task.assignedTo === req.user.username);
    res.json(staffTasks);
});

// Request Supplies (Staff → Manager Approval)
app.post("/supply-request", authenticate, (req, res) => {
    const { item, quantity } = req.body;
    if (!item || !quantity) return res.status(400).json({ error: "Missing fields" });

    const request = {
        id: supplies.requests.length + 1,
        item,
        quantity,
        requestedBy: req.user.username,
        status: "pending",
    };

    supplies.requests.push(request);
    saveData("supplies.json", supplies);
    res.json({ message: "Supply request submitted", request });
});

// Approve Supply Request (Manager Only)
app.post("/approve-request/:id", authenticate, (req, res) => {
    if (req.user.role !== "manager") return res.status(403).json({ error: "Unauthorized" });

    const requestId = parseInt(req.params.id);
    const request = supplies.requests.find(r => r.id === requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "approved";
    saveData("supplies.json", supplies);
    res.json({ message: "Supply request approved", request });
});

// Inventory Tracking (Low-Stock Alerts)
app.get("/inventory", (req, res) => {
    const lowStock = supplies.inventory.filter(item => item.quantity < item.threshold);
    res.json({ lowStock });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
