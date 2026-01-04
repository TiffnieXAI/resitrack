import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

function LoginBar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      console.log("Login response:", data);

      // Save user info to localStorage
      // Handle both _id (MongoDB) and id formats
      const userId = data.user._id || data.user.id;
      const userRole = data.user.role || "ROLE_USER";
      const userName = data.user.username;

      console.log("Saving to localStorage:", { id: userId, role: userRole, username: userName });

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userId,
          role: userRole,
          username: userName,
        })
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-box-wrapper">
          <p className="login-header">Welcome Back!</p>

          <div className="login-bar-wrapper">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div
            className="sign-up-butt"
            onClick={handleLogin}
            style={{ cursor: "pointer" }}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginBar;