// import packages
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
require('express-async-errors');
require('colors');

//import files
const connectDB = require('./app/config/db');
const routesApi = require('./app/routes/api.js');
const path = require('path');

const app = express();

//setup
dotenv.config();
connectDB();

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//route
app.use('/api/v1/users', routesApi);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Runing the server on http://localhost:${port}`.bgCyan.white);
});
