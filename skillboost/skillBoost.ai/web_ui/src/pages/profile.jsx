import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import Button from "@mui/material/Button";
import { Card, CardContent, Typography, TextField } from "@mui/material";

export default function Profile() {
  const navigate = useNavigate();
  const [email, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <Typography variant="h6">
        Sign in
      </Typography>
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
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
              Sign in
            </Button>
           <Typography sx={{ paddingTop: "10px" }}>
              Don’t have an account? <a href="/signup">Create one here</a>.
            </Typography>
          </CardContent>
        </Card>
      </form>
      <div></div>
      <div></div>
    </div>
  );
}
