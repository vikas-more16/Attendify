import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config";
import "./TeacherRegister.css";

function TeacherRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const { fullname, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUID = userCredential.user.uid;

      // Post teacher data to backend
      await axios.post(`${API_ENDPOINTS.TEACHERS}/register-firebase`, {
        name: fullname,
        email,
        firebaseUID,
      });

      navigate("/dashboard", { replace: true });
      // Set the flag after navigation to ensure registration is complete before context GET runs
      localStorage.setItem("teacherRegistered", "true");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-wrapper d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="register-box p-4 rounded bg-white shadow">
        <div className="text-center mb-4">
          <img
            src="https://img.icons8.com/ios-filled/50/graduation-cap.png"
            alt="graduation cap"
            style={{ width: "40px", marginBottom: "10px" }}
          />
          <h3 className="fw-bold">Teacher Registration</h3>
          <p className="text-muted">
            Create your account to start managing attendance
          </p>
        </div>

        <form onSubmit={handleRegistration}>
          <div className="mb-3">
            <label htmlFor="fullname" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn btn-dark w-100 fw-bold">
            Create Account
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          Already have an account?{" "}
          <a href="/" className="text-decoration-none">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}

export default TeacherRegister;
