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
const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Find all appointments of patient
    const appointments = await Appointment.find({ patient: patientId });

    // Free related availability slots
    for (const a of appointments) {
      if (a.availabilitySlot) {
        const slot = await Availability.findById(a.availabilitySlot);
        if (slot) {
          slot.isBooked = false;
          await slot.save();
        }
      }
    }

    // Delete appointments
    await Appointment.deleteMany({ patient: patientId });

    // Delete patient
    await Patient.findByIdAndDelete(patientId);

    res.json({ msg: "Patient and related records deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete patient" });
  }
};
