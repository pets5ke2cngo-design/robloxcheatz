// UNC Test data cache
let uncTestCache = {};
const UNC_CACHE_TTL = 300000; // 5 minutes

// WEAO exploits cache
let weaoExploitsCache = null;
let weaoExploitsCacheTime = 0;
const WEAO_CACHE_TTL = 600000; // 10 minutes

// Obfuscated sources
const _d = (s) => Buffer.from(s, 'base64').toString('utf8');
const _src = {
  h: _d('cmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbQ=='),
  p: _d('L2xvY2Fsc2NyaXB0cy92b3hsaXMuTkVUL21haW4vYXNzZXRzL3VuYy8='),
  weao: _d('d2Vhby5nZw=='),
  weaoPath: _d('L2FwaS9zdGF0dXMvZXhwbG9pdHM='),
  rubis: _d('YXBpLnJ1YmlzLmFwcA=='),
  rubisPath: _d('L3YyL3NjcmFwLw==')
};

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

const _xMap = {
  'wave': 'wave', 'seliware': 'seliware', 'delta': 'delta', 'codex': 'codex',
  'velocity': 'Velocity', 'cryptic': 'cryptic', 'krnl': 'krnl', 'macsploit': 'macsploit',
  'sirhurt': 'sirhurt', 'solara': 'solara', 'swift': 'swift', 'xeno': 'xeno',
  'zenith': 'zenith', 'matcha': 'matcha', 'potassium': 'potassium', 'volt': 'volt',
  'volcano': 'volcano', 'valex': 'valex', 'bunni.lol': 'bunnilol', 'bunnilol': 'bunnilol',
  'hydrogen': 'hydrogen', 'nucleus': 'nucleus', 'chocosploit': 'chocosploit'
};

async function fetchWeaoExploits() {
  const now = Date.now();
  if (weaoExploitsCache && (now - weaoExploitsCacheTime) < WEAO_CACHE_TTL) return weaoExploitsCache;
  try {
    const response = await fetch(`https://${_src.weao}${_src.weaoPath}`, {
      headers: { 'User-Agent': 'WEAO-3PService', 'Accept': 'application/json' }
    });
    if (!response.ok) return weaoExploitsCache || [];
    const data = await response.json();
    weaoExploitsCache = data;
    weaoExploitsCacheTime = now;
    return data;
  } catch (error) { return weaoExploitsCache || []; }
}

function findExploitInWeao(exploits, name) {
  const nameLower = name.toLowerCase();
  return exploits.find(e => e.title?.toLowerCase() === nameLower || 
    e.title?.toLowerCase().replace(/[^a-z0-9]/g, '') === nameLower.replace(/[^a-z0-9]/g, ''));
}

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

function categorizeResults(passed = [], failed = []) {
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
  const { results, categories } = categorizeResults(passed, failed);
  return {
    executorName: rubisData.executor || executorName,
    testType: 'sunc',
    percentage, passed: passed.length, total, failed: failed.length,
    testDate, version: rubisData.version || '2.1.0', timeTaken: rubisData.timeTaken,
    source: 'rubis.app', results, categories
  };
}

