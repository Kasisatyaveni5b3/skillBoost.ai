export default function FeatureCard({ title, description, icon }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      width: "280px",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff"
    }}>
      <img src={icon} alt={title} style={{ height: "100px",marginBottom: "10px" }} />
      <h3>{title}</h3>
      <p style={{ fontSize: "14px", color: "#555" }}>{description}</p>
    </div>
  );
}
