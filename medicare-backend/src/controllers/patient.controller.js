const Patient = require("../models/Patient");

// Create patient
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create patient" });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch {
    res.status(500).json({ msg: "Failed to fetch patients" });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ msg: "Patient not found" });
    res.json(patient);
  } catch {
    res.status(500).json({ msg: "Error retrieving patient" });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(patient);
  } catch {
    res.status(500).json({ msg: "Failed to update patient" });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ msg: "Patient deleted" });
  } catch {
    res.status(500).json({ msg: "Failed to delete patient" });
  }
};
