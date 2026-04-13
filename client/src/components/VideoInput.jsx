import React, { useState } from 'react';

export default function VideoInput({ onAnalyze, loading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    const ytPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    if (!ytPattern.test(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    onAnalyze(url);
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '0.75rem' }}>
        YouTube Video Analyzer
      </h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>
        Paste a YouTube URL to analyze comments, sentiment, video length, and content summary.
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{
            flex: 1,
            minWidth: '260px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '0.95rem',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '10px 22px',
            borderRadius: '8px',
            background: loading ? '#aaa' : '#e52d27',
            color: '#fff',
            border: 'none',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && (
        <p style={{ color: '#e52d27', marginTop: '0.5rem', fontSize: '0.88rem' }}>{error}</p>
      )}
    </div>
  );
}
