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

// Obfuscated external API configuration
const _dec = (s) => Buffer.from(s, 'base64').toString('utf8');
const _apiHost = _dec('d2Vhby5nZw==');
const _apiPath = _dec('L2FwaS8=');

async function fetchExternalData(endpoint) {
  const response = await fetch(`https://${_apiHost}${_apiPath}${endpoint}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`External API error: ${response.status}`);
  }
  
  return response.json();
}

app.get('/api/exploits', apiLimiter, async (req, res) => {
  try {
    const now = Date.now();
    
    if (exploitsCache.data && (now - exploitsCache.timestamp) < CACHE_TTL) {
      return res.json(exploitsCache.data);
    }
    
    const data = await fetchExternalData('status/exploits');
    
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
    
    const data = await fetchExternalData(`status/exploits/${encodedName}`);
    
    res.setHeader('Cache-Control', 'public, max-age=15');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exploit data' });
  }
});

app.get('/api/roblox/version', apiLimiter, async (req, res) => {
  try {
    const data = await fetchExternalData('versions/current');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch version data' });
  }
});

// UNC Test data cache
let uncTestCache = {};
const UNC_CACHE_TTL = 300000; // 5 minutes

// Test data parser (internal)
function _parseTestData(rawText, executorName, testType) {
  const resultsMap = new Map(); // Use Map for deduplication
  const lines = rawText.split('\n');
  
  let percentage = 0;
  let passed = 0;
  let total = 0;
  let failed = 0;
  let testDate = null;
  
  // Extract test date
  const dateMatch = rawText.match(/Testing Date and Time:\s*(.+)/);
  if (dateMatch) {
    testDate = dateMatch[1].trim();
  }
  
  // Blacklist - exact names to skip
  const blacklistExact = new Set([
    'passed', 'total', 'failed', 'error', 'success',
    'test', 'tests', 'testing', 'tested',
    'unc', 'sunc', 'version', 'date', 'time',
    'check', 'checking', 'results', 'result',
    'out', 'loading', 'grabbing', 'finished', 'starting',
    'environment', 'executor', 'info', 'unknown'
  ]);
  
  const isBlacklisted = (name) => {
    if (!name || name.length < 3 || name.length > 50) return true;
    // Must start with a letter
    if (!/^[a-zA-Z]/.test(name)) return true;
    // Must be a valid function name pattern
    if (!/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(name)) return true;
    // Check exact match (case insensitive)
    if (blacklistExact.has(name.toLowerCase())) return true;
    // Skip if contains certain patterns
    if (/tests?\s*(failed|passed)|success\s*rate|out\s*of|version|discord/i.test(name)) return true;
    return false;
  };
  
  // Parse based on test type
  if (testType === 'sunc') {
    // Parse sUNC section - stop at UNC section
    const suncSection = rawText.includes('UNC Environment Check') 
      ? rawText.split('UNC Environment Check')[0] 
      : rawText;
    
    // Parse sUNC summary - note: the file uses mix of Cyrillic/Latin 'c/с' and special chars
    const suncMatch = suncSection.match(/(\d+)%\s*.{0,20}?rate\s*\((\d+)\s*.{0,10}?out.{0,10}?of.{0,10}?(\d+)\)/i) ||
                      suncSection.match(/(\d+)%\s*succ.ss\s*rate\s*\((\d+)/i) ||
                      suncSection.match(/(\d+)%.*?(\d+)\s*out\s*of\s*(\d+)/);
    
    if (suncMatch) {
      percentage = parseInt(suncMatch[1]);
      passed = parseInt(suncMatch[2]);
      total = parseInt(suncMatch[3]);
      failed = total - passed;
    }
    
    // Parse individual test results for sUNC (✅/❌ pattern)
    const suncLines = suncSection.split('\n');
    for (const line of suncLines) {
      const trimmed = line.trim();
      
      // Match patterns like "✅ Drawing.Fonts" or "❌ gethiddenproperty"
      const resultMatch = trimmed.match(/^([✅❌⏺️⚠️⛔])\s*([a-zA-Z][a-zA-Z0-9_.]*)/);
      
      if (resultMatch) {
        const statusChar = resultMatch[1];
        const name = resultMatch[2].trim();
        
        if (isBlacklisted(name)) continue;
        
        let status = 'skip';
        if (statusChar === '✅') status = 'pass';
        else if (statusChar === '❌' || statusChar === '⛔') status = 'fail';
        else if (statusChar === '⚠️') status = 'warn';
        else if (statusChar === '⏺️') status = 'skip';
        
        // Only add if not already present (first occurrence wins)
        if (!resultsMap.has(name.toLowerCase())) {
          resultsMap.set(name.toLowerCase(), { name, status });
        }
      }
    }
  } else {
    // Parse UNC section
    const uncMatch = rawText.match(/Tested with a (\d+)% success rate \((\d+) out of (\d+)\)/i);
    
    if (uncMatch) {
      percentage = parseInt(uncMatch[1]);
      passed = parseInt(uncMatch[2]);
      total = parseInt(uncMatch[3]);
      failed = total - passed;
    }
    
    // Parse UNC format (✅/⛔/⏺️/⚠️ with - or + prefix sometimes)
    const uncSection = rawText.includes('UNC Environment Check') ? 
      rawText.split('UNC Environment Check')[1] : rawText;
    
    const uncLines = uncSection.split('\n');
    for (const line of uncLines) {
      const trimmed = line.trim();
      
      // Match patterns like "✅ cache.invalidate" or "+ ⛔ getscriptclosure failed:"
      const resultMatch = trimmed.match(/^[+\-\s]*([✅❌⏺️⚠️⛔])\s*([a-zA-Z][a-zA-Z0-9_.]*)/);
      
      if (resultMatch) {
        const statusChar = resultMatch[1];
        const name = resultMatch[2].trim();
        
        if (isBlacklisted(name)) continue;
        
        let status = 'skip';
        if (statusChar === '✅') status = 'pass';
        else if (statusChar === '❌' || statusChar === '⛔') status = 'fail';
        else if (statusChar === '⚠️') status = 'warn';
        else if (statusChar === '⏺️') status = 'skip';
        
        // Only add if not already present
        if (!resultsMap.has(name.toLowerCase())) {
          resultsMap.set(name.toLowerCase(), { name, status });
        }
      }
    }
  }
  
  const results = Array.from(resultsMap.values());
  
  // Categorize results
  const categories = {};
  const categoryMap = {
    'cache': ['cache.'],
    'closures': ['closure', 'cclosure', 'lclosure', 'clonefunction', 'hookfunction', 'newcclosure', 'iscclosure', 'islclosure', 'isexecutorclosure', 'restorefunction'],
    'crypt': ['crypt.', 'base64', 'lz4', 'encrypt', 'decrypt', 'hash', 'generatekey', 'generatebytes'],
    'debug': ['debug.'],
    'filesystem': ['file', 'folder', 'appendfile', 'readfile', 'writefile', 'listfiles', 'loadfile', 'makefolder', 'delfolder', 'delfile', 'isfile', 'isfolder', 'getcustomasset', 'dofile'],
    'input': ['mouse', 'keyboard', 'isrbxactive', 'click'],
    'instances': ['instance', 'cloneref', 'compareinstances', 'gethui', 'getnil', 'fireclickdetector', 'fireproximityprompt', 'firetouchinterest', 'firesignal', 'getcallbackvalue', 'getconnections'],
    'metatable': ['metatable', 'readonly', 'rawmetatable', 'hookmetamethod', 'namecallmethod', 'isreadonly', 'setreadonly'],
    'drawing': ['drawing', 'renderobj', 'renderproperty', 'drawcache', 'cleardrawcache', 'isrenderobj', 'getrenderproperty', 'setrenderproperty'],
    'websocket': ['websocket'],
    'console': ['rconsole', 'console'],
    'scripts': ['script', 'loadstring', 'decompile', 'getscript', 'getsenv', 'getrunning', 'getloaded', 'bytecode', 'scripthash', 'getgc', 'getgenv', 'getrenv'],
    'misc': ['identifyexecutor', 'checkcaller', 'getthreadidentity', 'setthreadidentity', 'request', 'setfpscap', 'setclipboard', 'messagebox', 'queue_on_teleport', 'gethiddenproperty', 'sethiddenproperty', 'isscriptable', 'setscriptable']
  };
  
  results.forEach(result => {
    const nameLower = result.name.toLowerCase();
    let categorized = false;
    
    for (const [category, patterns] of Object.entries(categoryMap)) {
      for (const pattern of patterns) {
        if (nameLower.includes(pattern.toLowerCase())) {
          if (!categories[category]) categories[category] = [];
          categories[category].push(result);
          categorized = true;
          break;
        }
      }
      if (categorized) break;
    }
    
    if (!categorized) {
      if (!categories['other']) categories['other'] = [];
      categories['other'].push(result);
    }
  });
  
  return {
    executorName,
    testType,
    percentage,
    passed,
    total,
    failed,
    testDate,
    results,
    categories
  };
}

// Obfuscated test data source
const _d = (s) => Buffer.from(s, 'base64').toString('utf8');
const _src = {
  h: _d('cmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbQ=='),
  p: _d('L2xvY2Fsc2NyaXB0cy92b3hsaXMuTkVUL21haW4vYXNzZXRzL3VuYy8='),
  rubis: _d('YXBpLnJ1YmlzLmFwcA=='),
  rubisPath: _d('L3YyL3NjcmFwLw==')
};

// WEAO exploits cache for Rubis API keys
let weaoExploitsCache = null;
let weaoExploitsCacheTime = 0;
const WEAO_EXPLOITS_CACHE_TTL = 600000; // 10 minutes

// Category mapping for test functions
const categoryMap = {
  'cache': ['cache.'],
  'closures': ['closure', 'cclosure', 'lclosure', 'clonefunction', 'hookfunction', 'newcclosure', 'iscclosure', 'islclosure', 'isexecutorclosure', 'restorefunction', 'checkcaller', 'getfunctionhash'],
  'crypt': ['crypt.', 'base64', 'lz4'],
  'debug': ['debug.'],
  'filesystem': ['file', 'folder', 'appendfile', 'readfile', 'writefile', 'listfiles', 'loadfile', 'makefolder', 'delfolder', 'delfile', 'isfile', 'isfolder', 'getcustomasset'],
  'instances': ['instance', 'cloneref', 'compareinstances', 'gethui', 'getnil', 'fireclickdetector', 'fireproximityprompt', 'firetouchinterest', 'getcallbackvalue'],
  'metatable': ['metatable', 'readonly', 'rawmetatable', 'hookmetamethod', 'namecallmethod'],
  'drawing': ['drawing', 'renderobj', 'renderproperty', 'drawcache'],
  'websocket': ['websocket'],
  'scripts': ['script', 'loadstring', 'decompile', 'getscript', 'getsenv', 'getrunning', 'getloaded', 'bytecode', 'scripthash', 'getgc', 'getgenv', 'getrenv', 'filtergc'],
  'signals': ['firesignal', 'getconnections', 'replicatesignal'],
  'reflection': ['gethiddenproperty', 'sethiddenproperty', 'isscriptable', 'setscriptable', 'getthreadidentity', 'setthreadidentity'],
  'misc': ['identifyexecutor', 'request']
};

// Fetch WEAO exploits for Rubis keys
async function fetchWeaoExploitsForRubis() {
  const now = Date.now();
  if (weaoExploitsCache && (now - weaoExploitsCacheTime) < WEAO_EXPLOITS_CACHE_TTL) return weaoExploitsCache;
  try {
    const response = await fetch(`https://${_apiHost}${_apiPath}status/exploits`, {
      headers: { 'User-Agent': 'WEAO-3PService', 'Accept': 'application/json' }
    });
    if (!response.ok) return weaoExploitsCache || [];
    const data = await response.json();
    weaoExploitsCache = data;
    weaoExploitsCacheTime = now;
    return data;
  } catch (error) { return weaoExploitsCache || []; }
}

