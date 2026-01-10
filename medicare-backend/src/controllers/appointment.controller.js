const Appointment = require("../models/Appointment");

// CREATE appointment (with double-booking check)
const Availability = require("../models/Availability");

exports.createAppointment = async (req, res) => {
  const { patient, availabilitySlot } = req.body;

  const slot = await Availability.findById(availabilitySlot);
  if (!slot || slot.isBooked) {
    return res.status(400).json({ msg: "Slot not available" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const slotDate = new Date(slot.date);
  if (slotDate < today) {
    return res
      .status(400)
      .json({ msg: "Cannot book appointments in the past" });
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

  res.status(201).json(appointment);
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

const PatientPackage = require("../models/PatientPackage");

exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Not found" });

    appointment.status = "COMPLETED";
    await appointment.save();

    // Deduct session
    const patientPackage = await PatientPackage.findOne({
      patient: appointment.patient,
    });

    if (patientPackage && patientPackage.remainingSessions > 0) {
      patientPackage.remainingSessions -= 1;
      await patientPackage.save();
    }

    res.json({ msg: "Appointment completed & session deducted" });
  } catch {
    res.status(500).json({ msg: "Failed to complete appointment" });
  }
};
