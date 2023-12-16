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

// USER LOGINN ROUTE
//http://localhost:3000/api/authenticate
router.post('/authenticate', async (req, res) => {
  const { password, username } = req.body;

  //jika inputan password atau username kosong
  if (!password || !username) {
    res.json({
      success: false,
      message: 'No Password or username Provided',
    });
  }

  const user = await User.findOne({ username }).select('email username password');
  //jika user tidak sesuai dengan username yang ada pada db
  if (!user) {
    res.json({
      success: false,
      message: 'Could not authenticate user',
    });
  }

  //validasi password yang sudah di encrypt
  const validPassword = user.comparePassword(password);
  if (!validPassword) {
    res.json({
      success: false,
      message: 'Could not authenticate password',
    });
  }

  //sukses
  res.json({
    success: true,
    message: 'User Authenticated!',
  });
});
module.exports = router;
