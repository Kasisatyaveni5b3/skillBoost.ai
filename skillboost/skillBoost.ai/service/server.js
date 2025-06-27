const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { fetch } = require("undici");
const Login = require('./userModel');
const { jwt } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); 

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

app.post("/api/ask", async (req, res) => {
    const { topic, question, experience } = req.body;
    const prompt = `Answer this ${topic} interview question clearly: ${question} with ${experience} level`;
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
            }),
        });
        const result = await response.json();
        const aiResponse = result.choices?.[0]?.message?.content || "No answer generated.";
        res.json({ answer: aiResponse });
    } catch (err) {
        console.error("AI Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

let history = []
app.post("/api/history", async (req, res) => {
    const { topic, question, answer } = req.body;
    try {

        const newTopic = { topic, question, answer };
        history.push(newTopic)
        res.json(history);
    } catch (err) {

    }
})

app.post('/api/signUp', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        console.log(Login);
        const findUser = await Login.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Login.create({ name, email, password: hashedPassword });

        res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email,password)
    const findUser = await Login.findOne({ email });
    console.log(email,password)
    if (!findUser) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: findUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillboost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
})