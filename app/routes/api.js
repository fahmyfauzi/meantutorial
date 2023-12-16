const express = require('express');
const router = express.Router();
const User = require('../models/user');

// USER REGISTRATION ROUTE
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.json({ success: false, message: 'Ensure username, email, and password were provide' });
  }

  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });

  if (existingUsername || existingEmail) {
    res.json({ success: false, message: 'Email or Username already exists!' });
  }

  const user = await User.create({ username, email, password });
  res.json({ success: true, message: 'user created' });
});

module.exports = router;
