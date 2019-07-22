require('dotenv').config();
const mongoose = require('mongoose');

const dbURI = `${process.env.MONGODB_URI}`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('DB connected successfully');
  } catch (e) {
    console.error(`DB Connection Error: ${e.stack}`);
    process.exit(1);
  }
};

module.exports = connectDB;
