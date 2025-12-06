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
      'User-Agent': 'WEAO-3PService',
      'Accept': 'application/json'
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

// WEAO exploits cache for Rubis API keys
let weaoExploitsCache = null;
let weaoExploitsCacheTime = 0;
const WEAO_EXPLOITS_CACHE_TTL = 300000; // 5 minutes - более частое обновление для актуальных данных

// Obfuscated Rubis API config
const _d = (s) => Buffer.from(s, 'base64').toString('utf8');
const _rubis = {
  host: _d('YXBpLnJ1YmlzLmFwcA=='),
  path: _d('L3YyL3NjcmFwLw==')
};

// Category mapping for test functions (based on actual Rubis API function names)
const categoryMap = {
  'cache': ['cache.iscached', 'cache.invalidate', 'cache.replace'],
  'closures': ['clonefunction', 'hookfunction', 'newcclosure', 'iscclosure', 'islclosure', 'isexecutorclosure', 'restorefunction', 'checkcaller', 'getfunctionhash', 'getcallingscript'],
  'crypt': ['base64_encode', 'base64_decode', 'lz4compress', 'lz4decompress', 'crypt.'],
  'debug': ['debug.getinfo', 'debug.getupvalue', 'debug.getupvalues', 'debug.setupvalue', 'debug.getconstant', 'debug.getconstants', 'debug.setconstant', 'debug.getproto', 'debug.getprotos', 'debug.getstack', 'debug.setstack'],
  'filesystem': ['readfile', 'writefile', 'appendfile', 'loadfile', 'listfiles', 'isfile', 'isfolder', 'makefolder', 'delfolder', 'delfile', 'getcustomasset', 'dofile'],
  'input': ['mouse', 'keyboard', 'isrbxactive', 'click'],
  'instances': ['getinstances', 'getnilinstances', 'cloneref', 'compareinstances', 'gethui', 'fireclickdetector', 'fireproximityprompt', 'firetouchinterest', 'getcallbackvalue'],
  'metatable': ['getrawmetatable', 'setrawmetatable', 'hookmetamethod', 'getnamecallmethod', 'isreadonly', 'setreadonly'],
  'drawing': ['drawing.new', 'drawing.fonts', 'isrenderobj', 'getrenderproperty', 'setrenderproperty', 'cleardrawcache'],
  'websocket': ['websocket.connect'],
  'console': ['rconsole', 'console'],
  'scripts': ['loadstring', 'decompile', 'getscripts', 'getrunningscripts', 'getloadedmodules', 'getscriptbytecode', 'getscripthash', 'getscriptclosure', 'getsenv', 'getgc', 'filtergc', 'getgenv', 'getrenv'],
  'signals': ['firesignal', 'getconnections', 'replicatesignal'],
  'reflection': ['gethiddenproperty', 'sethiddenproperty', 'isscriptable', 'setscriptable', 'getthreadidentity', 'setthreadidentity'],
  'misc': ['identifyexecutor', 'request', 'setfpscap', 'setclipboard', 'messagebox']
};

// Fetch WEAO exploits for dynamic Rubis keys
async function fetchWeaoExploitsForRubis() {
  const now = Date.now();
  if (weaoExploitsCache && (now - weaoExploitsCacheTime) < WEAO_EXPLOITS_CACHE_TTL) {
    return weaoExploitsCache;
  }
  try {
    const response = await fetch(`https://${_apiHost}${_apiPath}status/exploits`, {
      headers: { 
        'User-Agent': 'WEAO-3PService', 
        'Accept': 'application/json' 
      }
    });
    if (!response.ok) {
      console.error(`WEAO API error: ${response.status}`);
      return weaoExploitsCache || [];
    }
    const data = await response.json();
    weaoExploitsCache = data;
    weaoExploitsCacheTime = now;
    console.log(`WEAO exploits cache updated: ${data.length || 0} exploits`);
    return data;
  } catch (error) { 
    console.error('WEAO fetch error:', error.message);
    return weaoExploitsCache || []; 
  }
}

// Find exploit in WEAO data with flexible matching
function findExploitInWeao(exploits, name) {
  if (!Array.isArray(exploits)) return null;
  const nameLower = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Exact match first
  let found = exploits.find(e => e.title?.toLowerCase() === name.toLowerCase());
  if (found) return found;
  
  // Normalized match
  found = exploits.find(e => 
    e.title?.toLowerCase().replace(/[^a-z0-9]/g, '') === nameLower
  );
  if (found) return found;
  
  // Partial match for names like "bunni.lol" -> "Bunni.lol"
  found = exploits.find(e => {
    const titleNorm = e.title?.toLowerCase().replace(/[^a-z0-9]/g, '');
    return titleNorm?.includes(nameLower) || nameLower.includes(titleNorm);
  });
  
  return found;
}

