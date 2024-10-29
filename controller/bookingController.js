const Booking = require("../models/bookings");
const Service = require("../models/services");
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
      expertId,
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
      expertId: expertId,
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
      expertId
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

function getBookingResult(resData) {
  const bookingData = resData.map((value) => {
    return {
      _id: value?._id,
      date: value?.date,
      serviceId: value?.serviceId,
      parentId: value?.parentId,
      name: value?.name,
      mail: value?.mail,
      phone: value?.phone,
      startTime: value?.startTime,
      endTime: value?.endTime,
      serviceStartTime: value?.serviceStartTime,
      serviceEndTime: value?.serviceEndTime,
      expertId: value?.expertId._id,
      expertName: value?.expertId.firstName + " " + value?.expertId.lastName,
    };
  });
  return bookingData;
}

exports.getBookingByIdAndDate = async (req, res, next) => {
  try {
    let userLogin = req?.user;
    let serviceId = req?.params?.id;
    let date = req?.params?.date;

    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);
    if (userLogin?.userType === "admin") {
      const bookingAdmin = await Booking.find({ serviceId, date: bookingDate })
        .sort(
          {
            serviceStartTime: 1,
          },
          { "expertId._id": 1 }
        )
        .populate("expertId");
      let bookingData = getBookingResult(bookingAdmin);
      return res.json(new ApiResponse(200, bookingData));
    } else if (userLogin?.userType === "employee") {
      const bookingEmployee = await Booking.find({
        serviceId,
        date: bookingDate,
        expertId: userLogin?._id,
      })
        .sort(
          {
            serviceStartTime: 1,
          },
          { "expertId._id": 1 }
        )
        .populate("expertId");
      let bookingData = getBookingResult(bookingEmployee);
      return res.json(new ApiResponse(200, bookingData));
    } else {
      return next(new ApiError(400, "Unauthorized"));
    }
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

exports.createUserBooking = async (req, res, next) => {
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
      expertId,
    } = req.body;

    if (
      !date ||
      !serviceId ||
      !name ||
      !mail ||
      !serviceStartTime ||
      !serviceEndTime ||
      !parentId ||
      !expertId
    ) {
      return next(new ApiError(400, "All fields are required."));
    }

    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    const currentDate = getCurrentDateZone();
    const currentTime = getCurrentTimeZone();

    const maxDate = new Date(currentDate);
    maxDate.setUTCDate(maxDate.getUTCDate() + 15);

    if (
      bookingDate < currentDate.setUTCHours(0, 0, 0, 0) ||
      bookingDate > maxDate
    ) {
      return next(
        new ApiError(400, "Booking date must be within the next 15 days")
      );
    }

    const [startHour, startMinute] = serviceStartTime.split(":").map(Number);
    const [endHour, endMinute] = serviceEndTime.split(":").map(Number);

    if (startHour < 9 || endHour > 18 || (endHour === 18 && endMinute > 0)) {
      return next(
        new ApiError(400, "Service time must be between 9:00 AM to 6:00 PM")
      );
    }

    if (bookingDate.getTime() === currentDate.setUTCHours(0, 0, 0, 0)) {
      if (serviceStartTime <= currentTime) {
        return next(
          new ApiError(400, "Cannot book for past times on the current day")
        );
      }
    }

    const overlappingBookings = await Booking.find({
      date: bookingDate,
      // serviceId: serviceId,
      expertId: expertId,
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
      expertId,
    });

    await newBooking.save();
    let response = new ApiResponse(201, newBooking);
    return res.json(response);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error?.message || "An error occurred while creating the booking"
      )
    );
  }
};

exports.getUserBookedTimeSlot = async (req, res, next) => {
  try {
    let { date, expertId, serviceId } = req.params;
    if (!date || !expertId || !serviceId) {
      return next(new ApiError(400, "Parameteres are missing."));
    }

    let paramsDate = new Date(date);

    const checkService = await Service.findOne({ "subService._id": serviceId });

    if (checkService) {
      const matchingSubService = checkService.subService.find(
        (sub) => sub._id.toString() === serviceId
      );

      if (matchingSubService) {
        const result = await Booking.find({
          date: paramsDate,
          serviceId,
          expertId,
        }).select(
          "-id -name -mail -phone -createdAt -updatedAt -expertId -startTime -endTime -__v"
        );
        if (result?.length > 0) {
          let serviceData = result.map((item) => {
            return {
              id: item?._id,
              date: item?.date,
              serviceId: item?.serviceId,
              parentId: item?.parentId,
              serviceStartTime: item?.serviceStartTime,
              serviceEndTime: item?.serviceEndTime,
              serviceName: matchingSubService?.name,
            };
          });
          return res.json(new ApiResponse(200, serviceData));
        } else {
          return res.json(new ApiResponse(200, []));
        }
      }
    } else {
      return next(new ApiError(404, "Service not found."));
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error?.message || "An error occurred while fetching the booking"
      )
    );
  }
};

