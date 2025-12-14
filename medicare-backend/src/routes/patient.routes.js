const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/patient.controller");

// Only ADMIN, STAFF, DOCTOR
router.use(auth, role("ADMIN", "STAFF", "DOCTOR"));

router.post("/", controller.createPatient);
router.get("/", controller.getPatients);
router.get("/:id", controller.getPatientById);
router.put("/:id", controller.updatePatient);
router.delete("/:id", controller.deletePatient);

module.exports = router;