function parseVoxlisData(rawText, executorName, testType) {
  const resultsMap = new Map();
  let percentage = 0, passed = 0, total = 0, failed = 0, testDate = null;
  const dateMatch = rawText.match(/Testing Date and Time:\s*(.+)/);
  if (dateMatch) testDate = dateMatch[1].trim();
  const blacklist = new Set(['passed','total','failed','error','success','test','tests','unc','sunc','version','date','time','check','results','result','out','loading','finished','environment','executor','info']);
  const isBlacklisted = (name) => {
    if (!name || name.length < 3 || name.length > 50) return true;
    if (!/^[a-zA-Z][a-zA-Z0-9_.]*$/.test(name)) return true;
    if (blacklist.has(name.toLowerCase())) return true;
    return false;
  };
  if (testType === 'sunc') {
    const section = rawText.includes('UNC Environment Check') ? rawText.split('UNC Environment Check')[0] : rawText;
    const match = section.match(/(\d+)%.*?(\d+)\s*out\s*of\s*(\d+)/);
    if (match) { percentage = parseInt(match[1]); passed = parseInt(match[2]); total = parseInt(match[3]); failed = total - passed; }
    section.split('\n').forEach(line => {
      const m = line.trim().match(/^([✅❌⏺️⚠️⛔])\s*([a-zA-Z][a-zA-Z0-9_.]*)/);
      if (m && !isBlacklisted(m[2])) {
        let status = m[1] === '✅' ? 'pass' : m[1] === '❌' || m[1] === '⛔' ? 'fail' : 'skip';
        if (!resultsMap.has(m[2].toLowerCase())) resultsMap.set(m[2].toLowerCase(), { name: m[2], status });
      }
    });
  } else {
    const match = rawText.match(/Tested with a (\d+)% success rate \((\d+) out of (\d+)\)/i);
    if (match) { percentage = parseInt(match[1]); passed = parseInt(match[2]); total = parseInt(match[3]); failed = total - passed; }
    const section = rawText.includes('UNC Environment Check') ? rawText.split('UNC Environment Check')[1] : rawText;
    section.split('\n').forEach(line => {
      const m = line.trim().match(/^[+\-\s]*([✅❌⏺️⚠️⛔])\s*([a-zA-Z][a-zA-Z0-9_.]*)/);
      if (m && !isBlacklisted(m[2])) {
        let status = m[1] === '✅' ? 'pass' : m[1] === '❌' || m[1] === '⛔' ? 'fail' : 'skip';
        if (!resultsMap.has(m[2].toLowerCase())) resultsMap.set(m[2].toLowerCase(), { name: m[2], status });
      }
    });
  }
  const results = Array.from(resultsMap.values());
  const categories = {};
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
    if (!categorized) { if (!categories['other']) categories['other'] = []; categories['other'].push(result); }
  });
  return { executorName, testType, percentage, passed, total, failed, testDate, results, categories };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { name } = req.query;
    const testType = req.query.type === 'unc' ? 'unc' : 'sunc';
    const cacheKey = `${name.toLowerCase()}_${testType}`;
    const now = Date.now();
    
    if (uncTestCache[cacheKey] && (now - uncTestCache[cacheKey].timestamp) < UNC_CACHE_TTL) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(uncTestCache[cacheKey].data);
    }
    
    if (testType === 'sunc') {
      const exploits = await fetchWeaoExploits();
      const exploit = findExploitInWeao(exploits, name);
      if (exploit?.sunc?.suncScrap && exploit?.sunc?.suncKey) {
        const rubisData = await fetchRubisData(exploit.sunc.suncScrap, exploit.sunc.suncKey);
        if (rubisData) {
          const parsedData = parseRubisData(rubisData, name);
          if (parsedData) {
            uncTestCache[cacheKey] = { data: parsedData, timestamp: now };
            res.setHeader('X-Cache', 'RUBIS');
            return res.status(200).json(parsedData);
          }
        }
      }
    }
    
    const _xName = _xMap[name.toLowerCase()];
    if (!_xName) return res.status(404).json({ error: 'Executor not found' });
    
    const response = await fetch(`https://${_src.h}${_src.p}${_xName}.json`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/plain' }
    });
    if (!response.ok) return res.status(404).json({ error: 'Test data not available' });
    
    const rawText = await response.text();
    if (!rawText || rawText.length < 100) return res.status(404).json({ error: 'Test data not available' });
    
    const parsedData = parseVoxlisData(rawText, name, testType);
    uncTestCache[cacheKey] = { data: parsedData, timestamp: now };
    res.setHeader('X-Cache', 'VOXLIS');
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('UNC test error:', error);
    res.status(500).json({ error: 'Failed to fetch test data' });
  }
}
