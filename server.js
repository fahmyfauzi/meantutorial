// import packages
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
require('express-async-errors');
require('colors');

//import files
const connectDB = require('./app/config/db');
const User = require('./app/models/user');

const app = express();

//setup
dotenv.config();
connectDB();

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//route
app.post('/users', async (req, res) => {
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

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Runing the server on http://localhost:${port}`.bgCyan.white);
});
