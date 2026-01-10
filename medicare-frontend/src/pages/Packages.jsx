import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import "../styles/dashboard.css";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Fitness",
    sessions: "",
    price: "",
  });

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const loadPackages = async () => {
    const res = await api.get("/packages");
    setPackages(res.data);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/packages");
        setPackages(res.data);
      } catch (err) {
        console.error("Failed to load packages", err);
      }
    };

    fetchPackages();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/packages", form);
      setForm({ name: "", category: "Fitness", sessions: "", price: "" });
      loadPackages();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create package");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Wellness Packages</h2>

        {/* ADMIN CREATE PACKAGE */}
        {user?.role === "ADMIN" && (
          <>
            <h3>Create Package</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Package Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Fitness">Fitness</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Detox">Detox</option>
                <option value="Stress">Stress</option>
              </select>

              <input
                type="number"
                name="sessions"
                placeholder="Sessions"
                value={form.sessions}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price (LKR)"
                value={form.price}
                onChange={handleChange}
                required
              />

              <button type="submit">Create Package</button>
            </form>

            <hr style={{ margin: "20px 0" }} />
          </>
        )}

        {/* PACKAGE LIST */}
        <h3>Available Packages</h3>
        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Sessions</th>
              <th>Price (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.sessions}</td>
                <td>{p.price}</td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan="4" align="center">
                  No packages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
