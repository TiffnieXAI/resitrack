import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include", // important to send cookies
      });

      if (res.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div onClick={handleLogout} style={{ cursor: "pointer" }} className="logoutButt">
      Logout
    </div>
  );
}

export default Logout;
