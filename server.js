// import packages
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('colors');

const app = express();
dotenv.config();

//middleware
app.use(morgan('dev'));

//setup mogodb
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connect to mongodb database ${mongoose.connection.host}`.bgGreen.white);
  } catch (err) {
    console.log(`MongoDB Error ${err}`.bgRed.white);
  }
};

connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Runing the server on http://localhost:${port}`.bgCyan.white);
});
