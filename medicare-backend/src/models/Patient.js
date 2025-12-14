const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    nic: { type: String },
    email: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    medicalHistory: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
