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
  useEffect(() => {
    const saveHistory = async () => {
      if (finalAnswer && helpful) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic,
              question,
              answer: finalAnswer,
              helpful,
            }),
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
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          question: question || "What is useState?",
          experience,
        }),
      });

      const data = await res.json();
      const ans = data.answer || "No answer received.";
      setAnswer(ans);
      setFinalAnswer(ans);
    } catch (err) {
      setAnswer("Error fetching answer. Please try again.");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Practice Interview Questions</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Select Experience Level</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            style={{ padding: "10px", width: "100%", marginTop: "8px" }}
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

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Choose Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            style={{ padding: "10px", width: "100%", marginTop: "8px" }}
          >
            <option value="">-- Select Topic --</option>
            <option>React</option>
            <option>JavaScript</option>
            <option>Angular</option>
            <option>Node.js</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Enter Custom Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What is useEffect?"
            style={{ padding: "10px", width: "100%", marginTop: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Start Practice
        </button>
      </form>

      {answer && (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Answer</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>

          {!helpful && (
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() => setHelpful("Helpful")}
                style={{ marginRight: "10px", padding: "8px 12px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px" }}
              >
                Helpful
              </button>
              <button
                onClick={() => setHelpful("Not Helpful")}
                style={{ padding: "8px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px" }}
              >
                Not Helpful
              </button>
            </div>
          )}
          {helpful && (
            <p style={{ marginTop: "15px", color: "#22c55e" }}>
              ✅ Thanks for your feedback: <strong>{helpful}</strong>
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "10px" }}>Previous Attempts</h3>
          {history.map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#f9fafb",
                padding: "15px",
                marginBottom: "15px",
                borderLeft: "4px solid #3b82f6",
              }}
            >
              <strong>{item.topic}</strong> — {item.question}
              <p style={{ marginTop: "5px" }}>{item.answer}</p>
              <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#6b7280" }}>Feedback: {item.helpful}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
