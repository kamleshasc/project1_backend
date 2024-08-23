const Booking = require("../models/bookings");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");
const { getCurrentDateZone, getCurrentTimeZone } = require("../utils/helper");

exports.createBooking = async (req, res, next) => {
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

    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    const currentDate = getCurrentDateZone();
    // const currentTime = currentDate.toLocaleTimeString("en-US", {
    //   hour12: false,
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });

    const currentTime = getCurrentTimeZone();

    const maxDate = new Date(currentDate);
    maxDate.setUTCDate(maxDate.getUTCDate() + 3);

    if (
      bookingDate < currentDate.setUTCHours(0, 0, 0, 0) ||
      bookingDate > maxDate
    ) {
      // return res
      //   .status(400)
      //   .json({ error: "Booking date must be within the next 3 days" });
      return next(
        new ApiError(400, "Booking date must be within the next 3 days")
      );
    }

    const [startHour, startMinute] = serviceStartTime.split(":").map(Number);
    const [endHour, endMinute] = serviceEndTime.split(":").map(Number);

    if (startHour < 9 || endHour > 18 || (endHour === 18 && endMinute > 0)) {
      // return res
      //   .status(400)
      //   .json({ error: "Service time must be between 9:00 AM and 6:00 PM" });
      return next(
        new ApiError(400, "Service time must be between 9:00 AM to 6:00 PM")
      );
    }

    if (bookingDate.getTime() === currentDate.setUTCHours(0, 0, 0, 0)) {
      if (serviceStartTime <= currentTime) {
        // return res
        //   .status(400)
        //   .json({ error: "Cannot book for past times on the current day" });
        return next(
          new ApiError(400, "Cannot book for past times on the current day")
        );
      }
    }

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
      // return res
      //   .status(400)
      //   .json({ error: "The selected service time slot is already booked" });
      return next(
        new ApiError(400, "The selected service time slot is already booked")
      );
    }

    const newBooking = new Booking({
      date: bookingDate,
      serviceId,
      parentId,
      name,
      mail,
      phone,
      startTime: "09:00",
      endTime: "18:00",
      serviceStartTime,
      serviceEndTime,
    });

    await newBooking.save();
    // return res.status(201).json(newBooking);
    let response = new ApiResponse(201, newBooking);
    return res.json(response);
  } catch (error) {
    // return res
    //   .status(500)
    //   .json({ error: "An error occurred while creating the booking" });
    return next(
      new ApiError(
        500,
        error?.message || "An error occurred while creating the booking"
      )
    );
  }
};

exports.getBookingByIdAndDate = async (req, res, next) => {
  try {
    let serviceId = req.params.id;
    let date = req.params.date;

    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    const result = await Booking.find({ serviceId, date: bookingDate }).sort({
      serviceStartTime: 1,
    });
    // return res.status(200).json(result);
    let response = new ApiResponse(200, result);
    return res.json(response);
  } catch (error) {
    // return res
    //   .status(500)
    //   .json({ error: "An error occurred while getting the booking" });
    return next(
      new ApiError(
        500,
        error?.message || "An error occurred while getting the booking"
      )
    );
  }
};
