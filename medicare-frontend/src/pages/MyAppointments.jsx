import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

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

        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.patient?.fullName}</td>
                <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                <td>{a.timeSlot}</td>
                <td>
                  {a.status === "CANCELLED" && (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      CANCELLED
                    </span>
                  )}
                  {a.status === "COMPLETED" && (
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      COMPLETED
                    </span>
                  )}
                  {a.status === "BOOKED" && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      BOOKED
                    </span>
                  )}
                </td>

                <td>
                  <Link to={`/patientProfile/${a.patient._id}`}>
                    {a.patient.fullName}
                  </Link>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="4" align="center">
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
