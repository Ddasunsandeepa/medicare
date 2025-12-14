const Appointment = require("../models/Appointment");

// CREATE appointment (with double-booking check)
const Availability = require("../models/Availability");

exports.createAppointment = async (req, res) => {
  const { patient, availabilitySlot } = req.body;

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

  // Mark slot as booked
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
    }).populate("patient", "fullName");

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
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "CANCELLED" },
      { new: true }
    );
    res.json(appointment);
  } catch {
    res.status(500).json({ msg: "Failed to cancel appointment" });
  }
};
