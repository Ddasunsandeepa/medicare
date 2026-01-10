import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function DoctorAvailability() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    date: "",
    timeSlot: "",
  });

  const loadSlots = async () => {
    try {
      const res = await api.get("/availability/me");
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to load slots", err);
    }
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get("/slots");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/availability", form);
      setForm({ date: "", timeSlot: "" });
      loadSlots();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add slot");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>My Availability</h2>

        {/* Add Availability */}
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            name="date"
            value={form.date}
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

          <button type="submit">Add Slot</button>
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* Availability List */}
        <h3>Available Slots</h3>
        <ul>
          {slots.map((s) => (
            <li key={s._id}>
              {new Date(s.date).toLocaleDateString()} – {s.timeSlot}{" "}
              {s.isBooked && "(Booked)"}
            </li>
          ))}
          {slots.length === 0 && <p>No availability added yet</p>}
        </ul>
      </div>
    </div>
  );
}
