import React, { useState, useEffect } from 'react';
import Particles from './components/Particles';
import SpotlightCard from './components/SpotlightCard';
import TargetCursor from './components/TargetCursor';
import Dock from './components/Dock';
import GradientText from './components/GradientText';
import AnimatedLogo from './components/AnimatedLogo';
import { AnimationReadyProvider } from './components/AnimationReadyProvider';

interface DowngradeCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

const DowngradeCard: React.FC<DowngradeCardProps> = ({ title, children, icon, variant = 'default' }) => {
  const variantStyles = {
    default: {
      spotlightColor: 'rgba(255, 10, 226, 0.15)' as `rgba(${number}, ${number}, ${number}, ${number})`,
      borderHover: 'hover:border-pink-500/30',
    },
    success: {
      spotlightColor: 'rgba(34, 197, 94, 0.15)' as `rgba(${number}, ${number}, ${number}, ${number})`,
      borderHover: 'hover:border-green-500/30',
    },
    warning: {
      spotlightColor: 'rgba(239, 68, 68, 0.15)' as `rgba(${number}, ${number}, ${number}, ${number})`,
      borderHover: 'hover:border-red-500/30',
    },
  };

  const styles = variantStyles[variant];

  return (
    <SpotlightCard
      className={`cursor-target h-auto w-full max-w-[900px] ${styles.borderHover} hover:-translate-y-1 transition-all duration-300`}
      spotlightColor={styles.spotlightColor}
    >
      <div className="flex flex-col h-full">
        {title && (
          <div className="flex items-center gap-3 mb-4">
            {icon && (
              <div className={`w-10 h-10 rounded-lg ${variant === 'success' ? 'bg-green-500/15 border-green-500/30 text-green-500' : variant === 'warning' ? 'bg-red-500/15 border-red-500/30 text-red-500' : 'bg-pink-500/15 border-pink-500/30 text-pink-500'} border flex items-center justify-center`}>
                {icon}
              </div>
            )}
            <h3 className={`text-lg font-bold ${variant === 'success' ? 'text-green-400' : variant === 'warning' ? 'text-red-400' : 'text-white'}`}>{title}</h3>
          </div>
        )}

        <div className="text-sm text-gray-400 leading-relaxed">
          {children}
        </div>
      </div>
    </SpotlightCard>
  );
};

// Obfuscated API configuration
const _0x = (s: string) => atob(s);
const _d = ['d2Vhby5nZw==', 'd2Vhby54eXo=', 'd2hhdGV4cHNhcmUub25saW5l', 'd2hhdGV4cGxvaXRzYXJldHJhLnNo'];
const _r = 'cmRkLndlYW8uZ2c=';

