// UNC Test data cache
let uncTestCache = {};
const UNC_CACHE_TTL = 300000; // 5 minutes

// Obfuscated test data source
const _d = (s) => Buffer.from(s, 'base64').toString('utf8');
const _src = {
  h: _d('cmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbQ=='),
  p: _d('L2xvY2Fsc2NyaXB0cy92b3hsaXMuTkVUL21haW4vYXNzZXRzL3VuYy8=')
};

// Executor mapping
const _xMap = {
  'wave': 'wave',
  'seliware': 'seliware',
  'delta': 'delta',
  'codex': 'codex',
  'velocity': 'Velocity',
  'awp': 'awp',
  'cryptic': 'cryptic',
  'ember': 'ember',
  'krnl': 'krnl',
  'macsploit': 'macsploit',
  'nihon': 'nihon',
  'nksoftware': 'nksoftware',
  'ronix': 'ronix',
  'sirhurt': 'sirhurt',
  'solara': 'solara',
  'swift': 'swift',
  'synapsez': 'synapsez',
  'vegax': 'vegax',
  'xeno': 'xeno',
  'zenith': 'zenith',
  'matcha': 'matcha'
};

// Test data parser
function parseTestData(rawText, executorName, testType) {
  const resultsMap = new Map();
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
  
  // Blacklist
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
    if (!/^[a-zA-Z]/.test(name)) return true;
    if (!/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(name)) return true;
    if (blacklistExact.has(name.toLowerCase())) return true;
    if (/tests?\s*(failed|passed)|success\s*rate|out\s*of|version|discord/i.test(name)) return true;
    return false;
  };
  
  if (testType === 'sunc') {
    const suncSection = rawText.includes('UNC Environment Check') 
      ? rawText.split('UNC Environment Check')[0] 
      : rawText;
    
    const suncMatch = suncSection.match(/(\d+)%\s*.{0,20}?rate\s*\((\d+)\s*.{0,10}?out.{0,10}?of.{0,10}?(\d+)\)/i) ||
                      suncSection.match(/(\d+)%\s*succ.ss\s*rate\s*\((\d+)/i) ||
                      suncSection.match(/(\d+)%.*?(\d+)\s*out\s*of\s*(\d+)/);
    
    if (suncMatch) {
      percentage = parseInt(suncMatch[1]);
      passed = parseInt(suncMatch[2]);
      total = parseInt(suncMatch[3]);
      failed = total - passed;
    }
    
    const suncLines = suncSection.split('\n');
    for (const line of suncLines) {
      const trimmed = line.trim();
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
        
        if (!resultsMap.has(name.toLowerCase())) {
          resultsMap.set(name.toLowerCase(), { name, status });
        }
      }
    }
  } else {
    const uncMatch = rawText.match(/Tested with a (\d+)% success rate \((\d+) out of (\d+)\)/i);
    
    if (uncMatch) {
      percentage = parseInt(uncMatch[1]);
      passed = parseInt(uncMatch[2]);
      total = parseInt(uncMatch[3]);
      failed = total - passed;
    }
    
    const uncSection = rawText.includes('UNC Environment Check') ? 
      rawText.split('UNC Environment Check')[1] : rawText;
    
    const uncLines = uncSection.split('\n');
    for (const line of uncLines) {
      const trimmed = line.trim();
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
    
    // Check cache
    const now = Date.now();
    if (uncTestCache[cacheKey] && (now - uncTestCache[cacheKey].timestamp) < UNC_CACHE_TTL) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(uncTestCache[cacheKey].data);
    }
    
    // Get internal filename
    const _xName = _xMap[name.toLowerCase()];
    if (!_xName) {
      return res.status(404).json({ error: 'Executor not found in test database' });
    }
    
    // Fetch from source
    const response = await fetch(
      `https://${_src.h}${_src.p}${_xName}.json`,
      { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
    
    const parsedData = parseTestData(rawText, name, testType);
    
    // Cache result
    uncTestCache[cacheKey] = {
      data: parsedData,
      timestamp: now
    };
    
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('UNC test fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch test data' });
  }
}
