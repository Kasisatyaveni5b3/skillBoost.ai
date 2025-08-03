// src/pages/SignUp.jsx
import { useState } from "react";
import { BACKEND_URL } from "../config";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";





export default function SignUp() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
const navigate = useNavigate();

 async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        debugger;
        if (data.message === "User already exists") {
          toast.info("User already exists. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000); // ✅ navigation
        } else {
          toast.error(data.error || "Signup failed.");
        }
        return;
      }

      toast.success(`📧 Verification email sent to ${email}.`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  }


  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <Typography variant="h6">Register</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {!success && (
        <form onSubmit={handleSubmit}>
          <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Register
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
