const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      redf: "User",
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },
    bookingIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
      },
    ],
    tax: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "credit_card", "zelle"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
