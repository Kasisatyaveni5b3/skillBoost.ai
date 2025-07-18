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

app.post("/api/ask-question", async (req, res) => {
    const { topic, experience } = req.body;
    const prompt = `You are an expert interviewer. Ask only one concise, interview question for a ${experience} ${topic} developer. Return only the question text — no scenario, no explanation, no formatting.`;
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
        console.log(prompt)
        const result = await response.json();
        const aiQuestion = result.choices?.[0]?.message?.content || "No question generated.";
        res.json({ question: aiQuestion });
    } catch (err) {
        console.error("Question Generation Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/answer", async (req, res) => {
    const { answer } = req.body;
  const sanitizedAnswer = answer.trim().replace(/"/g, '\\"');
const prompt = `
You are an expert Angular technical interviewer.

Evaluate the following answer to a scenario-based question.

Your output must include:
1. A corrected answer (if needed) or say "Answer is not salvageable." if too vague.
2. Clear, one-paragraph feedback on correctness, completeness, and clarity.
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
        })
        const result = await response.json();
        const aiQuestion = result.choices?.[0]?.message?.content || "No question generated.";
        res.json({ answer: aiQuestion });
    } catch (err) {
        console.error("Question Generation Error:", err.message);
        res.status(500).json({ error: err.message });
    }
})


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
        console.log(email, password)
        const findUser = await Login.findOne({ email });
        console.log(email, password)
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