import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    medicalHistory: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Reload patients failed", err);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/patients");
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to load patients", err);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      medicalHistory: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // UPDATE
      await api.put(`/patients/${editingId}`, form);
    } else {
      // CREATE
      await api.post("/patients", form);
    }

    resetForm();
    loadPatients();
  };

  const handleEdit = (patient) => {
    setEditingId(patient._id);
    setForm({
      fullName: patient.fullName || "",
      email: patient.email || "",
      phone: patient.phone || "",
      medicalHistory: patient.medicalHistory || "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      await api.delete(`/patients/${id}`);
      loadPatients();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Patient Management</h2>

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="medicalHistory"
            placeholder="Medical History"
            value={form.medicalHistory}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? "Update Patient" : "Add Patient"}
          </button>

          {editingId && (
            <button
              type="button"
              style={{ marginLeft: "10px", background: "#6b7280" }}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* Patient List */}
        <h3>Patients</h3>
        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.fullName}</td>
                <td>{p.phone}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>{" "}
                  <button
                    style={{ background: "#dc2626", marginLeft: "5px" }}
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="3" align="center">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
