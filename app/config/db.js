const mongoose = require('mongoose');
//setup mogodb
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connect to mongodb database ${mongoose.connection.host}`.bgGreen.white);
  } catch (err) {
    console.log(`MongoDB Error ${err}`.bgRed.white);
  }
};

module.exports = connectDB;
