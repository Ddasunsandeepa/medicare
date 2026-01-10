const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/availability.controller");

// Doctor only
router.post("/", auth, role("DOCTOR"), controller.addAvailability);

// Doctor view own availability
router.get("/me", auth, role("DOCTOR"), async (req, res) => {
  const slots = await require("../models/Availability").find({
    doctor: req.user.id,
  });
  res.json(slots);
});

// Staff/Admin view available slots
router.get("/:doctorId", auth, role("ADMIN", "STAFF"), async (req, res) => {
  const slots = await require("../models/Availability").find({
    doctor: req.params.doctorId,
    isBooked: false,
  });
  res.json(slots);
});

module.exports = router;
