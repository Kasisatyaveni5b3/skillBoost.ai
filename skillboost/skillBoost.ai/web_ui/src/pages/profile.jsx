import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import Button from "@mui/material/Button";
import { Card, CardContent, Typography, TextField } from "@mui/material";
import { toast } from "react-toastify"; // Optional: for showing toast notifications

export default function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Login successful!");
      navigate("/home"); // ✅ Redirect to home screen
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <Typography variant="h6">Sign in</Typography>
      <form onSubmit={handleSubmit}>
        <Card
          sx={{
            width: "500px",
            height: "400px",
            margin: "auto",
            marginTop: "10px",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Sign in
            </Button>
            <Typography sx={{ paddingTop: "10px" }}>
              Don’t have an account? <a href="/signup">Create one here</a>.
            </Typography>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
