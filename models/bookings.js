const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    serviceId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Services",
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mail: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    serviceStartTime: {
      type: String,
      required: true,
      trim: true,
    },
    serviceEndTime: {
      type: String,
      required: true,
      trim: true,
    },
    expertId: {
      type: mongoose.Schema.ObjectId,
      tim: true,
      ref: "User",
      default: null,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleteBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
