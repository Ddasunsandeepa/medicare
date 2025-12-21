import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function Billing() {
  const [patients, setPatients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    packageId: "",
    membership: "NONE",
  });

  const loadData = async () => {
    try {
      const [pRes, pkgRes, bRes] = await Promise.all([
        api.get("/patients"),
        api.get("/packages"),
        api.get("/bills"),
      ]);
      setPatients(pRes.data);
      setPackages(pkgRes.data);
      setBills(bRes.data);
    } catch (err) {
      console.error("Reload failed", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, pkgRes, bRes] = await Promise.all([
          api.get("/patients"),
          api.get("/packages"),
          api.get("/bills"),
        ]);

        setPatients(pRes.data);
        setPackages(pkgRes.data);
        setBills(bRes.data);
      } catch (err) {
        console.error("Failed to load billing data", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/bills", form);
    setForm({
      patient: "",
      packageId: "",
      membership: "NONE",
    });
    loadData();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Billing & Payments</h2>

        {/* Generate Bill */}
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
            name="packageId"
            value={form.packageId}
            onChange={handleChange}
            required
          >
            <option value="">Select Package</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name} - Rs.{pkg.price}
              </option>
            ))}
          </select>

          <select
            name="membership"
            value={form.membership}
            onChange={handleChange}
          >
            <option value="NONE">No Membership</option>
            <option value="SILVER">Silver (5%)</option>
            <option value="GOLD">Gold (10%)</option>
            <option value="PLATINUM">Platinum (15%)</option>
          </select>

          <button type="submit">Generate Bill</button>
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* Bills List */}
        <h3>Generated Bills</h3>
        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Package</th>
              <th>Base</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b._id}>
                <td>{b.patient?.fullName}</td>
                <td>{b.package?.name}</td>
                <td>Rs.{b.baseAmount}</td>
                <td>Rs.{b.discount}</td>
                <td>Rs.{b.tax}</td>
                <td>
                  <b>Rs.{b.totalAmount}</b>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan="6" align="center">
                  No bills generated
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
