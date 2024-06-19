const mongoose = require("mongoose");

function getCosts(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: mongoose.Types.Decimal128,
      required: true,
      trim: true,
      get: getCosts,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
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
    stock: {
      type: Number,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model("Inventory", inventorySchema);
