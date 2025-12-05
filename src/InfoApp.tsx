import React from 'react';
import Particles from './components/Particles';
import SpotlightCard from './components/SpotlightCard';
import TargetCursor from './components/TargetCursor';
import Dock from './components/Dock';
import GradientText from './components/GradientText';
import AnimatedLogo from './components/AnimatedLogo';
import { AnimationReadyProvider } from './components/AnimationReadyProvider';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, icon }) => {
  return (
    <SpotlightCard
      className="cursor-target h-auto min-h-[200px] w-full max-w-[400px] hover:border-pink-500/30 hover:-translate-y-1 transition-all duration-300"
      spotlightColor="rgba(255, 10, 226, 0.15)"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-500">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>

        <div className="text-sm text-gray-400 leading-relaxed">
          {children}
        </div>
      </div>
    </SpotlightCard>
  );
};

const InfoApp: React.FC = () => {
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
            className="text-4xl md:text-5xl font-black"
            colors={['#ff0ae2', '#9c40ff', '#3b82f6', '#ff0ae2']}
            animationSpeed={6}
          >
            Information
          </GradientText>
          <p className="text-gray-500 text-sm mt-4">
            Learn more about RobloxCheatz and how to use our services
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <InfoCard
            title="About Us"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            }
          >
            <p className="mb-3">
              RobloxCheatz is a comprehensive exploit status tracker that provides real-time updates on various Roblox executors and external tools.
            </p>
            <p>
              We aggregate data from multiple sources to bring you accurate information about UNC percentages, SUNC compatibility, version updates, and more.
            </p>
          </InfoCard>

          <InfoCard
            title="How It Works"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            }
          >
            <p className="mb-3">
              Our system automatically fetches data every 30 seconds to ensure you always have the latest information.
            </p>
            <p>
              Status indicators show whether an executor is updated (green) or currently down (red) based on real-time data.
            </p>
          </InfoCard>

          <InfoCard
            title="Status Legend"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                <span><strong className="text-white">Online/Updated</strong> - Executor is working</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></span>
                <span><strong className="text-white">Down</strong> - Currently not functional</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-500 font-bold">UNC</span>
                <span>Unified Naming Convention percentage</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-500 font-bold">SUNC</span>
                <span>Secure UNC percentage</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-500 font-bold">DEC</span>
                <span>Has decompiler support</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-500 font-bold">MI</span>
                <span>Multi-instance support</span>
              </div>
            </div>
          </InfoCard>

          <InfoCard
            title="Contact"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            }
          >
            <p className="mb-3">
              Have questions or suggestions? Feel free to reach out to us through our <a href="https://discord.com/invite/ilya" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:text-[#7289DA] transition-colors font-medium inline-flex items-center gap-1 translate-y-[2px]"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>Discord</a> server or social media channels.
            </p>
            <p className="text-gray-500 text-xs">
              Note: We are not affiliated with Roblox Corporation. This is an independent community project.
            </p>
          </InfoCard>

          <InfoCard
            title="Disclaimer"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            }
          >
            <p className="mb-3">
              The information provided on this website is for educational purposes only. We do not endorse or promote the use of exploits.
            </p>
            <p>
              Use of third-party software may violate Roblox's Terms of Service and could result in account termination.
            </p>
          </InfoCard>
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

export default InfoApp;
