const Consultation = require("../models/Consultation");

exports.addNote = async (req, res) => {
  const { patient, appointment, notes } = req.body;

  const record = await Consultation.create({
    patient,
    doctor: req.user.id,
    appointment,
    notes,
  });

  res.status(201).json(record);
};

exports.getPatientHistory = async (req, res) => {
  const history = await Consultation.find({ patient: req.params.patientId })
    .populate("doctor", "name")
    .sort({ createdAt: -1 });

  res.json(history);
};
