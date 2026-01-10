import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function Appointments() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    availabilitySlot: "",
  });

  const loadInitialData = async () => {
    const [p, d, a] = await Promise.all([
      api.get("/patients"),
      api.get("/auth/users?role=DOCTOR"),
      api.get("/appointments"),
    ]);
    setPatients(p.data);
    setDoctors(d.data);
    setAppointments(a.data);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [p, d, a] = await Promise.all([
          api.get("/patients"),
          api.get("/auth/users?role=DOCTOR"),
          api.get("/appointments"),
        ]);

        setPatients(p.data);
        setDoctors(d.data);
        setAppointments(a.data);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };

    fetchInitialData();
  }, []);

  // Load availability when doctor changes
  const loadSlots = async (doctorId) => {
    if (!doctorId) return;
    const res = await api.get(`/availability/${doctorId}`);
    setSlots(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "doctor") {
      setForm((prev) => ({
        ...prev,
        doctor: value,
        availabilitySlot: "",
      }));
      loadSlots(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/appointments", {
        patient: form.patient,
        availabilitySlot: form.availabilitySlot,
      });

      alert("Appointment booked successfully");
      setForm({ patient: "", doctor: "", availabilitySlot: "" });
      setSlots([]);
      loadInitialData();
    } catch (err) {
      alert(err.response?.data?.msg || "Booking failed");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Book Appointment</h2>

        {/* BOOK FORM */}
        <form onSubmit={handleSubmit}>
          {/* Patient */}
          <select
            name="patient"
            value={form.patient}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.fullName}
              </option>
            ))}
          </select>

          {/* Doctor */}
          <select
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Availability Slots */}
          <select
            name="availabilitySlot"
            value={form.availabilitySlot}
            onChange={handleChange}
            required
          >
            <option value="">Select Available Slot</option>
            {slots.map((s) => {
              const isPast = new Date(s.date) < new Date().setHours(0, 0, 0, 0);
              return (
                <option
                  key={s._id}
                  value={s._id}
                  disabled={s.isBooked || isPast}
                >
                  {new Date(s.date).toLocaleDateString()} – {s.timeSlot}
                  {s.isBooked ? " (Booked)" : isPast ? " (Past)" : ""}
                </option>
              );
            })}
          </select>

          <button type="submit">Book Appointment</button>
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* APPOINTMENT LIST */}
        <h3>Appointments</h3>
        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patient?.fullName}</td>
                <td>{a.doctor?.name}</td>
                <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                <td>{a.timeSlot}</td>
                <td>{a.status}</td>
                <td>
                  {a.status === "BOOKED" && (
                    <>
                      <button
                        style={{ background: "#dc2626", marginRight: "5px" }}
                        onClick={async () => {
                          if (window.confirm("Cancel this appointment?")) {
                            await api.patch(`/appointments/${a._id}/cancel`);
                            loadInitialData();
                          }
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        style={{ background: "blue", color: "white" }}
                        onClick={async () => {
                          await api.patch(`/appointments/${a._id}/complete`);
                          loadInitialData();
                        }}
                      >
                        Complete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {appointments.length === 0 && (
              <tr>
                <td colSpan="6" align="center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
