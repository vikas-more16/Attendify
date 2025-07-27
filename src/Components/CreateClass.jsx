import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Context/context";
import { API_ENDPOINTS } from "../config";

function CreateClass() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { teacherId } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_ENDPOINTS.CLASSES}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId,
          className,
          subject,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Unknown error");

      alert("Class created successfully!");
      setClassName("");
      setSubject("");
    } catch (err) {
      console.error("Error creating class:", err.message);
    }
  };

  return (
    <div
      className="login-wrapper d-flex justify-content-center align-items-center vh-60 bg-light"
      style={{ minHeight: "60vh" }}
    >
      <div className="login-box p-4 rounded bg-white shadow">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create New Class</h3>
          <p className="text-muted">
            Add a new class to start managing attendance
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="className" className="form-label">
              Class Name
            </label>
            <input
              type="text"
              className="form-control"
              id="className"
              placeholder="Enter your class name here ..."
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              className="form-control"
              id="subject"
              placeholder="Enter your subject here ..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">
            Create Class
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateClass;
