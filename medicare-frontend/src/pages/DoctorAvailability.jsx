import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function DoctorAvailability() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    slotDuration: 30,
  });

  const [editingId, setEditingId] = useState(null);

  const loadSlots = async () => {
    const res = await api.get("/availability/me");
    setSlots(res.data);
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get("/availability/me");
        setSlots(res.data);
      } catch (err) {
        console.error("Failed to load slots", err);
      }
    };

    fetchSlots();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ date: "", timeSlot: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/availability/${editingId}`, form);
      } else {
        await api.post("/availability", form);
      }

      resetForm();
      loadSlots();
    } catch (err) {
      alert(err.response?.data?.msg || "Operation failed");
    }
  };

  const handleEdit = (slot) => {
    if (slot.isBooked) {
      alert("Cannot edit a booked slot");
      return;
    }

    setEditingId(slot._id);
    setForm({
      date: slot.date.substring(0, 10),
      timeSlot: slot.timeSlot,
    });
  };

  const handleDelete = async (slot) => {
    if (slot.isBooked) {
      alert("Cannot delete a booked slot");
      return;
    }

    if (window.confirm("Delete this slot?")) {
      await api.delete(`/availability/${slot._id}`);
      loadSlots();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>My Availability</h2>

        {/* ADD / EDIT FORM */}
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
          <select
            name="slotDuration"
            value={form.slotDuration}
            onChange={handleChange}
            required
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>

          <button type="submit">
            {editingId ? "Update Slot" : "Add Slot"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "10px", background: "#6b7280" }}
            >
              Cancel
            </button>
          )}
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* SLOT LIST */}
        <h3>My Slots</h3>
        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s._id}>
                <td>{new Date(s.date).toLocaleDateString()}</td>
                <td>{s.timeSlot}</td>
                <td>
                  {s.isBooked ? (
                    <span style={{ color: "red" }}>Booked</span>
                  ) : (
                    <span style={{ color: "green" }}>Available</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(s)} disabled={s.isBooked}>
                    Edit
                  </button>{" "}
                  <button
                    style={{ background: "#dc2626" }}
                    onClick={() => handleDelete(s)}
                    disabled={s.isBooked}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {slots.length === 0 && (
              <tr>
                <td colSpan="4" align="center">
                  No slots added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
