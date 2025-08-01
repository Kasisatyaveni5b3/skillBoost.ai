import { Link, Outlet } from "react-router-dom";

export default function Navbar() {
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
          height:'5rem'
        }}
      >
        <h2 style={{ margin: 0 }}>SkillBoost.ai</h2>
        <nav>
          <Link to="/home" style={linkStyle}>
            Home
          </Link>
          <Link to="/practise" style={linkStyle}>
            Practice
          </Link>
          <Link to="/profile" style={linkStyle}>
            Profile
          </Link>
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
