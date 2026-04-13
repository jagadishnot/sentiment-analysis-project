const express = require('express');
const axios = require('axios');
const router = express.Router();

const YT_API_KEY = process.env.YOUTUBE_API_KEY;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Extract video ID from any YouTube URL format
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch video metadata (title, duration, description, stats)
async function fetchVideoMeta(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos`;
  const res = await axios.get(url, {
    params: {
      key: YT_API_KEY,
      id: videoId,
      part: 'snippet,contentDetails,statistics',
    },
  });

  const item = res.data.items?.[0];
  if (!item) throw new Error('Video not found');

  // Parse ISO 8601 duration (PT1H2M3S)
  const dur = item.contentDetails.duration;
  const hours = (dur.match(/(\d+)H/) || [])[1] || 0;
  const mins = (dur.match(/(\d+)M/) || [])[1] || 0;
  const secs = (dur.match(/(\d+)S/) || [])[1] || 0;
  const durationLabel =
    hours > 0
      ? `${hours}h ${mins}m ${secs}s`
      : `${mins}m ${secs}s`;

  // Heuristic: description mentions "ad", "sponsor", "paid partnership"
  const desc = item.snippet.description.toLowerCase();
  const adKeywords = ['sponsor', 'paid partnership', '#ad', 'this video is sponsored', 'affiliate'];
  const hasAds = adKeywords.some((kw) => desc.includes(kw));

  return {
    videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description.slice(0, 400),
    thumbnailUrl: item.snippet.thumbnails?.high?.url,
    duration: durationLabel,
    durationSeconds: parseInt(hours) * 3600 + parseInt(mins) * 60 + parseInt(secs),
    viewCount: parseInt(item.statistics.viewCount || 0),
    likeCount: parseInt(item.statistics.likeCount || 0),
    commentCount: parseInt(item.statistics.commentCount || 0),
    hasAds,
  };
}

// Fetch top comments (up to maxResults, paginated)
async function fetchComments(videoId, maxResults = 100) {
  const comments = [];
  let pageToken = undefined;

  while (comments.length < maxResults) {
    const res = await axios.get(
      'https://www.googleapis.com/youtube/v3/commentThreads',
      {
        params: {
          key: YT_API_KEY,
          videoId,
          part: 'snippet',
          maxResults: Math.min(100, maxResults - comments.length),
          order: 'relevance',
          pageToken,
        },
      }
    );

    for (const item of res.data.items) {
      const top = item.snippet.topLevelComment.snippet;
      comments.push({
        text: top.textDisplay,
        likeCount: top.likeCount,
        publishedAt: top.publishedAt,
      });
    }

    pageToken = res.data.nextPageToken;
    if (!pageToken) break;
  }

  return comments;
}

// Send comments to Python ML service for sentiment analysis
async function analyzeSentiment(comments) {
  const texts = comments.map((c) => c.text);
  const res = await axios.post(`${ML_SERVICE_URL}/analyze`, { texts });
  return res.data; // { results: [{label, score}], summary: {positive, negative, neutral, avgScore, overallFeedback} }
}

// POST /api/analyze
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });

    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    // Fetch video metadata and comments in parallel
    const [videoMeta, comments] = await Promise.all([
      fetchVideoMeta(videoId),
      fetchComments(videoId, 100),
    ]);

    if (comments.length === 0) {
      return res.json({
        videoMeta,
        comments: [],
        sentimentSummary: null,
        message: 'No comments found or comments are disabled.',
      });
    }

    // Analyze sentiment
    const { results, summary } = await analyzeSentiment(comments);

    // Merge sentiment back into each comment
    const enrichedComments = comments.map((c, i) => ({
      ...c,
      sentiment: results[i]?.label || 'neutral',
      score: results[i]?.score || 0.5,
    }));

    res.json({
      videoMeta,
      comments: enrichedComments,
      sentimentSummary: summary,
    });
  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

module.exports = router;
