import React, { useState } from 'react';
import VideoInput from './components/VideoInput';
import VideoInfo from './components/VideoInfo';
import SentimentChart from './components/SentimentChart';
import CommentList from './components/CommentList';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <VideoInput onAnalyze={handleAnalyze} loading={loading} />

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          Fetching video data and analyzing comments...
        </div>
      )}

      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            color: '#dc2626',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <>
          <VideoInfo meta={result.videoMeta} />
          <div
            style={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <SentimentChart
              summary={result.sentimentSummary}
              comments={result.comments}
            />
            {result.message && (
              <p style={{ color: '#888', textAlign: 'center' }}>{result.message}</p>
            )}
          </div>

          {result.comments.length > 0 && (
            <div
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <h4 style={{ margin: '0 0 1rem', fontWeight: 500 }}>
                Comments ({result.comments.length})
              </h4>
              <CommentList comments={result.comments} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
