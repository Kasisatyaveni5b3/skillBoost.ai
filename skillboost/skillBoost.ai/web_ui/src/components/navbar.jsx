import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/me", {
          withCredentials: true,
        });
        setUsername(res.data.name);
      } catch (err) {
        console.error("Error fetching user info", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      setUsername("");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <header
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ margin: 0, marginRight: "20px" }}>SkillBoost.ai</h2>
          {username && (
            <span style={{ fontSize: "14px", color: "#ccc", marginRight: "20px" }}>
              Welcome, {username}
            </span>
          )}
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link to="/home" style={linkStyle}>Home</Link>
          <Link to="/practise" style={linkStyle}>Practice</Link>
          <Link to="/profile" style={linkStyle}>Profile</Link>
          {username && (
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          )}
        </nav>
      </header>

      <main style={{ padding: "30px", minHeight: "80vh" }}>
        <Outlet />
      </main>

      <footer
        style={{
          backgroundColor: "#f3f4f6",
          textAlign: "center",
          padding: "15px",
          color: "#555",
        }}
      >
        © 2025 SkillBoost.ai — All Rights Reserved
      </footer>
    </div>
  );
}

const linkStyle = {
  color: "white",
  marginRight: "20px",
  textDecoration: "none",
  fontWeight: "bold",
};

const logoutButtonStyle = {
  backgroundColor: "#ef4444",
  border: "none",
  color: "white",
  padding: "8px 16px",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};