const DowngradeApp: React.FC = () => {
  const [previousVersion, setPreviousVersion] = useState('version-e380c8edc8f6477c');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dockItems = [
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      label: 'Home', 
      onClick: () => window.location.href = '/'
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
      label: 'Info', 
      onClick: () => window.location.href = '/information'
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
      label: 'Downgrade', 
      onClick: () => window.location.href = '/downgrade'
    },
  ];

  useEffect(() => {
    fetchPreviousVersion();
  }, []);

  const fetchWithFallback = async (endpoint: string) => {
    const domains = [..._d].sort(() => Math.random() - 0.5).map(d => _0x(d));
    for (const domain of domains) {
      try {
        const url = `https://${domain}${endpoint}`;
        const response = await fetch(url);
        if (response.status === 429) continue;
        if (!response.ok) continue;
        return await response.json();
      } catch (error) {
        continue;
      }
    }
    return null;
  };

  const fetchPreviousVersion = async () => {
    try {
      const data = await fetchWithFallback('/api/versions/past');
      if (data && data.Windows) {
        setPreviousVersion(data.Windows);
        localStorage.setItem('previousRobloxVersion', data.Windows);
      }
    } catch (error) {
      console.error('Failed to fetch previous version:', error);
      const savedVersion = localStorage.getItem('previousRobloxVersion');
      if (savedVersion) {
        setPreviousVersion(savedVersion);
      }
    }
  };

  const downloadPreviousVersion = () => {
    const channelName = 'LIVE';
    const binaryType = 'WindowsPlayer';
    const queryString = `?channel=${encodeURIComponent(channelName)}&binaryType=${encodeURIComponent(binaryType)}&version=${encodeURIComponent(previousVersion)}`;
    window.open(`https://${_0x(_r)}/${queryString}`, '_blank');
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyableCode: React.FC<{ children: string; id: string }> = ({ children, id }) => {
    const isCopied = copiedId === id;
    return (
      <span className="relative inline-block group">
        <code
          onClick={() => copyToClipboard(children, id)}
          className={`cursor-pointer px-2 py-1 rounded bg-neutral-900/80 font-mono text-green-400 text-sm transition-all duration-300 hover:bg-green-500/20 hover:shadow-[0_0_0_2px_rgba(34,197,94,0.3)] whitespace-nowrap select-none ${isCopied ? 'bg-green-500/30' : ''}`}
        >
          {children}
        </code>
        {/* Tooltip */}
        <span 
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none transition-all duration-300 z-50 ${
            isCopied 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          style={{
            background: 'rgba(15, 23, 36, 0.95)',
            backdropFilter: 'blur(8px)',
            color: '#ff0ae2',
            border: '1px solid rgba(255, 10, 226, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            textShadow: '0 0 10px rgba(255, 10, 226, 0.8)',
          }}
        >
          {isCopied ? 'Copied!' : 'Click to copy!'}
        </span>
        {/* Arrow */}
        <span 
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-0 h-0 pointer-events-none transition-all duration-300 ${
            isCopied 
              ? 'opacity-100' 
              : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgb(15, 23, 36)',
          }}
        />
      </span>
    );
  };

  const StaticCode: React.FC<{ children: string }> = ({ children }) => (
    <code className="px-2 py-1 rounded bg-neutral-900/80 font-mono text-green-400 text-sm whitespace-nowrap">
      {children}
    </code>
  );

  const FishstrapIcon = () => (
    <img src="/fishstrap.png" alt="Fishstrap" className="w-5 h-5 inline-block align-middle" />
  );

  const WindowsIcon = () => (
    <img src="/windows.png" alt="Windows" className="w-4 h-4 inline-block align-middle brightness-0 invert" />
  );

  const RobloxIcon = () => (
    <img src="/roblox.webp" alt="Roblox" className="w-5 h-5 inline-block align-middle" />
  );

  const DownloadIcon = () => (
    <img src="/download.png" alt="Download" className="w-4 h-4 inline-block align-middle brightness-0 invert" />
  );

  const WarningEmoji = () => (
    <span className="inline-block align-middle mr-1" style={{ verticalAlign: 'middle', marginTop: '-2px' }}>⚠️</span>
  );

  const StepNumber: React.FC<{ num: number }> = ({ num }) => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-pink-500/40">
      {num}
    </div>
  );

  return (
    <AnimationReadyProvider minDelay={400}>
    <div className="min-h-screen bg-[#08080c] text-white font-sans antialiased overflow-x-hidden">
      <TargetCursor 
        targetSelector=".cursor-target"
        spinDuration={2}
        hideDefaultCursor={true}
        hoverDuration={0.2}
        parallaxOn={false}
      />

      <div className="fixed inset-0 z-0 pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
        <Particles
          particleCount={100}
          particleSpread={10}
          speed={0.05}
          particleBaseSize={80}
          particleColors={['#ff0ae2']}
          moveParticlesOnHover={true}
          particleHoverFactor={1}
          alphaParticles={false}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      <div className="fixed top-[-200px] right-[-200px] w-[800px] h-[800px] bg-gradient-radial from-pink-500 to-transparent opacity-30 rounded-full pointer-events-none z-[-1]" style={{ willChange: 'transform' }} />
      <div className="fixed bottom-[-200px] left-[-200px] w-[700px] h-[700px] bg-gradient-radial from-blue-500 to-transparent opacity-25 rounded-full pointer-events-none z-[-1]" style={{ willChange: 'transform' }} />

      <header className="fixed top-0 left-0 right-0 h-[100px] z-50 flex items-center justify-between px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <a href="https://robloxcheatz.com" className="block cursor-pointer">
            <AnimatedLogo
              src="/logo.jpg"
              alt="RobloxCheatz"
              size={50}
              magnification={70}
              distance={200}
              spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
            />
          </a>
        </div>
        
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            distance={200}
            spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
          />
        </div>
      </header>

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <GradientText 
            className="text-4xl md:text-5xl font-black leading-relaxed relative z-10"
            colors={['#ff0ae2', '#9c40ff', '#3b82f6', '#ff0ae2']}
            animationSpeed={6}
          >
            How to Downgrade
          </GradientText>
          <p className="text-gray-500 text-sm mt-6">
            Step-by-step guide to downgrade Roblox using Fishstrap
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Main Steps Card */}
          <DowngradeCard
            title="How to Downgrade Roblox Using Fishstrap"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            }
          >
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <StepNumber num={1} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    Open your executor → go to <span className="text-pink-400 font-semibold">Settings</span> → find <span className="text-pink-400 font-semibold">Roblox Version</span> and change <StaticCode>production</StaticCode> to <CopyableCode id="version">{previousVersion}</CopyableCode>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <StepNumber num={2} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    <span className="text-pink-400 font-semibold">Restart</span> your executor — the version indicator on the main tab should no longer be red.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <StepNumber num={3} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    Download the file from{' '}
                    <button
                      onClick={downloadPreviousVersion}
                      className="cursor-target inline-flex items-center gap-1.5 text-green-400 font-semibold hover:text-green-300 transition-colors border-b border-transparent hover:border-green-400"
                      style={{ position: 'relative', top: '4px' }}
                    >
                      <DownloadIcon />
                      Download
                    </button>{' '}
                    and open it once it's done downloading.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4">
                <StepNumber num={4} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    Press <WindowsIcon /> + <kbd className="px-2 py-1 bg-neutral-800 rounded text-white font-mono text-xs font-bold">R</kbd>, type <CopyableCode id="localappdata1">%localappdata%</CopyableCode>, and hit Enter.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-4">
                <StepNumber num={5} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    Go to{' '}
                    <a href="https://fishstrap.org" target="_blank" rel="noopener noreferrer" className="cursor-target inline-flex items-center gap-1.5 text-orange-400 font-semibold hover:text-orange-300 transition-colors border-b border-transparent hover:border-orange-400" style={{ position: 'relative', top: '6px' }}>
                      <FishstrapIcon />Fishstrap
                    </a>{' '}
                    → Versions and open the folder with random letters/numbers.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex items-start gap-4">
                <StepNumber num={6} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    Paste the downloaded folder into the{' '}
                    <a href="https://fishstrap.org" target="_blank" rel="noopener noreferrer" className="cursor-target inline-flex items-center gap-1.5 text-orange-400 font-semibold hover:text-orange-300 transition-colors border-b border-transparent hover:border-orange-400" style={{ position: 'relative', top: '6px' }}>
                      <FishstrapIcon />Fishstrap
                    </a>{' '}
                    folder and choose <span className="text-yellow-400 font-semibold">Replace the files in destination</span> when prompted.
                  </p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="flex items-start gap-4">
                <StepNumber num={7} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    If you want to use <span className="text-yellow-400 font-semibold">multi-instance</span> or <span className="text-yellow-400 font-semibold">join private servers</span>, press <WindowsIcon /> + <kbd className="px-2 py-1 bg-neutral-800 rounded text-white font-mono text-xs font-bold">R</kbd>, type <CopyableCode id="localappdata2">%localappdata%</CopyableCode>, and hit Enter.
                  </p>
                </div>
              </div>

              {/* Step 8 */}
              <div className="flex items-start gap-4">
                <StepNumber num={8} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    Navigate to <span className="inline-flex items-center gap-1.5 text-blue-400 font-semibold" style={{ position: 'relative', top: '6px' }}><RobloxIcon />Roblox</span> → Versions and open the folder with random letters/numbers.
                  </p>
                </div>
              </div>

              {/* Step 9 */}
              <div className="flex items-start gap-4">
                <StepNumber num={9} />
                <div className="flex-1 pt-2">
                  <p className="text-gray-300">
                    Remove all files from it, then replace them with the downloaded folder contents.
                  </p>
                </div>
              </div>
            </div>
          </DowngradeCard>

          {/* Success Card */}
          <DowngradeCard
            title="You're All Set!"
            variant="success"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            }
          >
            <p className="text-green-300 font-medium">
              🎉 <strong>Now you're all set!</strong> Your Roblox should be downgraded and ready to use.
            </p>
          </DowngradeCard>

          {/* Warning Card */}
          <DowngradeCard
            title="Troubleshooting"
            variant="warning"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            }
          >
            <div className="space-y-4">
              <p className="text-red-300">
                <WarningEmoji /> <span className="font-bold text-red-400">TROUBLESHOOTING:</span> If you get a <strong>version mismatch</strong>, uninstall{' '}
                <a href="https://fishstrap.org" target="_blank" rel="noopener noreferrer" className="cursor-target inline-flex items-center gap-1 text-orange-400 font-semibold hover:text-orange-300 transition-colors" style={{ position: 'relative', top: '6px' }}>
                  <FishstrapIcon />Fishstrap
                </a>{' '}
                from Control Panel and <span className="text-red-400 font-bold">DO NOT save the settings</span>, then reinstall it and don't touch the settings and follow the steps above again.
              </p>
              <p className="text-red-300">
                <WarningEmoji /> <span className="font-bold text-red-400">IMPORTANT WARNING:</span> Use at your own risk is more of in case Roblox make a change tomorrow. Currently downgrading is fine.
              </p>
            </div>
          </DowngradeCard>

          {/* Video Tutorial Card */}
          <DowngradeCard
            title="Video Tutorial"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            }
          >
            <p className="text-gray-300 mb-4">
              If you still find it difficult to understand how to downgrade, watch this video tutorial:
            </p>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg border border-pink-500/20"
                src="https://www.youtube.com/embed/XA8H_257xlg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DowngradeCard>

          {/* Back Button */}
          <button
            onClick={() => window.location.href = '/'}
            className="cursor-target mt-6 px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-xl hover:from-pink-400 hover:to-blue-400 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50"
          >
            Back to Main Page
          </button>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-6">
            <a href="/terms.html" className="cursor-target text-gray-500 text-sm hover:text-pink-500 transition-colors">
              Terms of Service
            </a>
            <a href="/privacy.html" className="cursor-target text-gray-500 text-sm hover:text-pink-500 transition-colors">
              Privacy Policy
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            2024 RobloxCheatz. All rights reserved. Not affiliated with Roblox Corporation.
          </p>
        </div>
      </footer>
    </div>
    </AnimationReadyProvider>
  );
};

export default DowngradeApp;
