const express = require('express');
const cors = require('cors');
const path = require('path');

const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple in-memory user roles (replace with real auth provider)
const users = [
  { email: 'editor@example.com', password: 'password', role: 'editor' },
  { email: 'writer@example.com', password: 'password', role: 'writer' }
];

// Create a Map for O(1) email lookup
const userMap = new Map(users.map(u => [u.email.toLowerCase(), u]));

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = userMap.get(email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Issue a simple mock token (in production use JWT or session)
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString('base64');
  return res.status(200).json({
    status: 'ok',
    token,
    user: { email: user.email, role: user.role }
  });
});

// Health/ready/metrics
app.use('/', healthRouter);

// Serve static site (optional: for local preview)
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
