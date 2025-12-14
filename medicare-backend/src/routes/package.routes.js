const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/package.controller");

router.use(auth);

router.post("/", role("ADMIN"), controller.createPackage);
router.get("/", role("ADMIN", "STAFF"), controller.getPackages);

module.exports = router;
