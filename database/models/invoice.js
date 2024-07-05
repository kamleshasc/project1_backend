const mongoose = require("mongoose");

function getCosts(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

const invoiceSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      ref: "Client",
      required: true,
      trim: true,
    },
    employee: {
      type: String,
      ref: "User",
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    selectedService: [
      {
        _id: false,
        id: {
          type: mongoose.Schema.ObjectId,
          ref: "Services",
          required: true,
        },
        service: {
          type: String,
          required: true,
          trim: true,
        },
        duration: {
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
      },
    ],
    dateOfInvoice: {
      type: String,
      required: true,
      trim: true,
    },
    invoiceNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    total: {
      type: mongoose.Types.Decimal128,
      required: true,
      trim: true,
      get: getCosts,
    },
    tax: {
      type: Number,
      required: true,
      trim: true,
    },
    finalTotal: {
      type: mongoose.Types.Decimal128,
      required: true,
      trim: true,
      get: getCosts,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
