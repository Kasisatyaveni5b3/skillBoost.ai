import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import MicComponent from "./voice";

export default function Practise() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [experience, setExperience] = useState("");
  const [role, setRole] = useState("");
  const [frontend, setFrontend] = useState(false);
  const [backend, setBackend] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [helpful, setHelpful] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saveHistory = async () => {
      if (finalAnswer && helpful !== null) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, experience }),
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

  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim())
      return alert("Please write an answer before submitting.");
    try {
      setFinalAnswer("Evaluating your answer...");
      const res = await fetch(`${BACKEND_URL}/api/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: userAnswer }),
      });
      const data = await res.json();
      setFinalAnswer(data.answer || "No feedback received.");
    } catch (err) {
      setFinalAnswer("Error evaluating answer. Please try again.");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!experience || !role || !topic)
      return alert("Please select all fields before starting.");
    setQuestion("Loading question...");
    setHelpful(null);
    setFinalAnswer("");
    setUserAnswer("");
    try {
      debugger;
      const res = await fetch(`${BACKEND_URL}/api/ask-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, experience }),
      });
      const data = await res.json();
      setQuestion(data.question || "No question received.");
    } catch (err) {
      setQuestion("Error fetching question. Please try again.");
    }
  };

  const handleRoleChange = (e) => {
    const selected = e.target.value;
    setFrontend(selected === "Frontend");
    setBackend(selected === "Backend");
    setRole(selected);
    setTopic("");
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          marginBottom: "30px",
          color: "#1f2937",
          textAlign: "center",
        }}
      >
        Practice Your Interview Skills
      </h2>

      <form
        onSubmit={handleQuestionSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label style={{ fontWeight: "bold", color: "#374151" }}>
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              style={selectStyle}
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

          <div>
            <label style={{ fontWeight: "bold", color: "#374151" }}>Role</label>
            <select
              value={role}
              onChange={handleRoleChange}
              required
              style={selectStyle}
            >
              <option value="">-- Select Role --</option>
              <option>Frontend</option>
              <option>Backend</option>
            </select>
          </div>

          {(frontend || backend) && (
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontWeight: "bold", color: "#374151" }}>
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                style={selectStyle}
              >
                <option value="">-- Select Topic --</option>
                {frontend && (
                  <>
                    <option>Angular</option>
                    <option>React</option>
                    <option>Vue.js</option>
                  </>
                )}
                {backend && (
                  <>
                    <option>Nodejs</option>
                    <option>Expressjs</option>
                    <option>Java</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>

        <button type="submit" style={submitBtnStyle}>
          Generate Question
        </button>
      </form>

      {question && (
        <div className="mb-8">
          <p className="text-lg font-semibold text-gray-800 mb-4">{question}</p>

          <div className="relative">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full min-h-[120px] p-4 pr-12 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-gray-700"
            />

            <div className="absolute bottom-4 right-4 flex items-center space-x-3">
              <MicComponent className="text-blue-600 hover:text-blue-700 cursor-pointer" />

              <i
                className="fas fa-arrow-up text-blue-600 text-lg hover:text-blue-700 cursor-pointer"
                onClick={handleAnswerSubmit}
                title="Submit Answer"
              />
            </div>
          </div>
        </div>
      )}
      {finalAnswer && (
        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <strong style={{ color: "#1f2937" }}>Review:</strong>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              color: "#111827",
              marginTop: "10px",
            }}
          >
            {finalAnswer}
          </pre>
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  padding: "10px",
  width: "100%",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const submitBtnStyle = {
  marginTop: "24px",
  backgroundColor: "#2563eb",
  color: "white",
  padding: "12px 24px",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
};