// Fetch sUNC data from Rubis API using dynamic WEAO keys
async function fetchRubisData(scrapId, accessKey) {
  try {
    const url = `https://${_rubis.host}${_rubis.path}${scrapId}/raw?accessKey=${accessKey}`;
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 
        'Accept': 'application/json' 
      }
    });
    if (!response.ok) {
      console.error(`Rubis API error for ${scrapId}: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) { 
    console.error('Rubis fetch error:', error.message);
    return null; 
  }
}

// Categorize test results from Rubis
function categorizeRubisResults(passed = [], failed = {}) {
  const results = [];
  const categories = {};
  
  // passed is an array of test names
  if (Array.isArray(passed)) {
    passed.forEach(name => results.push({ name, status: 'pass' }));
  }
  
  // failed is an object { testName: "reason" } or array
  if (Array.isArray(failed)) {
    failed.forEach(name => results.push({ name, status: 'fail' }));
  } else if (typeof failed === 'object' && failed !== null) {
    Object.keys(failed).forEach(name => results.push({ name, status: 'fail', reason: failed[name] }));
  }
  
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

// Parse Rubis sUNC data with executor version from scan
function parseRubisData(rubisData, executorName, weaoExploitData = null) {
  if (!rubisData || !rubisData.__SUNC) return null;
  
  const passed = rubisData.tests?.passed || [];
  const failed = rubisData.tests?.failed || {};
  
  // Calculate total - failed can be object or array
  const failedCount = Array.isArray(failed) ? failed.length : Object.keys(failed).length;
  const total = passed.length + failedCount;
  const percentage = total > 0 ? Math.round((passed.length / total) * 100) : 0;
  
  // Parse test date from timestamp
  let testDate = null;
  if (rubisData.timestamp) {
    const date = new Date(rubisData.timestamp * 1000);
    testDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Get scanned version from Rubis data (this is the version that was tested)
  const scannedVersion = rubisData.version || null;
  
  // Get executor info from WEAO (current version, update status, etc.)
  const executorVersion = weaoExploitData?.version || null;
  const updateStatus = weaoExploitData?.updateStatus || false;
  const rbxVersion = weaoExploitData?.rbxversion || null;
  
  const { results, categories } = categorizeRubisResults(passed, failed);
  
  return {
    executorName: rubisData.executor?.split('/')[0] || executorName,
    testType: 'sunc',
    percentage,
    passed: passed.length,
    total,
    failed: failedCount,
    testDate,
    // Версия из скана Rubis (версия sUNC теста)
    scannedVersion,
    // Текущая версия эксплоита из WEAO
    executorVersion,
    // Версия sUNC теста
    suncTestVersion: rubisData.version || '2.1.0',
    timeTaken: rubisData.timeTaken,
    source: 'weao.xyz/rubis.app',
    // Дополнительная информация из WEAO
    updateStatus,
    rbxVersion,
    results,
    categories
  };
}

// Endpoint for UNC test data - ONLY via WEAO/Rubis
app.get('/api/unc-test/:name', strictLimiter, async (req, res) => {
  try {
    const { name } = req.params;
    const testType = req.query.type === 'unc' ? 'unc' : 'sunc';
    const cacheKey = `${name.toLowerCase()}_${testType}`;
    
    console.log(`UNC test request: ${name}, type: ${testType}`);
    
    // Check cache
    const now = Date.now();
    if (uncTestCache[cacheKey] && (now - uncTestCache[cacheKey].timestamp) < UNC_CACHE_TTL) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(uncTestCache[cacheKey].data);
    }
    
    // Fetch fresh WEAO exploits data
    console.log('Fetching WEAO exploits...');
    const exploits = await fetchWeaoExploitsForRubis();
    console.log(`Got ${Array.isArray(exploits) ? exploits.length : 0} exploits from WEAO`);
    
    const exploit = findExploitInWeao(exploits, name);
    
    if (!exploit) {
      console.log(`Exploit not found: ${name}`);
      return res.status(404).json({ 
        error: 'Executor not found in WEAO database',
        hint: 'This executor may not be tracked by WEAO'
      });
    }
    
    // Check if exploit has sUNC data
    if (!exploit.sunc?.suncScrap || !exploit.sunc?.suncKey) {
      return res.status(404).json({ 
        error: 'No sUNC test data available for this executor',
        executorName: exploit.title,
        suncPercentage: exploit.suncPercentage || null,
        uncPercentage: exploit.uncPercentage || null
      });
    }
    
    // Fetch sUNC data from Rubis API
    const rubisData = await fetchRubisData(exploit.sunc.suncScrap, exploit.sunc.suncKey);
    
    if (!rubisData) {
      // Return basic info from WEAO if Rubis fails
      return res.status(200).json({
        executorName: exploit.title,
        testType: 'sunc',
        percentage: exploit.suncPercentage || 0,
        passed: 0,
        total: 0,
        failed: 0,
        testDate: exploit.updatedDate || null,
        executorVersion: exploit.version || null,
        source: 'weao.xyz (rubis unavailable)',
        results: [],
        categories: {}
      });
    }
    
    // Parse Rubis data with WEAO exploit info
    const parsedData = parseRubisData(rubisData, name, exploit);
    
    if (!parsedData) {
      return res.status(500).json({ error: 'Failed to parse test data' });
    }
    
    // Cache result
    uncTestCache[cacheKey] = {
      data: parsedData,
      timestamp: now
    };
    
    res.setHeader('X-Cache', 'MISS');
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
