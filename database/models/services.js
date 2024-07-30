const mongoose = require("mongoose");

function getCosts(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

const subServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
      trim: true,
      get: getCosts,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { toJSON: { getters: true } }
);

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
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
    selectedUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    serviceImage: {
      type: String,
      required: true,
      trim: true,
    },
    subService: [subServiceSchema],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", serviceSchema);
