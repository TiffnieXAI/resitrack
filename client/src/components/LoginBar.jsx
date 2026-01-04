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
        credentials: "include", // MUST have this for sessions
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save user info to localStorage for permission checking
      // Adjust these fields according to what your backend sends back!
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user._id || data.user.id, // or however your backend sends the user ID
          role: data.user.role,               // role string e.g. "ROLE_ADMIN"
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
