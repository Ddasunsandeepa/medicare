const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/availability.controller");

// Doctor only
router.post("/", auth, role("DOCTOR"), controller.addAvailability);

// Staff/Admin view available slots
router.get("/:doctorId", auth, role("ADMIN", "STAFF"), async (req, res) => {
  const slots = await require("../models/Availability").find({
    doctor: req.params.doctorId,
    isBooked: false,
  });
  res.json(slots);
});

module.exports = router;
