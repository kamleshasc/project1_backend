const express = require("express");
const router = express.Router();
const authController = require("../../controller/authController");
const verifyJWT = require("../../middleware/verifyJWT");

router.post("/login", authController.login);
router.post("/logout", verifyJWT, authController.logout);
router.post("/new-refresh-token", authController.refreshAccessToken);
router.put("/change-password", verifyJWT, authController.changePassword);
router.patch("/forgot-password-verify", authController.forgotPassword);
router.patch("/reset-password/:id", authController.resetPassword);

module.exports = router;
