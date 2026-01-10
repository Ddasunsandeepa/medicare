const Availability = require("../models/Availability");

// Doctor adds availability
exports.addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, slotDuration } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    if (selectedDate < today) {
      return res
        .status(400)
        .json({ msg: "Cannot add availability for past dates" });
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (end <= start) {
      return res.status(400).json({ msg: "End time must be after start time" });
    }

    const duration = Number(slotDuration) * 60000; // minutes → ms
    const slots = [];
    let current = new Date(start);

    while (current < end) {
      const next = new Date(current.getTime() + duration);
      if (next > end) break;

      const timeSlot = `${current.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${next.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      const exists = await Availability.findOne({
        doctor: req.user.id,
        date,
        timeSlot,
      });

      if (!exists) {
        slots.push({
          doctor: req.user.id,
          date,
          timeSlot,
          isBooked: false,
        });
      }

      current = next;
    }

    await Availability.insertMany(slots);
    res.status(201).json({ msg: `${slots.length} slots created` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add availability" });
  }
};

exports.updateAvailability = async (req, res) => {
  const slot = await Availability.findById(req.params.id);
  if (!slot) return res.status(404).json({ msg: "Slot not found" });

  if (slot.isBooked) {
    return res.status(400).json({ msg: "Cannot edit booked slot" });
  }

  slot.date = req.body.date;
  slot.timeSlot = req.body.timeSlot;
  await slot.save();

  res.json(slot);
};

exports.deleteAvailability = async (req, res) => {
  const slot = await Availability.findById(req.params.id);
  if (!slot) return res.status(404).json({ msg: "Slot not found" });

  if (slot.isBooked) {
    return res.status(400).json({ msg: "Cannot delete booked slot" });
  }

  await slot.deleteOne();
  res.json({ msg: "Slot deleted" });
};
