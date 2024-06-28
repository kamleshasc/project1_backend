const mongoose = require("mongoose");

function getCosts(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }
  return value;
}

const commissionRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    criteria: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getCosts,
    },
    applicableUser: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    ],
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

module.exports = mongoose.model("CommissionRule", commissionRuleSchema);
