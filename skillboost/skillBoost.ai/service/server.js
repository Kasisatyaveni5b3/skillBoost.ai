const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { fetch } = require("undici");

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());

app.post("/api/ask", async (req, res) => {
    const { topic, question } = req.body;
    const prompt = `Answer this ${topic} interview question clearly: ${question}`;
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

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
})