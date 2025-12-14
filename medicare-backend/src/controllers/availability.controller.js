const Availability = require("../models/Availability");

// Doctor adds availability
exports.addAvailability = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;

    const exists = await Availability.findOne({
      doctor: req.user.id,
      date,
      timeSlot,
    });

    if (exists) {
      return res.status(400).json({ msg: "Slot already exists" });
    }

    const slot = await Availability.create({
      doctor: req.user.id,
      date,
      timeSlot,
    });

    res.status(201).json(slot);
  } catch {
    res.status(500).json({ msg: "Failed to add availability" });
  }
};
