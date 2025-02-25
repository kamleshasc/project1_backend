const express = require("express");
const bookingController = require("../../controller/bookingController");

const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

router.post("/", verifyJWT, bookingController.createBooking);
router.put("/deleteBooking/:id", verifyJWT, bookingController.deleteBookings);

router.get("/:id/:date", verifyJWT, bookingController.getBookingByIdAndDate);

//user routes
router.post("/user", verifyJWT, bookingController.createUserBooking);
router.get(
  "/expertStatus/:date/:expertId",
  verifyJWT,
  bookingController.getUserBookedExpertStatus
);
router.get(
  "/:date/:expertId/:serviceId/",
  verifyJWT,
  bookingController.getUserBookedTimeSlot
);
router.get("/myBookings", verifyJWT, bookingController.getMyBookings);

module.exports = router;
