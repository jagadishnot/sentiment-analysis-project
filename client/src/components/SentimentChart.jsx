import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const COLORS = { positive: '#22c55e', negative: '#ef4444', neutral: '#f59e0b' };

export default function SentimentChart({ summary, comments }) {
  if (!summary) return null;

  const pieData = [
    { name: 'Positive', value: summary.positive },
    { name: 'Negative', value: summary.negative },
    { name: 'Neutral', value: summary.neutral },
  ];

  // Build bar chart: sentiment over comment order (chunked into groups of 10)
  const chunkSize = 10;
  const barData = [];
  for (let i = 0; i < comments.length; i += chunkSize) {
    const chunk = comments.slice(i, i + chunkSize);
    const pos = chunk.filter((c) => c.sentiment === 'positive').length;
    const neg = chunk.filter((c) => c.sentiment === 'negative').length;
    const neu = chunk.filter((c) => c.sentiment === 'neutral').length;
    barData.push({
      group: `C${i + 1}-${Math.min(i + chunkSize, comments.length)}`,
      Positive: pos,
      Negative: neg,
      Neutral: neu,
    });
  }

  return (
    <div>
      {/* Overall feedback summary card */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <h4 style={{ margin: '0 0 0.5rem', fontWeight: 500, fontSize: '0.95rem', color: '#166534' }}>
          Overall Audience Feedback
        </h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803d', lineHeight: 1.6 }}>
          {summary.overallFeedback}
        </p>
      </div>

      {/* Stat summary row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '10px',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { label: 'Comments analyzed', value: summary.total, color: '#6366f1' },
          { label: 'Positive', value: `${summary.positivePct}%`, color: '#22c55e' },
          { label: 'Negative', value: `${summary.negativePct}%`, color: '#ef4444' },
          { label: 'Neutral', value: `${summary.neutralPct}%`, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: '#fafafa',
              borderRadius: '8px',
              padding: '0.75rem',
              textAlign: 'center',
              border: '1px solid #eee',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 500, color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Pie chart */}
        <div style={{ flex: '0 0 260px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>
            Sentiment Distribution
          </h4>
          <PieChart width={260} height={220}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [v, 'comments']} />
          </PieChart>
        </div>

        {/* Bar chart */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', color: '#444' }}>
            Sentiment Across Comments
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="group" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Positive" stackId="a" fill={COLORS.positive} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Neutral" stackId="a" fill={COLORS.neutral} />
              <Bar dataKey="Negative" stackId="a" fill={COLORS.negative} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Representative comments */}
      {(summary.topPositiveComment || summary.topNegativeComment) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '1.5rem',
          }}
        >
          {summary.topPositiveComment && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 500, marginBottom: '4px' }}>
                Top positive comment
              </div>
              <p style={{ fontSize: '0.83rem', color: '#166534', margin: 0, lineHeight: 1.5 }}>
                "{summary.topPositiveComment}"
              </p>
            </div>
          )}
          {summary.topNegativeComment && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 500, marginBottom: '4px' }}>
                Top critical comment
              </div>
              <p style={{ fontSize: '0.83rem', color: '#991b1b', margin: 0, lineHeight: 1.5 }}>
                "{summary.topNegativeComment}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
