const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    membership: {
      type: String,
      enum: ["NONE", "SILVER", "GOLD", "PLATINUM"],
      default: "NONE",
    },
    baseAmount: Number,
    discount: Number,
    tax: Number,
    totalAmount: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", BillSchema);
