const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/consultation.controller");

router.use(auth);

router.post("/", role("DOCTOR"), controller.addNote);
router.get(
  "/:patientId",
  role("DOCTOR", "STAFF"),
  controller.getPatientHistory
);

module.exports = router;
