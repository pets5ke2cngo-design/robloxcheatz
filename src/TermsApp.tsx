import React from 'react';
import Particles from './components/Particles';
import SpotlightCard from './components/SpotlightCard';
import TargetCursor from './components/TargetCursor';
import Dock from './components/Dock';
import GradientText from './components/GradientText';
import AnimatedLogo from './components/AnimatedLogo';
import { AnimationReadyProvider } from './components/AnimationReadyProvider';

const TermsApp: React.FC = () => {
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

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <GradientText 
            className="text-4xl md:text-5xl font-black leading-relaxed relative z-10"
            colors={['#ff0ae2', '#9c40ff', '#3b82f6', '#ff0ae2']}
            animationSpeed={6}
          >
            Terms of Service
          </GradientText>
          <p className="text-gray-500 text-sm mt-6">
            Last updated: December 2024
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(255, 10, 226, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-400">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(156, 64, 255, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c40ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              2. Description of Service
            </h2>
            <p className="text-gray-400">
              This website provides information about third-party software status tracking. We aggregate publicly available information from external APIs and display it in a user-friendly format. We do not host, distribute, or sell any software directly.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(59, 130, 246, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              3. Disclaimer
            </h2>
            <p className="text-gray-400">
              The information provided on this website is for general informational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information. Any reliance you place on such information is strictly at your own risk.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(255, 10, 226, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              4. Third-Party Links
            </h2>
            <p className="text-gray-400">
              This website may contain links to third-party websites including <a href="https://discord.com/invite/ilya" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:text-[#7289DA] transition-colors font-medium inline-flex items-center gap-1 translate-y-[2px]"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>Discord</a> servers, purchase pages, and external tools. We have no control over the content, privacy policies, or practices of any third-party sites and assume no responsibility for them. Use of third-party services is at your own discretion and risk.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(156, 64, 255, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c40ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              5. Limitation of Liability
            </h2>
            <p className="text-gray-400">
              In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use or inability to use the service.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(59, 130, 246, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              6. User Conduct
            </h2>
            <p className="text-gray-400 mb-3">You agree not to:</p>
            <ul className="text-gray-400 list-disc list-inside space-y-1">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the service</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Scrape, data mine, or use automated systems to access the service excessively</li>
              <li>Conduct DDoS attacks or any form of service disruption</li>
            </ul>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(255, 10, 226, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              7. Rate Limiting
            </h2>
            <p className="text-gray-400">
              To ensure fair usage and maintain service quality, we implement rate limiting on API requests. Excessive requests may result in temporary or permanent access restrictions. Please use the service responsibly.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(156, 64, 255, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c40ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              8. Modifications
            </h2>
            <p className="text-gray-400">
              We reserve the right to modify or discontinue the service at any time without prior notice. We also reserve the right to modify these terms at any time. Continued use of the service after any changes constitutes acceptance of the new terms.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(59, 130, 246, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
              </svg>
              9. Governing Law
            </h2>
            <p className="text-gray-400">
              These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these terms shall be resolved in accordance with applicable jurisdiction.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(255, 10, 226, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              10. Contact
            </h2>
            <p className="text-gray-400">
              For questions about these Terms of Service, please contact us through our official <a href="https://discord.com/invite/ilya" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:text-[#7289DA] transition-colors font-medium inline-flex items-center gap-1 translate-y-[2px]"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>Discord</a> channels or via the contact information provided on our main website.
            </p>
          </SpotlightCard>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/privacy" 
            className="cursor-target text-pink-400 hover:text-pink-300 transition-colors underline underline-offset-4"
          >
            View Privacy Policy →
          </a>
        </div>
      </main>

      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 RobloxCheatz. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="/privacy" className="cursor-target hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="cursor-target hover:text-pink-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
    </AnimationReadyProvider>
  );
};

export default TermsApp;
