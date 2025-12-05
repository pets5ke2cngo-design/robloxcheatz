import React from 'react';
import Particles from './components/Particles';
import SpotlightCard from './components/SpotlightCard';
import TargetCursor from './components/TargetCursor';
import Dock from './components/Dock';
import GradientText from './components/GradientText';
import AnimatedLogo from './components/AnimatedLogo';
import { AnimationReadyProvider } from './components/AnimationReadyProvider';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcherNew';

const PrivacyContent: React.FC = () => {
  const { theme, themeId } = useTheme();
  
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
    <div className="min-h-screen text-white font-sans antialiased overflow-x-hidden" style={{ backgroundColor: theme.colors.background }}>
      <TargetCursor 
        targetSelector=".cursor-target"
        spinDuration={2}
        hideDefaultCursor={true}
        hoverDuration={0.2}
        parallaxOn={false}
      />

      <div className="fixed inset-0 z-0 pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
        <Particles
          key={`particles-${themeId}`}
          particleCount={100}
          particleSpread={10}
          speed={0.05}
          particleBaseSize={80}
          particleColors={[theme.colors.primary]}
          moveParticlesOnHover={true}
          particleHoverFactor={1}
          alphaParticles={false}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      <div className="fixed top-[-200px] right-[-200px] w-[800px] h-[800px] bg-gradient-radial to-transparent opacity-30 rounded-full pointer-events-none z-[-1]" style={{ willChange: 'transform', background: `radial-gradient(circle, ${theme.colors.primary}60 0%, transparent 70%)` }} />
      <div className="fixed bottom-[-200px] left-[-200px] w-[700px] h-[700px] bg-gradient-radial to-transparent opacity-25 rounded-full pointer-events-none z-[-1]" style={{ willChange: 'transform', background: `radial-gradient(circle, ${theme.colors.accent}60 0%, transparent 70%)` }} />

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
            colors={theme.gradientColors}
            animationSpeed={6}
          >
            Privacy Policy
          </GradientText>
          <p className="text-gray-500 text-sm mt-6">
            Last updated: December 2024
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(255, 10, 226, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              1. Information We Collect
            </h2>
            <p className="text-gray-400 mb-3">We collect minimal information necessary to provide our service:</p>
            <ul className="text-gray-400 list-disc list-inside space-y-1">
              <li>Basic analytics data (page views, general location by country)</li>
              <li>Technical information (browser type, device type)</li>
              <li>IP addresses for security and rate limiting purposes</li>
            </ul>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(156, 64, 255, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c40ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              2. How We Use Information
            </h2>
            <p className="text-gray-400 mb-3">The information we collect is used to:</p>
            <ul className="text-gray-400 list-disc list-inside space-y-1">
              <li>Provide and maintain our service</li>
              <li>Improve user experience</li>
              <li>Protect against abuse and unauthorized access</li>
              <li>Monitor and analyze usage patterns</li>
            </ul>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(59, 130, 246, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
              3. Data Storage
            </h2>
            <p className="text-gray-400">
              We do not store personal user data. Any technical data collected is temporary and used solely for service operation and security purposes. We prioritize your privacy and minimize data retention.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(255, 10, 226, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              4. Cookies
            </h2>
            <p className="text-gray-400">
              We may use essential cookies to ensure proper functioning of the website. These cookies do not track personal information and are necessary for the service to operate correctly. No third-party tracking cookies are used.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(156, 64, 255, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c40ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              5. Third-Party Services
            </h2>
            <p className="text-gray-400 mb-3">Our website may use third-party services such as:</p>
            <ul className="text-gray-400 list-disc list-inside space-y-1">
              <li>Content delivery networks (CDNs)</li>
              <li>Analytics services</li>
              <li>External APIs for data retrieval</li>
            </ul>
            <p className="text-gray-400 mt-3">These services have their own privacy policies, and we encourage you to review them.</p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(59, 130, 246, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              6. Data Security
            </h2>
            <p className="text-gray-400 mb-3">We implement appropriate security measures to protect against unauthorized access:</p>
            <ul className="text-gray-400 list-disc list-inside space-y-1">
              <li>Rate limiting to prevent abuse</li>
              <li>HTTPS encryption for all connections</li>
              <li>Regular security updates and monitoring</li>
              <li>Secure server infrastructure</li>
            </ul>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(255, 10, 226, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              7. Children's Privacy
            </h2>
            <p className="text-gray-400">
              Our service is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(156, 64, 255, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c40ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              8. Changes to This Policy
            </h2>
            <p className="text-gray-400">
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically for any changes.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-6 rounded-2xl bg-white/[0.03] border border-white/10" spotlightColor="rgba(59, 130, 246, 0.15)">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              9. Contact Us
            </h2>
            <p className="text-gray-400">
              If you have any questions about this Privacy Policy, please contact us through our official <a href="https://discord.com/invite/ilya" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] hover:text-[#7289DA] transition-colors font-medium inline-flex items-center gap-1 translate-y-[2px]"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>Discord</a> channels or via the contact information provided on our main website.
            </p>
          </SpotlightCard>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/terms" 
            className="cursor-target underline underline-offset-4 transition-colors"
            style={{ color: theme.colors.primary }}
          >
            View Terms of Service →
          </a>
        </div>
      </main>

      {/* Theme Switcher Section */}
      <div className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <ThemeSwitcher />
        </div>
      </div>

      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 RobloxCheatz. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="/privacy" className="cursor-target transition-colors" style={{ color: 'inherit' }} onMouseOver={(e) => e.currentTarget.style.color = theme.colors.primary} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>Privacy Policy</a>
            <a href="/terms" className="cursor-target transition-colors" style={{ color: 'inherit' }} onMouseOver={(e) => e.currentTarget.style.color = theme.colors.primary} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
    </AnimationReadyProvider>
  );
};

const PrivacyApp: React.FC = () => (
  <ThemeProvider>
    <PrivacyContent />
  </ThemeProvider>
);

export default PrivacyApp;
