import { useState } from "react";
import axios from "axios";
import SentimentChart from "./components/SentimentChart";

function App() {
  const [comment, setComment] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/comment", { text: comment });
      console.log("Response:", res.data); // ✅ Debugging
      setResults([...results, res.data]);
      setComment("");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to analyze comment");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>📝 Feedback Sentiment Analyzer</h2>

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
