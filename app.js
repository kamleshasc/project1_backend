"use strict";

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressJson = require("express").json(); // Use express.json() instead of bodyParser.json()
const cors = require("cors");
const db = require("./database/db");
// const logger = require('./utils/logger');
const http = require("http");
//Routes
const newUserRouter = require("./routes/users/user_routes");
const serviceRouter = require("./routes/services/service_routes");
const clientRouter = require("./routes/clients/client_routes");
const inventoryRouter = require("./routes/inventory/inventory_routes");
const commissionRouter = require("./routes/commissionRules/commissionRule_routes");
const invoiceRouter = require("./routes/invoices/invoice_routes");

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
app.use("/api/users", newUserRouter);
//API endpoint for Services Module
app.use("/api/services", serviceRouter);
//API endpoint for Client Module
app.use("/api/clients", clientRouter);
//API endpoint for Inventory Module
app.use("/api/inventory", inventoryRouter);
//API endpoint for Commission Rule Module
app.use("/api/commissionrules", commissionRouter);
//API endpoint for Invoice Module
app.use("/api/invoices", invoiceRouter);

const PORT = process.env.PORT;

// Error handling middleware
app.use((err, req, res, next) => {
  // logger.error(err.stack);

  // Send a generic error response to the client
  res.status(500).json({ error: "Internal Server Error" });
});

//When no api match it will return
app.use("*", async (req, res) => {
  return res.status(404).json({ error: "Page Not Found." });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Express Server listening on port ${PORT}`);
  // logger.info(`Express Server listening on port ${PORT}`);
});
