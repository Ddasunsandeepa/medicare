import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/doctor");
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>My Appointments</h2>

        <ul>
          {appointments.map((a) => (
            <li key={a._id}>
              {a.patient?.fullName} on{" "}
              {new Date(a.appointmentDate).toLocaleDateString()} ({a.timeSlot})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
