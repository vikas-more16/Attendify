import { useNavigate } from "react-router-dom";
import "./TeacherLogin.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Firebase sign-in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Login successful, now navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="login-box p-4 rounded bg-white shadow mt-5">
        <div className="text-center mb-4">
          <img
            src="https://img.icons8.com/ios-filled/50/graduation-cap.png"
            alt="cap"
            style={{ width: "40px", marginBottom: "10px" }}
          />
          <h3 className="fw-bold">Teacher Login</h3>
          <p className="text-muted">
            Sign in to manage your classes and attendance
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.edu"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Sign In
          </button>

          {errorMessage && (
            <div className="alert alert-danger py-2 mt-3" role="alert">
              {errorMessage}
            </div>
          )}
        </form>

        <p className="text-center mt-3 text-muted">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register-form")}
            className="btn btn-link p-0"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default TeacherLogin;
