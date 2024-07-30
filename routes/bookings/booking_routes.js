const express = require("express");
const Booking = require("../../database/models/bookings");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const {
      date,
      serviceId,
      name,
      mail,
      phone,
      serviceStartTime,
      serviceEndTime,
      parentId,
    } = req.body;

    // Convert date to UTC
    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    // Get current date and time
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const maxDate = new Date(currentDate);
    maxDate.setUTCDate(maxDate.getUTCDate() + 3);

    if (
      bookingDate < currentDate.setUTCHours(0, 0, 0, 0) ||
      bookingDate > maxDate
    ) {
      return res
        .status(400)
        .json({ error: "Booking date must be within the next 3 days" });
    }

    // Check if the service time is between 9:00 AM and 6:00 PM
    const [startHour, startMinute] = serviceStartTime.split(":").map(Number);
    const [endHour, endMinute] = serviceEndTime.split(":").map(Number);

    if (startHour < 9 || endHour > 18 || (endHour === 18 && endMinute > 0)) {
      return res
        .status(400)
        .json({ error: "Service time must be between 9:00 AM and 6:00 PM" });
    }

    // For current day bookings, check if service start time is after current time
    if (bookingDate.getTime() === currentDate.setUTCHours(0, 0, 0, 0)) {
      if (serviceStartTime <= currentTime) {
        return res
          .status(400)
          .json({ error: "Cannot book for past times on the current day" });
      }
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      date: bookingDate,
      serviceId: serviceId,
      $or: [
        {
          serviceStartTime: { $lt: serviceEndTime },
          serviceEndTime: { $gt: serviceStartTime },
        },
        { serviceStartTime: { $gte: serviceStartTime, $lt: serviceEndTime } },
        { serviceEndTime: { $gt: serviceStartTime, $lte: serviceEndTime } },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res
        .status(400)
        .json({ error: "The selected service time slot is already booked" });
    }

    // Create new booking
    const newBooking = new Booking({
      date: bookingDate,
      serviceId,
      parentId,
      name,
      mail,
      phone,
      startTime: "09:00", // Fixed start time
      endTime: "18:00", // Fixed end time
      serviceStartTime,
      serviceEndTime,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the booking" });
  }
});

router.get("/:id/:date", async (req, res, next) => {
  try {
    let serviceId = req.params.id;
    let date = req.params.date;

    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    const result = await Booking.find({ serviceId, date: bookingDate }).sort({
      serviceStartTime: 1,
    });
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting the booking" });
  }
});

module.exports = router;
