const router = require("express").Router();
const {
  register,
  login,
  forgotPassword,
} = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.get("/me", auth, (req, res) => {
  res.json({ msg: "Protected route accessed", user: req.user });
});

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

// ONLY ADMIN & DOCTOR
router.get("/secure-data", auth, role("ADMIN", "DOCTOR"), (req, res) => {
  res.json({
    msg: "Access granted to ADMIN / DOCTOR",
    role: req.user.role,
  });
});

module.exports = router;
