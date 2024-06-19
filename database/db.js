const mongoose = require("mongoose");
// const logger = require('../utils/logger');
const dotenv = require("dotenv");

dotenv.config();

// Connection URI
const MongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    // logger.info('Connection to MongoDB is successful');
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    // logger.error('Error while connecting to MongoDB: ', error);
    process.exit(1);
  });

module.exports = mongoose.connection;
