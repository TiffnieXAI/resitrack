import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, []);

  return children;
}

export default AuthGuard;
