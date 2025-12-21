import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    appointmentDate: "",
    timeSlot: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    try {
      const [a, p, d] = await Promise.all([
        api.get("/appointments"),
        api.get("/patients"),
        api.get("/auth/users?role=DOCTOR"),
      ]);
      setAppointments(a.data);
      setPatients(p.data);
      setDoctors(d.data);
    } catch (err) {
      console.error("Reload failed", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, p, d] = await Promise.all([
          api.get("/appointments"),
          api.get("/patients"),
          api.get("/auth/users?role=DOCTOR"),
        ]);

        setAppointments(a.data);
        setPatients(p.data);
        setDoctors(d.data);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      patient: "",
      doctor: "",
      appointmentDate: "",
      timeSlot: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/appointments/${editingId}`, form);
    } else {
      await api.post("/appointments", form);
    }

    resetForm();
    loadData();
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setForm({
      patient: a.patient?._id || "",
      doctor: a.doctor?._id || "",
      appointmentDate: a.appointmentDate?.substring(0, 10),
      timeSlot: a.timeSlot || "",
    });
  };

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this appointment?")) {
      await api.patch(`/appointments/${id}/cancel`);
      loadData();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Appointment Management</h2>

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit}>
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

          <input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />

          <input
            name="timeSlot"
            placeholder="Time Slot (e.g. 09:00 - 09:30)"
            value={form.timeSlot}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Appointment" : "Book Appointment"}
          </button>

          {editingId && (
            <button
              type="button"
              style={{ marginLeft: "10px", background: "#6b7280" }}
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* Appointment List */}
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
                  <button onClick={() => handleEdit(a)}>Edit</button>{" "}
                  {a.status === "BOOKED" && (
                    <button
                      style={{ background: "#dc2626", marginLeft: "5px" }}
                      onClick={() => handleCancel(a._id)}
                    >
                      Cancel
                    </button>
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
