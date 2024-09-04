const express = require("express");
const router = express.Router();
const authController = require("../../controller/authController");
const verifyJWT = require("../../middleware/verifyJWT");

router.post("/login", authController.login);
router.post("/logout", verifyJWT, authController.logout);
router.post("/new-refresh-token", authController.refreshAccessToken);

module.exports = router;
