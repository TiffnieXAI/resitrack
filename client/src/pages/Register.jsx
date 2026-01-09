import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (!formData.username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Success - redirect to login
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="reg-wrapper">
          <div className="reg-container">
            <br />
            <p className="register-head">Registration</p>
            <br />

            <form onSubmit={handleSubmit}>
              {error && <p className="error-message">{error}</p>}

              <div className="reg-tab">
                <p>Username</p>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="At least 3 characters"
                  disabled={loading}
                  required
                />
              </div>
              <br />

              <div className="reg-tab">
                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  disabled={loading}
                  required
                />
              </div>
              <br />

              <div className="reg-tab">
                <p>Confirm Password</p>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                  required
                />
              </div>
              <br />

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Submit"}
              </button>
            </form>

            <p style={{ marginTop: "20px", textAlign: "center" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#00eaff", cursor: "pointer" }}>
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;