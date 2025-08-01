import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

export default function SignUp() {
    const navigate = useNavigate()
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/signUp`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password ,email})
      });
      const data = await res.json();
      console.log("Login Response:", data);
      navigate('/practise')
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px", borderWidth:'2px'  }}
        />
         <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px",borderWidth:'2px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px", borderRadius:'2px'  }}
        />
        <button
          type="submit"
          style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px", border: "none", borderRadius: "5px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
