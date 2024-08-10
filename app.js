"use strict";

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressJson = require("express").json(); // Use express.json() instead of bodyParser.json()
const cors = require("cors");
const db = require("./database/db");
// const logger = require('./utils/logger');
const http = require("http");
const ApiError = require("./utils/ApiError");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app, { maxHeaderSize: 50 * 1024 });

// Middleware Setup
app.use(cookieParser());
app.use(expressJson);
app.use(express.urlencoded({ extended: false })); // Handle URL-encoded data if needed

// Serve static content from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS
app.use(cors());

//API endpoint for Users Module
app.use("/api/v1", require("./api"));

const PORT = process.env.PORT;

//When no api match it will return
app.use("*", async (req, res, next) => {
  let err = new ApiError(404, "Page not found.");
  next(err);
  // next(createError.NotFound("Page not found!"));
  // return res.status(404).json({ error: "Page Not Found." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // logger.error(err.stack);
  // Send a generic error response to the client
  res.status(err.statusCode).json({ message: err.message, ...err });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Express Server listening on port ${PORT}`);
  // logger.info(`Express Server listening on port ${PORT}`);
});
