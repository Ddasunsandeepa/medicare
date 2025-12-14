const Appointment = require("../models/Appointment");

// CREATE appointment (with double-booking check)
exports.createAppointment = async (req, res) => {
  try {
    const { patient, doctor, appointmentDate, timeSlot } = req.body;

    if (!patient || !doctor || !appointmentDate || !timeSlot) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Prevent double booking
    const existing = await Appointment.findOne({
      doctor,
      appointmentDate,
      timeSlot,
      status: "BOOKED",
    });

    if (existing) {
      return res
        .status(400)
        .json({ msg: "Doctor already booked for this time slot" });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      appointmentDate,
      timeSlot,
      createdBy: req.user.id,
    });

    res.status(201).json(appointment);
  } catch (error) {
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
