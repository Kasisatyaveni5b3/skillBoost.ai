const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { fetch } = require("undici");

const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Mongoose model
const loginSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false }
});
const Login = mongoose.model('Login', loginSchema);

// ---------------- AI Question ----------------
app.post("/api/ask-question", async (req, res) => {
  const { topic, experience } = req.body;
  const prompt = `You are an expert technical interviewer. Ask one concise interview question at a time for a ${experience} ${topic} developer. Mix normal and scenario-based questions. Do not add explanations or formatting. Only return the question text.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const result = await response.json();
    const aiQuestion = result.choices?.[0]?.message?.content || "No question generated.";
    res.json({ question: aiQuestion });

  } catch (err) {
    console.error("AI Question Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- AI Answer Evaluation ----------------
app.post("/api/answer", async (req, res) => {
  const { answer } = req.body;
  const sanitizedAnswer = answer.trim().replace(/"/g, '\\"');
  const prompt = `
You are an expert Angular technical interviewer.

Evaluate the candidate's answer to the interview question provided.

Your response must include:
1. A corrected answer (if needed) or say "Answer is not salvageable." if too vague.
2. One concise paragraph of feedback evaluating correctness, completeness, and clarity — only based on how well the answer addresses the question.
3. A score out of 10 (integer only).

Format your output exactly like this:
Corrected Answer:
<your corrected answer or 'Answer is not salvageable.'>

Feedback:
<your review>

Score: <number>/10

Candidate's Answer:
"""${sanitizedAnswer}"""
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const result = await response.json();
    const aiAnswer = result.choices?.[0]?.message?.content || "No evaluation generated.";
    res.json({ answer: aiAnswer });

  } catch (err) {
    console.error("Answer Evaluation Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- QA History (in-memory) ----------------
let history = [];
app.post("/api/history", async (req, res) => {
  const { topic, question, answer } = req.body;
  try {
    const newTopic = { topic, question, answer };
    history.push(newTopic);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Sign Up ----------------
app.post('/api/signUp', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Login.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Login.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const link = `http://localhost:5000/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<h3>Hello ${name}</h3><p>Click to verify:</p><a href="${link}">Verify Email</a>`,
    });

    res.status(200).json({ message: 'Verification email sent' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Email Verification ----------------
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Login.findById(decoded.id);
    if (!user) return res.redirect('http://localhost:3000/verify-email?status=error');

    user.isVerified = true;
    await user.save();

    return res.redirect('http://localhost:3000/verify-email?status=success');
  } catch (err) {
    return res.redirect('http://localhost:3000/verify-email?status=error');
  }
});

// ---------------- Login ----------------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Login.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });

    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false, // set to true if using HTTPS in production
  });
  res.status(200).json({ message: 'Logged out successfully' });
});



// ---------------- Auth Middleware ----------------
function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ---------------- Get Current User ----------------
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await Login.findById(req.user.id).select("name email");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Connect MongoDB & Start ----------------
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillboost', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(5000, () => {
    console.log("🚀 Server running at http://localhost:5000");
  });
});
