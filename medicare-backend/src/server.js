const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/patients", require("./routes/patient.routes"));
app.use("/api/appointments", require("./routes/appointment.routes"));
app.use("/api/packages", require("./routes/package.routes"));
app.use("/api/bills", require("./routes/billing.routes"));
app.use("/api/availability", require("./routes/availability.routes"));
app.use("/api/patient-packages", require("./routes/patientPackage.routes"));
app.use("/api/consultations", require("./routes/consultation.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
