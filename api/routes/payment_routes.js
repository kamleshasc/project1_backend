const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const paymentController = require("../../controller/paymentController");

router.get("/getbooking", verifyJWT, paymentController.getPaymentByDate);
router.post("/", verifyJWT, paymentController.createPayment);
// router.get("/salesReport", verifyJWT, paymentController.getSalesReport);

module.exports = router;
