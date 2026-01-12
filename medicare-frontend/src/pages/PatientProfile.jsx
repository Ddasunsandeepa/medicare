import { useEffect, useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import "../styles/dashboard.css";
import { useParams } from "react-router-dom";

export default function PatientProfile() {
  const { patientId } = useParams();
  const [history, setHistory] = useState([]);
  const [packages, setPackages] = useState([]);
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const loadData = async () => {
    const [hRes, pRes] = await Promise.all([
      api.get(`/consultations/${patientId}`),
      api.get(`/patient-packages/${patientId}`),
    ]);
    setHistory(hRes.data);
    setPackages(pRes.data);
  };

  useEffect(() => {
    if (!patientId) return; // safety

    const fetchData = async () => {
      const [hRes, pRes] = await Promise.all([
        api.get(`/consultations/${patientId}`),
        api.get(`/patient-packages/${patientId}`),
      ]);
      setHistory(hRes.data);
      setPackages(pRes.data);
    };

    fetchData();
  }, [patientId]);
  const submitNote = async () => {
    await api.post("/consultations", {
      patient: patientId,
      notes,
    });
    setNotes("");
    loadData();
  };

  return (
    <div className="dashboard-card">
      <h2>Patient Health Profile</h2>

      {/* Remaining Sessions */}
      <h3>Active Packages</h3>
      <ul>
        {packages.map((p) => (
          <li key={p._id}>
            {p.package.name} – Remaining Sessions: <b>{p.remainingSessions}</b>
          </li>
        ))}
        {packages.length === 0 && <li>No active packages</li>}
      </ul>

      {/* Doctor Notes */}
      {user.role === "DOCTOR" && (
        <>
          <h3>Add Consultation Note</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter consultation notes..."
            rows="4"
          />
          <button onClick={submitNote}>Save Note</button>
        </>
      )}

      {/* History */}
      <h3>Consultation History</h3>
      <ul>
        {history.map((h) => (
          <li key={h._id}>
            <b>{h.doctor.name}</b>: {h.notes}
          </li>
        ))}
      </ul>
    </div>
  );
}
