const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const PatientPackage = require("../models/PatientPackage");

router.use(auth);

router.get("/:patientId", role("DOCTOR", "STAFF"), async (req, res) => {
  if (!req.params.patientId) {
    return res.status(400).json({ msg: "Patient ID missing" });
  }

  const data = await PatientPackage.find({
    patient: req.params.patientId,
  }).populate("package", "name");

  res.json(data);
});

module.exports = router;
