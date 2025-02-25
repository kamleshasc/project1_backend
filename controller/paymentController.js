// const Payment = require("../models/payment");
const Booking = require("../models/bookings");
const Payment = require("../models/payment");
const ApiError = require("../utils/ApiError");
const Apiresponse = require("../utils/Apiresponse");
const {
  getZeroTimeInNewYork,
  generateTransactionId,
} = require("../utils/helper");

exports.getPaymentByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return next(new ApiError(400, "Date is required."));
    }

    const bookingDateConvert = new Date(date);

    const bookingDate = await Booking.aggregate([
      {
        $match: {
          date: bookingDateConvert,
          isDeleted: false,
          isPaymentDone: false,
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "parentId",
          foreignField: "_id",
          as: "parentService",
        },
      },
      { $unwind: "$parentService" },
      { $unwind: "$parentService.subService" },
      {
        $match: {
          $expr: { $eq: ["$serviceId", "$parentService.subService._id"] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "expertId",
          foreignField: "_id",
          as: "expertDetails",
        },
      },
      {
        $unwind: "$expertDetails",
      },
      {
        $project: {
          _id: 1,
          date: 1,
          parentId: 1,
          mail: 1,
          phone: 1,
          serviceStartTime: 1,
          serviceEndTime: 1,
          isDeleted: 1,
          deleteBy: 1,
          customerId: "$userId",
          customerName: "$name",
          expert: {
            _id: "$expertDetails._id",
            name: {
              $concat: [
                "$expertDetails.firstName",
                " ",
                "$expertDetails.lastName",
              ],
            },
          },
          subServiceDetails: {
            name: "$parentService.subService.name",
            price: { $toDouble: "$parentService.subService.price" },
            duration: "$parentService.subService.duration",
            _id: "$parentService.subService._id",
            category: "$parentService.category",
          },
        },
      },
    ]);

    return res.json(new Apiresponse(200, bookingDate));
  } catch (error) {
    return next(
      new ApiError(
        500,
        error?.message || "An error occured while getting payment by date."
      )
    );
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const {
      customerId,
      customerName,
      bookingIds,
      total,
      subTotal,
      tax,
      paymentMethod,
    } = req.body;

    if (
      !customerName ||
      !bookingIds ||
      !total ||
      !paymentMethod ||
      !subTotal ||
      !tax
    ) {
      return next(new ApiError(400, "All fields are required."));
    }

    const currentDateNewYork = getZeroTimeInNewYork();
    const transactionId = generateTransactionId();

    const checkBookingExisting = await Booking.find({
      _id: { $in: bookingIds },
      isPaymentDone: true,
    });

    if (checkBookingExisting.length > 0) {
      return next(new ApiError(400, "Booking is already paid."));
    }

    const newPayment = new Payment({
      paymentDate: currentDateNewYork,
      customerName,
      bookingIds,
      total,
      paymentMethod,
      transactionId,
      subTotal,
      tax,
      paymentStatus: "completed",
    });

    if (customerId) {
      newPayment.customerId = customerId;
    }

    await newPayment.save();

    await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { isPaymentDone: true }
    );

    return res.json(new Apiresponse(201, "Payment successfull."));
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "An error occured while creating payment."
      )
    );
  }
};
