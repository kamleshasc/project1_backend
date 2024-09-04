const express = require("express");
const bookingController = require("../../controller/bookingController");

const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

router.post("/", verifyJWT, bookingController.createBooking);

router.get("/:id/:date", verifyJWT, bookingController.getBookingByIdAndDate);

module.exports = router;
