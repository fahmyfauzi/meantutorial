const express = require('express');
const router = express.Router();
const User = require('../models/user');
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.send('Ensure username, email, and password were provide');
  }

  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });

  if (existingUsername || existingEmail) {
    return res.status(400).send('Email or password already');
  }

  const user = await User.create({ username, email, password });
  res.json({
    status: 'success',
    message: 'success created user',
    data: user,
  });
});

module.exports = router;
