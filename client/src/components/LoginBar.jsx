import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginBar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/login", { // fixed URL here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 REQUIRED
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ LOGIN SUCCESS
      navigate("/"); // redirect to dashboard
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
