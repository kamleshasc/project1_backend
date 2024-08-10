const express = require("express");
const bookingController = require("../../controller/bookingController");

const router = express.Router();

router.post("/", bookingController.createBooking);

router.get("/:id/:date", bookingController.getBookingByIdAndDate);

module.exports = router;
