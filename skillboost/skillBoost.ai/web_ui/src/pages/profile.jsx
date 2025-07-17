import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export default function Profile() {
  const navigate = useNavigate();
  const [email, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      localStorage.setItem("user",JSON.stringify(data.user))
      navigate("/home");
      console.log("Login Response:", data);
    } catch (err) {
      console.error("Login Error:", err);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Login
        </button>
      </form>
      <div>
        <p>
          Don’t have an account? <a href="/signup">Create one here</a>.
        </p>
      </div>
      <div>
      </div>
    </div>
  );
}

export function SiblingB({message}) {
  <input value={message}/>
}
