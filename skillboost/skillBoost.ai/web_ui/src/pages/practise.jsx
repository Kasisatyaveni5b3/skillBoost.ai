import { useState } from "react";

export default function Practise() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();
  setHistory((prev) => [...prev,question,answer])
  setAnswer("Loading...");
  try {
    const res = await fetch("http://localhost:5000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        question: question || "What is useState?",
      }),
    });
    const data = await res.json();
    setAnswer(data.answer || "No answer received.");
  } catch (err) {
    setAnswer("Error fetching answer. Please try again.");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Practice Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Choose Topic: </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          >
            <option value="">-- Select Topic --</option>
            <option>React</option>
            <option>JavaScript</option>
            <option>HTML</option>
            <option>Node.js</option>
          </select>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Enter Custom Question: </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What is useEffect?"
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Start Practice
        </button>
      </form>

      {answer && history && (
        <div
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            backgroundColor: "#f0f0f0",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          {[answer ,history]}
        </div>
      )}
    </div>
  );
}