exports.getUserBookedExpertStatus = async (req, res, next) => {
  try {
    let { date, expertId } = req.params;
    if (!date || !expertId) {
      return next(new ApiError(400, "Parameters are missing."));
    }

    let paramsDate = new Date(date);

    // Use MongoDB aggregate pipeline to lookup services for each booking
    const result = await Booking.aggregate([
      {
        // Match bookings by date and expertId
        $match: {
          date: paramsDate,
          expertId: expertId,
        },
      },
      {
        // Lookup the related service from the Service collection
        $lookup: {
          from: "services", // Collection name
          let: { serviceId: "$serviceId" },
          pipeline: [
            { $unwind: "$subService" }, // Unwind subService array
            {
              // Match the subService._id to the booking's serviceId
              $match: {
                $expr: { $eq: ["$subService._id", "$$serviceId"] },
              },
            },
            {
              // Project the required fields from the service and subService
              $project: {
                _id: 0,
                serviceName: "$subService.name",
              },
            },
          ],
          as: "serviceDetails",
        },
      },
      {
        // Flatten the service details array to an object
        $unwind: "$serviceDetails",
      },
      {
        // Project only the required fields for the response
        $project: {
          id: "$_id",
          date: 1,
          serviceId: 1,
          parentId: 1,
          serviceStartTime: 1,
          serviceEndTime: 1,
          serviceName: "$serviceDetails.serviceName",
        },
      },
    ]);

    // Check if any results found and return the appropriate response
    if (result.length > 0) {
      return res.json(new ApiResponse(200, result));
    } else {
      return res.json(new ApiResponse(200, []));
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error?.message || "An error occurred while fetching expert details."
      )
    );
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    let user = req?.user?.email;
    if (!user) {
      return next(new ApiError(404, "User not found."));
    }

    const bookings = await Booking.aggregate([
      {
        $match: {
          mail: { $regex: new RegExp("^" + user + "$", "i") },
        },
      },

      // Lookup details from the Services collection
      {
        $lookup: {
          from: "services",
          localField: "parentId", // Use parentId to find the service
          foreignField: "_id",
          as: "serviceDetails",
        },
      },

      // Unwind the serviceDetails array to handle it as an object
      {
        $unwind: "$serviceDetails",
      },

      // Unwind the subService array inside serviceDetails to compare subService._id with serviceId
      {
        $unwind: "$serviceDetails.subService",
      },

      // Match serviceId from Booking with subService._id
      {
        $match: {
          $expr: { $eq: ["$serviceId", "$serviceDetails.subService._id"] }, // Compare serviceId with subService._id
        },
      },

      // Convert expertId string to ObjectId
      {
        $addFields: {
          expertId: { $toObjectId: "$expertId" },
        },
      },

      // Lookup expert details from the User collection based on expertId
      {
        $lookup: {
          from: "users",
          localField: "expertId", // Match expertId from the Booking schema
          foreignField: "_id", // Match with the _id field of the User collection
          as: "expertDetails",
        },
      },

      // Unwind expertDetails array to get a flat structure
      {
        $unwind: {
          path: "$expertDetails",
          preserveNullAndEmptyArrays: true, // Ensures bookings without expertId still return results
        },
      },

      // Project only the necessary fields for the output
      {
        $project: {
          _id: 1,
          date: 1,
          serviceStartTime: 1,
          serviceEndTime: 1,
          service: "$serviceDetails.subService.name",
          expertName: {
            $concat: [
              { $ifNull: ["$expertDetails.firstName", ""] },
              " ",
              { $ifNull: ["$expertDetails.lastName", ""] },
            ],
          },
          // expertName: "$expertDetails.firstName",
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    return res.json(new ApiResponse(200, bookings));
  } catch (error) {
    return next(
      new ApiError(
        500,
        error?.message || "An error occurred while fetching my bookings."
      )
    );
  }
};
