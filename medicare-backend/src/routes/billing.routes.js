const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/billing.controller");

router.use(auth);

router.post("/", role("ADMIN", "STAFF"), controller.generateBill);
router.get("/", role("ADMIN", "STAFF"), controller.getBills);

module.exports = router;
