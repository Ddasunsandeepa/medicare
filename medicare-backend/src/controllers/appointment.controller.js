const Appointment = require("../models/Appointment");
const PatientPackage = require("../models/PatientPackage");
// CREATE appointment (with double-booking check)
const Availability = require("../models/Availability");
const Patient = require("../models/Patient");
const User = require("../models/User");
const { sendAppointmentEmail } = require("../utils/email");

exports.createAppointment = async (req, res) => {
  try {
    const { patient, availabilitySlot } = req.body;

    const patientPackage = await PatientPackage.findOne({
      patient,
      remainingSessions: { $gt: 0 },
    });

    if (!patientPackage) {
      return res.status(400).json({ msg: "No remaining package sessions" });
    }

    const slot = await Availability.findById(availabilitySlot);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ msg: "Slot not available" });
    }

    const appointment = await Appointment.create({
      patient,
      doctor: slot.doctor,
      appointmentDate: slot.date,
      timeSlot: slot.timeSlot,
      availabilitySlot,
      createdBy: req.user.id,
    });

    slot.isBooked = true;
    await slot.save();

    const patientData = await Patient.findById(patient);
    const doctorData = await User.findById(slot.doctor);

    if (patientData?.email) {
      await sendAppointmentEmail({
        to: patientData.email,
        name: patientData.fullName,
        doctor: doctorData?.name || "Assigned Doctor",
        date: new Date(appointment.appointmentDate).toLocaleDateString(),
        time: appointment.timeSlot,
      });
    }

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create appointment" });
  }
};

// GET all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "fullName")
      .populate("doctor", "name role")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch {
    res.status(500).json({ msg: "Failed to fetch appointments" });
  }
};

// GET appointments for logged-in doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate("patient", "fullName")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch {
    res.status(500).json({ msg: "Failed to fetch doctor appointments" });
  }
};

// UPDATE (reschedule)
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(appointment);
  } catch {
    res.status(500).json({ msg: "Failed to update appointment" });
  }
};

// CANCEL appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // Free the availability slot
    const slot = await Availability.findById(appointment.availabilitySlot);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    appointment.status = "CANCELLED";
    await appointment.save();

    res.json({ msg: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to cancel appointment" });
  }
};

exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Not found" });

    if (appointment.status === "COMPLETED") {
      return res.status(400).json({ msg: "Already completed" });
    }

    appointment.status = "COMPLETED";
    await appointment.save();

    const patientPackage = await PatientPackage.findOne({
      patient: appointment.patient,
      remainingSessions: { $gt: 0 },
    });

    if (patientPackage) {
      patientPackage.remainingSessions -= 1;
      await patientPackage.save();
    }

    res.json({ msg: "Appointment completed & session deducted" });
  } catch {
    res.status(500).json({ msg: "Failed to complete appointment" });
  }
};
