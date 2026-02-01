const express = require('express');
const path = require('path');
const healthRoutes = require('./src/routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health endpoints
app.use(healthRoutes);

// Simple login handler (placeholder for real auth)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // For demo purposes, accept any credentials and return a mock token/user
  return res.status(200).json({
    token: 'demo-mock-token',
    user: {
      email,
      role: 'writer'
    }
  });
});

// Serve frontend entry for non-API GET requests
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
