import express from "express";
import cors from "cors";
import Sentiment from "sentiment";

const app = express();
app.use(cors()); // or use { origin: "YOUR_FRONTEND_URL" } in production
app.use(express.json());

const sentiment = new Sentiment();

app.post("/api/comment", (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const result = sentiment.analyze(text);

    res.json({
      text,
      score: result.score,
      comparative: result.comparative,
      tokens: result.tokens,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
