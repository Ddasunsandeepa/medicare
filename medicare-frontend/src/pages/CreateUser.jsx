import { useState } from "react";
import api from "../api/axios";
import "../styles/auth.css";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/create-user", form);
      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create User</h2>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <select name="role" onChange={handleChange}>
          <option value="">Select role</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="DOCTOR">Doctor</option>
          <option value="PATIENT">Patient</option>
        </select>

        <button>Create User</button>
      </form>
    </div>
  );
}
