// server/index.js
import express from "express";
import cors from "cors";
import Sentiment from "sentiment";

const app = express();
app.use(cors());
app.use(express.json());

const sentiment = new Sentiment();

// API route
app.post("/api/comment", (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const result = sentiment.analyze(text);

    res.json({
      text,
      score: result.score,         // sentiment score (-ve, +ve, 0)
      comparative: result.comparative,
      tokens: result.tokens,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
