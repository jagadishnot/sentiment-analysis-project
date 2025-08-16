import { useState } from "react";
import axios from "axios";
import SentimentChart from "./components/SentimentChart";

function App() {
  const [comment, setComment] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
     const res = await axios.post("https://sentiment-analysis-project-afkl.onrender.com/api/comment", { text: comment });

      console.log("Response:", res.data); // ✅ Debugging
      setResults([...results, res.data]);
      setComment("");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to analyze comment");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>🎬 Movie Trailer + Feedback Sentiment Analyzer</h2>

      {/* 🎥 Embedded YouTube Trailer */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <iframe
          width="100%"
          height="400"
          src="https://youtu.be/HYVxnPmb15E?si=oJmO-Hqe4-vBwa_L" // Example: Inception Trailer
          title="YouTube movie trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <h3>📝 Leave Your Feedback</h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="4"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        placeholder="Type your feedback here..."
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 15px",
          backgroundColor: "#1976D2",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit
      </button>

      <h3 style={{ marginTop: "20px" }}>📊 Sentiment Chart</h3>
      <SentimentChart data={results} />

      <h3 style={{ marginTop: "20px" }}>📋 Submitted Feedback</h3>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <strong>{r.text}</strong> → Score: {r.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
