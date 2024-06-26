const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: Object,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    addressLineOne: {
      type: String,
      required: true,
      trim: true,
    },
    addressLineTwo: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    prefix: {
      enum: ["Mr.", "Mrs.", "Ms.", "Dr."],
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
