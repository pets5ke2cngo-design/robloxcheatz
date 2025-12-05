const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: 'Too many requests',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Rate limit exceeded',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { etag: false, maxAge: 0 }));
app.use('/src', express.static(path.join(__dirname, 'src'), { etag: false, maxAge: 0 }));
app.use('/data', express.static(path.join(__dirname, 'data'), { etag: false, maxAge: 0 }));

let exploitsCache = {
  data: null,
  timestamp: 0
};

const CACHE_TTL = 15000;

async function fetchFromWEAO(endpoint) {
  const response = await fetch(`https://weao.xyz/api/${endpoint}`, {
    headers: {
      'User-Agent': 'WEAO-3PService'
    }
  });
  
  if (!response.ok) {
    throw new Error(`WEAO API error: ${response.status}`);
  }
  
  return response.json();
}

app.get('/api/exploits', apiLimiter, async (req, res) => {
  try {
    const now = Date.now();
    
    if (exploitsCache.data && (now - exploitsCache.timestamp) < CACHE_TTL) {
      return res.json(exploitsCache.data);
    }
    
    const data = await fetchFromWEAO('status/exploits');
    
    exploitsCache = {
      data: data,
      timestamp: now
    };
    
    res.setHeader('Cache-Control', 'public, max-age=15');
    res.json(data);
  } catch (error) {
    if (exploitsCache.data) {
      return res.json(exploitsCache.data);
    }
    
    res.status(500).json({ error: 'Failed to fetch exploit data' });
  }
});

app.get('/api/exploit/:name', strictLimiter, async (req, res) => {
  try {
    const { name } = req.params;
    const encodedName = encodeURIComponent(name.toLowerCase());
    
    const data = await fetchFromWEAO(`status/exploits/${encodedName}`);
    
    res.setHeader('Cache-Control', 'public, max-age=15');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exploit data' });
  }
});

app.get('/api/roblox/version', apiLimiter, async (req, res) => {
  try {
    const data = await fetchFromWEAO('versions/current');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch version data' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'information.html'));
});

app.get('/downgrade', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'downgrade.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
});

module.exports = app;
