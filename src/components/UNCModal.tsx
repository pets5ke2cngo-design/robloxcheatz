import React, { useEffect, useState, useRef } from 'react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip' | 'warn';
}

interface ParsedTestData {
  executorName: string;
  testType: 'sunc' | 'unc';
  percentage: number;
  passed: number;
  total: number;
  failed: number;
  testDate?: string;
  results: TestResult[];
  categories: Record<string, TestResult[]>;
}

interface UNCModalProps {
  isOpen: boolean;
  onClose: () => void;
  exploitName: string;
  testType: 'sunc' | 'unc';
  percentage: number | null;
}

const UNCModal: React.FC<UNCModalProps> = ({ isOpen, onClose, exploitName, testType, percentage }) => {
  const [testData, setTestData] = useState<ParsedTestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && exploitName) {
      fetchTestData();
    }
  }, [isOpen, exploitName, testType]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const fetchTestData = async () => {
    setLoading(true);
    setError(null);
    setSelectedCategory(null);
    
    try {
      const response = await fetch(`/api/unc-test/${encodeURIComponent(exploitName.toLowerCase())}?type=${testType}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Test data not available for this executor');
        }
        throw new Error('Failed to fetch test data');
      }
      
      const data = await response.json();
      setTestData(data);
      
      // Set first category as default
      if (data.categories && Object.keys(data.categories).length > 0) {
        setSelectedCategory(Object.keys(data.categories)[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // SVG Icons for status
  const PassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  const FailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );

  const SkipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );

  const WarnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <PassIcon />;
      case 'fail':
        return <FailIcon />;
      case 'skip':
        return <SkipIcon />;
      case 'warn':
        return <WarnIcon />;
      default:
        return <span className="w-4 h-4 rounded-full bg-gray-500/50"></span>;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-500/10 border-green-500/30';
      case 'fail':
        return 'bg-red-500/10 border-red-500/30';
      case 'skip':
        return 'bg-gray-500/10 border-gray-500/30';
      case 'warn':
        return 'bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const categorizeResults = (results: TestResult[]) => {
    const categories: Record<string, TestResult[]> = {
      'cache': [],
      'closures': [],
      'crypt': [],
      'debug': [],
      'filesystem': [],
      'input': [],
      'instances': [],
      'metatable': [],
      'misc': [],
      'drawing': [],
      'websocket': [],
      'console': [],
      'scripts': [],
      'other': [],
    };

    results.forEach(result => {
      const name = result.name.toLowerCase();
      if (name.startsWith('cache.')) categories['cache'].push(result);
      else if (name.includes('closure') || name.includes('cclosure') || name.includes('lclosure')) categories['closures'].push(result);
      else if (name.startsWith('crypt.') || name.includes('base64') || name.includes('lz4')) categories['crypt'].push(result);
      else if (name.startsWith('debug.')) categories['debug'].push(result);
      else if (name.includes('file') || name.includes('folder') || name.includes('appendfile') || name.includes('readfile') || name.includes('writefile') || name.includes('listfiles') || name.includes('loadfile') || name.includes('makefolder') || name.includes('delfolder') || name.includes('delfile') || name.includes('isfile') || name.includes('isfolder')) categories['filesystem'].push(result);
      else if (name.includes('mouse') || name.includes('click') || name.includes('input') || name.includes('isrbxactive')) categories['input'].push(result);
      else if (name.includes('instance') || name.includes('cloneref') || name.includes('compareinstances') || name.includes('gethui') || name.includes('getnil') || name.includes('fireclickdetector') || name.includes('fireproximityprompt') || name.includes('firetouchinterest') || name.includes('firesignal')) categories['instances'].push(result);
      else if (name.includes('metatable') || name.includes('readonly') || name.includes('rawmetatable') || name.includes('hookmetamethod') || name.includes('namecallmethod')) categories['metatable'].push(result);
      else if (name.startsWith('drawing') || name.includes('renderobj') || name.includes('renderproperty') || name.includes('drawcache')) categories['drawing'].push(result);
      else if (name.includes('websocket')) categories['websocket'].push(result);
      else if (name.includes('rconsole') || name.includes('console')) categories['console'].push(result);
      else if (name.includes('script') || name.includes('loadstring') || name.includes('decompile') || name.includes('getscript') || name.includes('getsenv') || name.includes('getrunning') || name.includes('getloaded') || name.includes('bytecode') || name.includes('scripthash')) categories['scripts'].push(result);
      else categories['other'].push(result);
    });

    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) delete categories[key];
    });

    return categories;
  };

  const displayCategories = testData?.categories && Object.keys(testData.categories).length > 0 
    ? testData.categories 
    : (testData?.results ? categorizeResults(testData.results) : {});

  return (
    <div 
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn cursor-target"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="cursor-target relative w-full max-w-3xl max-h-[85vh] bg-[#0f0f14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-modalSlideIn"
        style={{
          boxShadow: '0 0 60px rgba(255, 10, 226, 0.15), 0 0 100px rgba(59, 130, 246, 0.1)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f0f14]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                testType === 'sunc' ? 'bg-pink-500/20' : 'bg-blue-500/20'
              }`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={testType === 'sunc' ? '#ec4899' : '#3b82f6'} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M12 2a10 10 0 1 0 10 10"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {exploitName} <span className={testType === 'sunc' ? 'text-pink-400' : 'text-blue-400'}>{testType.toUpperCase()}</span> Test
                </h2>
                {testData?.testDate && (
                  <p className="text-xs text-gray-500">Tested: {testData.testDate}</p>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="cursor-target w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Stats bar */}
          {testData && (
            <div className="flex items-center gap-4 mt-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                testType === 'sunc' ? 'bg-pink-500/15 border border-pink-500/30' : 'bg-blue-500/15 border border-blue-500/30'
              }`}>
                <span className={`text-2xl font-bold ${testType === 'sunc' ? 'text-pink-400' : 'text-blue-400'}`}>
                  {percentage !== null ? percentage : testData.percentage}%
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  {testData.passed} passed
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  {testData.failed} failed
                </span>
                <span className="text-gray-500">
                  {testData.total} total
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading test results...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p className="text-gray-400 text-center">{error}</p>
              {percentage !== null && (
                <p className="text-gray-500 text-sm mt-2">
                  Known percentage: {percentage}%
                </p>
              )}
            </div>
          )}

          {testData && !loading && !error && (
            <div className="p-6">
              {/* Category tabs */}
              {Object.keys(displayCategories).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(displayCategories).map(category => {
                    const results = displayCategories[category];
                    const passCount = results.filter(r => r.status === 'pass').length;
                    const failCount = results.filter(r => r.status === 'fail').length;
                    const skipCount = results.filter(r => r.status === 'skip').length;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`cursor-target px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-pink-500/20 border border-pink-500/50 text-pink-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {category}
                        <span className="ml-2 text-green-400">{passCount}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-red-400">{failCount}</span>
                        {skipCount > 0 && (
                          <>
                            <span className="text-gray-500">/</span>
                            <span className="text-gray-400">{skipCount}</span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Results list */}
              {selectedCategory && displayCategories[selectedCategory] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {displayCategories[selectedCategory].map((result, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusClass(result.status)} transition-all hover:scale-[1.01]`}
                    >
                      {getStatusIcon(result.status)}
                      <span className="text-sm text-gray-300 font-mono truncate">{result.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* All results if no categories */}
              {Object.keys(displayCategories).length === 0 && testData.results && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {testData.results.map((result, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusClass(result.status)} transition-all hover:scale-[1.01]`}
                    >
                      {getStatusIcon(result.status)}
                      <span className="text-sm text-gray-300 font-mono truncate">{result.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0f0f14]/95 backdrop-blur-xl border-t border-white/10 px-6 py-3">
          <p className="text-xs text-gray-500 text-center">
            {testType === 'sunc' ? 'sUNC' : 'UNC'} compatibility test results
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UNCModal;
