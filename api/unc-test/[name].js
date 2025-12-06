// UNC Test data - WEAO/Rubis API only (no fallback)
let uncTestCache = {};
const UNC_CACHE_TTL = 300000; // 5 minutes

// WEAO exploits cache
let weaoExploitsCache = null;
let weaoExploitsCacheTime = 0;
const WEAO_CACHE_TTL = 300000; // 5 minutes

// Obfuscated sources
const _d = (s) => Buffer.from(s, 'base64').toString('utf8');
const _src = {
  rubis: _d('YXBpLnJ1YmlzLmFwcA=='),
  rubisPath: _d('L3YyL3NjcmFwLw==')
};

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

async function fetchWeaoExploits() {
  const now = Date.now();
  if (weaoExploitsCache && (now - weaoExploitsCacheTime) < WEAO_CACHE_TTL) {
    return weaoExploitsCache;
  }
  
  // Try multiple WEAO domains for redundancy
  const domains = ['weao.xyz', 'weao.gg', 'whatexpsare.online'];
  
  for (const domain of domains) {
    try {
      const response = await fetch(`https://${domain}/api/status/exploits`, {
        headers: { 
          'User-Agent': 'WEAO-3PService', 
          'Accept': 'application/json' 
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        weaoExploitsCache = data;
        weaoExploitsCacheTime = now;
        return data;
      }
    } catch (error) {
      console.error(`WEAO fetch failed for ${domain}:`, error.message);
    }
  }
  
  return weaoExploitsCache || [];
}

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
  
  // Partial match
  found = exploits.find(e => {
    const titleNorm = e.title?.toLowerCase().replace(/[^a-z0-9]/g, '');
    return titleNorm?.includes(nameLower) || nameLower.includes(titleNorm);
  });
  
  return found;
}

async function fetchRubisData(scrapId, accessKey) {
  try {
    const url = `https://${_src.rubis}${_src.rubisPath}${scrapId}/raw?accessKey=${accessKey}`;
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 
        'Accept': 'application/json' 
      }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) { 
    console.error('Rubis fetch error:', error.message);
    return null; 
  }
}

function categorizeResults(passed = [], failed = {}) {
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

function parseRubisData(rubisData, executorName, weaoExploitData = null) {
  if (!rubisData || !rubisData.__SUNC) return null;
  
  const passed = rubisData.tests?.passed || [];
  const failed = rubisData.tests?.failed || {};
  
  // Calculate total - failed can be object or array
  const failedCount = Array.isArray(failed) ? failed.length : Object.keys(failed).length;
  const total = passed.length + failedCount;
  const percentage = total > 0 ? Math.round((passed.length / total) * 100) : 0;
  
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
  
  const scannedVersion = rubisData.version || null;
  const executorVersion = weaoExploitData?.version || null;
  const updateStatus = weaoExploitData?.updateStatus || false;
  const rbxVersion = weaoExploitData?.rbxversion || null;
  
  const { results, categories } = categorizeResults(passed, failed);
  
  return {
    executorName: rubisData.executor?.split('/')[0] || executorName,
    testType: 'sunc',
    percentage,
    passed: passed.length,
    total,
    failed: failedCount,
    testDate,
    scannedVersion,
    executorVersion,
    suncTestVersion: rubisData.version || '2.1.0',
    timeTaken: rubisData.timeTaken,
    source: 'weao.xyz/rubis.app',
    updateStatus,
    rbxVersion,
    results,
    categories
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { name } = req.query;
    const testType = req.query.type === 'unc' ? 'unc' : 'sunc';
    const cacheKey = `${name.toLowerCase()}_${testType}`;
    const now = Date.now();
    
    // Check cache
    if (uncTestCache[cacheKey] && (now - uncTestCache[cacheKey].timestamp) < UNC_CACHE_TTL) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(uncTestCache[cacheKey].data);
    }
    
    // Fetch WEAO exploits
    const exploits = await fetchWeaoExploits();
    const exploit = findExploitInWeao(exploits, name);
    
    if (!exploit) {
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
        uncPercentage: exploit.uncPercentage || null,
        executorVersion: exploit.version || null
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
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(parsedData);
    
  } catch (error) {
    console.error('UNC test error:', error);
    return res.status(500).json({ error: 'Failed to fetch test data' });
  }
}
