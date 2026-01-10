const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/appointment.controller");

// All routes require auth
router.use(auth);

// ADMIN / STAFF
router.post("/", role("ADMIN", "STAFF"), controller.createAppointment);
router.get("/", role("ADMIN", "STAFF"), controller.getAppointments);

router.patch(
  "/:id/complete",
  auth,
  role("DOCTOR", "STAFF"),
  controller.completeAppointment
);


// DOCTOR only
router.get("/doctor", auth, role("DOCTOR"), controller.getDoctorAppointments);

// ADMIN / STAFF
router.put("/:id", role("ADMIN", "STAFF"), controller.updateAppointment);
router.patch(
  "/:id/cancel",
  role("ADMIN", "STAFF"),
  controller.cancelAppointment
);

module.exports = router;
