const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    onsiteOffsite: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    selectedBranches: {
      type: [String],
      required: true,
    },
    selectedUsers: {
      type: [String],
      required: true,
    },
    serviceImage: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", serviceSchema);
