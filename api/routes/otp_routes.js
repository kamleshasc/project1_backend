const express = require("express");
const routes = express.Router();
const otpController = require("../../controller/otpController");

routes.post("/signup", otpController.signUpOTP);
routes.post("/forgot-password", otpController.forgotOTP);

module.exports = routes;
