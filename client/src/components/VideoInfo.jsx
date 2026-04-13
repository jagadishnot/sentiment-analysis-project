import React from 'react';

export default function VideoInfo({ meta }) {
  if (!meta) return null;

  const formatNumber = (n) =>
    n >= 1_000_000
      ? (n / 1_000_000).toFixed(1) + 'M'
      : n >= 1_000
      ? (n / 1_000).toFixed(1) + 'K'
      : String(n);

  const published = new Date(meta.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1.25rem',
        flexWrap: 'wrap',
      }}
    >
      {meta.thumbnailUrl && (
        <img
          src={meta.thumbnailUrl}
          alt="thumbnail"
          style={{ width: '180px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: '200px' }}>
        <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem', fontWeight: 500 }}>
          {meta.title}
        </h3>
        <p style={{ margin: '0 0 0.75rem', color: '#888', fontSize: '0.88rem' }}>
          {meta.channelTitle} · {published}
        </p>

        {/* Stat chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
          {[
            { label: 'Duration', value: meta.duration },
            { label: 'Views', value: formatNumber(meta.viewCount) },
            { label: 'Likes', value: formatNumber(meta.likeCount) },
            { label: 'Comments', value: formatNumber(meta.commentCount) },
          ].map(({ label, value }) => (
            <span
              key={label}
              style={{
                background: '#f4f4f4',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.83rem',
                color: '#444',
              }}
            >
              <strong>{label}:</strong> {value}
            </span>
          ))}

          {meta.hasAds && (
            <span
              style={{
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '0.83rem',
                color: '#856404',
              }}
            >
              Contains sponsored content
            </span>
          )}
        </div>

        {meta.description && (
          <p
            style={{
              fontSize: '0.83rem',
              color: '#666',
              margin: 0,
              lineHeight: 1.55,
              maxHeight: '64px',
              overflow: 'hidden',
            }}
          >
            {meta.description}
          </p>
        )}
      </div>
    </div>
  );
}
