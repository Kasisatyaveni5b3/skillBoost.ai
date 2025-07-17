import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

export default function Practise() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [experience, setExperience] = useState("");
  const [helpful, setHelpful] = useState(null);
  const [role, setRole] = useState("");
  const [frontend, setFrontend] = useState(false);
  const [backend, setBackend] = useState(false);

  useEffect(() => {
    const saveHistory = async () => {
      if (finalAnswer && helpful) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic,experience }),
          });
          const data = await res.json();
          setHistory(data);
        } catch (error) {
          console.error("Error saving history:", error);
        }
      }
    };
    saveHistory();
  }, [helpful]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnswer("Loading...");
    setHelpful(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ask-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, question, experience }),
      });

      const data = await res.json();
      const ans = data.answer || "No answer received.";
      setAnswer(ans);
      setFinalAnswer(ans);
    } catch (err) {
      setAnswer("Error fetching answer. Please try again.");
    }
  };

  const handlingRole = (e) => {
    const selectedRole = e.target.value;
    setFrontend(selectedRole === "Frontend");
    setBackend(selectedRole === "Backend");
    setRole(selectedRole);
    setTopic(""); // Reset topic on role change
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ fontSize: "2.2rem", fontWeight: "600", marginBottom: "20px", color: "#1f2937" }}>
        🎯 Practice Interview Questions
      </h2>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "12px", marginBottom: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", color: "#374151" }}>Experience Level</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            style={{ padding: "12px", width: "100%", marginTop: "6px", borderRadius: "8px", border: "1px solid #d1d5db" }}
          >
            <option value="">-- Select Experience --</option>
            <option>0-1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5+</option>
            <option>8+</option>
            <option>10+</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", color: "#374151" }}>Role</label>
          <select
            value={role}
            onChange={handlingRole}
            required
            style={{ padding: "12px", width: "100%", marginTop: "6px", borderRadius: "8px", border: "1px solid #d1d5db" }}
          >
            <option value="">-- Select Role --</option>
            <option>Frontend</option>
            <option>Backend</option>
          </select>
        </div>

        {(frontend || backend) && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", color: "#374151" }}>Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              style={{ padding: "12px", width: "100%", marginTop: "6px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            >
              <option value="">-- Select Topic --</option>
              {frontend && <>
                <option>Angular</option>
                <option>React</option>
                <option>Vue.js</option>
              </>}
              {backend && <>
                <option>Nodejs</option>
                <option>Expressjs</option>
                <option>Java</option>
              </>}
            </select>
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", color: "#374151" }}>Custom Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What is useEffect?"
            style={{ padding: "12px", width: "100%", marginTop: "6px", borderRadius: "8px", border: "1px solid #d1d5db" }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🚀 Start Practice
        </button>
      </form>

      {answer && (
        <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "10px", marginBottom: "30px", borderLeft: "4px solid #2563eb" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "10px", color: "#111827" }}>💡 Answer</h3>
          <p style={{ whiteSpace: "pre-wrap", color: "#374151" }}>{answer}</p>

          {!helpful && (
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() => setHelpful("Helpful")}
                style={{
                  marginRight: "10px",
                  padding: "10px 14px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                ✅ Helpful
              </button>
              <button
                onClick={() => setHelpful("Not Helpful")}
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                ❌ Not Helpful
              </button>
            </div>
          )}
          {helpful && (
            <p style={{ marginTop: "15px", color: "#16a34a" }}>
              👍 Thanks for your feedback: <strong>{helpful}</strong>
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ fontWeight: "600", marginBottom: "15px", color: "#1f2937" }}>📚 Previous Attempts</h3>
          {history.map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                padding: "16px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <p><strong>{item.topic}</strong> — {item.question}</p>
              <p style={{ marginTop: "8px", color: "#4b5563" }}>{item.answer}</p>
              <p style={{ marginTop: "8px", fontSize: "0.9rem", fontStyle: "italic", color: "#6b7280" }}>
                Feedback: {item.helpful}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