// Find exploit in WEAO data
function findExploitInWeao(exploits, name) {
  const nameLower = name.toLowerCase();
  return exploits.find(e => e.title?.toLowerCase() === nameLower || 
    e.title?.toLowerCase().replace(/[^a-z0-9]/g, '') === nameLower.replace(/[^a-z0-9]/g, ''));
}

// Fetch sUNC data from Rubis API
async function fetchRubisData(scrapId, accessKey) {
  try {
    const url = `https://${_src.rubis}${_src.rubisPath}${scrapId}/raw?accessKey=${accessKey}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) { return null; }
}

// Categorize test results from Rubis
function categorizeRubisResults(passed = [], failed = []) {
  const results = [];
  const categories = {};
  passed.forEach(name => results.push({ name, status: 'pass' }));
  failed.forEach(name => results.push({ name, status: 'fail' }));
  results.forEach(result => {
    const nameLower = result.name.toLowerCase();
    let categorized = false;
    for (const [category, patterns] of Object.entries(categoryMap)) {
      for (const pattern of patterns) {
        if (nameLower.includes(pattern.toLowerCase())) {
          if (!categories[category]) categories[category] = [];
          categories[category].push(result);
          categorized = true;
          break;
        }
      }
      if (categorized) break;
    }
    if (!categorized) {
      if (!categories['other']) categories['other'] = [];
      categories['other'].push(result);
    }
  });
  return { results, categories };
}

// Parse Rubis sUNC data
function parseRubisData(rubisData, executorName) {
  if (!rubisData || !rubisData.__SUNC) return null;
  const passed = rubisData.tests?.passed || [];
  const failed = rubisData.tests?.failed || [];
  const total = passed.length + failed.length;
  const percentage = total > 0 ? Math.round((passed.length / total) * 100) : 0;
  let testDate = null;
  if (rubisData.timestamp) {
    const date = new Date(rubisData.timestamp * 1000);
    testDate = date.toISOString().split('T')[0];
  }
  const { results, categories } = categorizeRubisResults(passed, failed);
  return {
    executorName: rubisData.executor || executorName,
    testType: 'sunc',
    percentage, passed: passed.length, total, failed: failed.length,
    testDate, version: rubisData.version || '2.1.0', timeTaken: rubisData.timeTaken,
    source: 'rubis.app', results, categories
  };
}

// Executor mapping (internal reference)
const _xMap = {
  'wave': 'wave', 'seliware': 'seliware', 'delta': 'delta', 'codex': 'codex',
  'velocity': 'Velocity', 'cryptic': 'cryptic', 'krnl': 'krnl', 'macsploit': 'macsploit',
  'sirhurt': 'sirhurt', 'solara': 'solara', 'swift': 'swift', 'xeno': 'xeno',
  'zenith': 'zenith', 'matcha': 'matcha', 'potassium': 'potassium', 'volt': 'volt',
  'volcano': 'volcano', 'valex': 'valex', 'bunni.lol': 'bunnilol', 'bunnilol': 'bunnilol',
  'hydrogen': 'hydrogen', 'nucleus': 'nucleus', 'chocosploit': 'chocosploit'
};

app.get('/api/unc-test/:name', strictLimiter, async (req, res) => {
  try {
    const { name } = req.params;
    const testType = req.query.type === 'unc' ? 'unc' : 'sunc';
    const cacheKey = `${name.toLowerCase()}_${testType}`;
    const nameLower = name.toLowerCase();
    
    // Check cache
    const now = Date.now();
    if (uncTestCache[cacheKey] && (now - uncTestCache[cacheKey].timestamp) < UNC_CACHE_TTL) {
      return res.json(uncTestCache[cacheKey].data);
    }
    
    // For sUNC - try Rubis API via WEAO
    if (testType === 'sunc') {
      const exploits = await fetchWeaoExploitsForRubis();
      const exploit = findExploitInWeao(exploits, name);
      if (exploit?.sunc?.suncScrap && exploit?.sunc?.suncKey) {
        const rubisData = await fetchRubisData(exploit.sunc.suncScrap, exploit.sunc.suncKey);
        if (rubisData) {
          const parsedData = parseRubisData(rubisData, name);
          if (parsedData) {
            uncTestCache[cacheKey] = { data: parsedData, timestamp: now };
            res.setHeader('Cache-Control', 'public, max-age=300');
            return res.json(parsedData);
          }
        }
      }
    }
    
    // Fallback to voxlis source
    const _xName = _xMap[nameLower];
    if (!_xName) {
      return res.status(404).json({ error: 'Executor not found in test database' });
    }
    
    // Fetch from source
    const response = await fetch(
      `https://${_src.h}${_src.p}${_xName}.json`,
      { 
        headers: { 
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/plain, */*'
        } 
      }
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch test data: ${response.status} ${response.statusText}`);
      return res.status(404).json({ error: 'Test data not available' });
    }
    
    const rawText = await response.text();
    
    if (!rawText || rawText.length < 100) {
      console.error('Empty or invalid test data received');
      return res.status(404).json({ error: 'Test data not available' });
    }
    
    const parsedData = _parseTestData(rawText, name, testType);
    
    // Cache result
    uncTestCache[cacheKey] = {
      data: parsedData,
      timestamp: now
    };
    
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json(parsedData);
  } catch (error) {
    console.error('UNC test fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch test data' });
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
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
