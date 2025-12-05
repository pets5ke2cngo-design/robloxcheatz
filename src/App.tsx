import React, { useState, useEffect } from 'react';
import Particles from './components/Particles';
import SpotlightCard from './components/SpotlightCard';
import ElectricBorder from './components/ElectricBorder';
import TargetCursor from './components/TargetCursor';
import Dock from './components/Dock';
import GradientText from './components/GradientText';
import AnimatedLogo from './components/AnimatedLogo';
import { AnimationReadyProvider } from './components/AnimationReadyProvider';
import GlareHover from './components/GlareHover';
import UNCModal from './components/UNCModal';
import { ThemeProvider, useTheme, themes } from './components/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcherNew';

interface Product {
  id: string;
  name: string;
  apiName: string;
  buyLink: string;
  viewLink: string;
  discordLink: string;
}

interface ProductsData {
  mainProducts: Product[];
  otherProducts: Product[];
  externalProducts: Product[];
  androidProducts: Product[];
}

interface ExploitData {
  title: string;
  version?: string;
  uncPercentage?: number;
  suncPercentage?: number;
  updateStatus?: boolean;
  decompiler?: boolean;
  multiInject?: boolean;
}

const CONFIG = {
  API_BASE: '/api',
  UPDATE_INTERVAL: 30000,
};

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const formatValue = (value: any, suffix = '') => {
  if (value === null || value === undefined || value === 'N/A') {
    return <XIcon />;
  }
  return `${value}${suffix}`;
};

type ColorScheme = 'wave' | 'seliware' | 'matcha';

const colorSchemes = {
  wave: {
    borderColor: '#3b82f6',
    iconColor: '#3b82f6',
    accentBg: 'bg-blue-500/15',
    accentBorder: 'border-blue-500/30',
    accentText: 'text-blue-500',
    buttonGradient: 'from-blue-500 to-white',
    buttonShadow: 'rgba(59, 130, 246, 0.4)',
    isExternal: false,
    backgroundImage: '/wave.png',
    bgIconSize: '40px',
  },
  seliware: {
    borderColor: '#ec4899',
    iconColor: '#f472b6',
    accentBg: 'bg-pink-500/15',
    accentBorder: 'border-pink-500/30',
    accentText: 'text-pink-400',
    buttonGradient: 'from-pink-500 to-cyan-400',
    buttonShadow: 'rgba(236, 72, 153, 0.4)',
    isExternal: false,
    backgroundImage: '/seliware.png',
    bgIconSize: '40px',
  },
  matcha: {
    borderColor: '#84cc16',
    iconColor: '#84cc16',
    accentBg: 'bg-lime-500/15',
    accentBorder: 'border-lime-500/30',
    accentText: 'text-lime-500',
    buttonGradient: 'from-green-500 to-lime-400',
    buttonShadow: 'rgba(132, 204, 22, 0.4)',
    isExternal: true,
    backgroundImage: '/matcha.png',
    bgIconSize: '40px',
  },
};

interface MainCardProps {
  product: Product;
  exploitData: ExploitData | null;
  colorScheme?: ColorScheme;
  onUNCClick?: (exploitName: string, testType: 'sunc' | 'unc', percentage: number | null) => void;
}

const MainCard: React.FC<MainCardProps> = ({ product, exploitData, colorScheme = 'wave', onUNCClick }) => {
  const status = exploitData?.updateStatus ? 'online' : 'offline';
  const statusText = status === 'online' ? 'Updated' : 'Down';
  const version = exploitData?.version || null;
  const uncPercentage = exploitData?.uncPercentage ?? null;
  const suncPercentage = exploitData?.suncPercentage ?? null;
  const hasDecompiler = exploitData?.decompiler ?? false;
  const hasMultiInject = exploitData?.multiInject ?? false;
  
  const scheme = colorSchemes[colorScheme];

  return (
    <ElectricBorder
      color={scheme.borderColor}
      speed={1}
      chaos={1}
      thickness={2}
      className="h-[340px] rounded-2xl cursor-target"
      style={{ background: 'rgba(17, 17, 22, 0.9)', borderRadius: '16px' }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        {/* Background pattern with tilted grid of small icons */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `url(${scheme.backgroundImage})`,
            backgroundSize: scheme.bgIconSize,
            backgroundPosition: 'center',
            backgroundRepeat: 'space',
            opacity: 0.06,
            filter: 'grayscale(100%)',
            pointerEvents: 'none',
            transform: 'rotate(-15deg) scale(1.5)',
            transformOrigin: 'center center',
          }}
        />
        <div className="p-6 pb-5 h-full flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{product.name}</h3>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
              status === 'online'
                ? 'bg-green-500/15 text-green-500 border border-green-500/30'
                : 'bg-red-500/15 text-red-500 border border-red-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                status === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
              }`}
            />
            <span>{statusText}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-gray-400">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
              </svg>
              Version
            </span>
            <span className="font-semibold text-white">{formatValue(version)}</span>
          </div>
          <div 
            className={`flex justify-between items-center -mx-2 px-2 py-1 rounded-lg transition-colors ${uncPercentage !== null ? 'cursor-target hover:bg-white/5' : ''}`}
            onClick={() => uncPercentage !== null && onUNCClick && onUNCClick(product.apiName, 'unc', uncPercentage)}
          >
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              UNC
              {uncPercentage !== null && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 opacity-50">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              )}
            </span>
            <span className="font-semibold text-white">{formatValue(uncPercentage, '%')}</span>
          </div>
          <div 
            className={`flex justify-between items-center -mx-2 px-2 py-1 rounded-lg transition-colors ${suncPercentage !== null ? 'cursor-target hover:bg-white/5' : ''}`}
            onClick={() => suncPercentage !== null && onUNCClick && onUNCClick(product.apiName, 'sunc', suncPercentage)}
          >
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M9 12l2 2 4-4"/><path d="M12 2a10 10 0 1 0 10 10"/>
              </svg>
              SUNC
              {suncPercentage !== null && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={scheme.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 opacity-50">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              )}
            </span>
            <span className="font-semibold text-white">{formatValue(suncPercentage, '%')}</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5 mt-4 mb-4 min-h-[28px]">
            {!scheme.isExternal ? (
              <>
                <span
                  className={`px-2 py-1 rounded-md text-[0.7rem] font-medium ${
                    hasDecompiler
                      ? `${scheme.accentBg} ${scheme.accentBorder} ${scheme.accentText}`
                      : 'bg-white/5 border border-white/10 text-gray-500'
                  }`}
                >
                  Decompiler
                </span>
                <span
                  className={`px-2 py-1 rounded-md text-[0.7rem] font-medium ${
                    hasMultiInject
                      ? `${scheme.accentBg} ${scheme.accentBorder} ${scheme.accentText}`
                      : 'bg-white/5 border border-white/10 text-gray-500'
                  }`}
                >
                  Multi-Instance
                </span>
              </>
            ) : (
              <span className={`px-2 py-1 rounded-md text-[0.7rem] font-medium ${scheme.accentBg} ${scheme.accentBorder} ${scheme.accentText}`}>
                External
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              <a
                href={product.buyLink || '#'}
                className={`cursor-target flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br ${scheme.buttonGradient} hover:scale-[1.02] transition-all`}
                style={{ boxShadow: `0 4px 20px ${scheme.buttonShadow}` }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Buy
              </a>
              <a
                href={product.discordLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target"
              >
                <GlareHover
                  width="44px"
                  height="44px"
                  background="rgba(88, 101, 242, 0.15)"
                  borderRadius="12px"
                  borderColor="rgba(88, 101, 242, 0.3)"
                  glareColor="#5865F2"
                  glareOpacity={0.4}
                  glareSize={200}
                  transitionDuration={500}
                  className="hover:scale-[1.05] transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5865F2" className="w-5 h-5">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </GlareHover>
              </a>
            </div>
            <a
              href={product.viewLink || '#'}
              className="cursor-target flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              View
            </a>
          </div>
        </div>
      </div>
      </div>
    </ElectricBorder>
  );
};

interface OtherCardProps {
  product: Product;
  exploitData: ExploitData | null;
  onUNCClick?: (exploitName: string, testType: 'sunc' | 'unc', percentage: number | null) => void;
}

const OtherCard: React.FC<OtherCardProps> = ({ product, exploitData, onUNCClick }) => {
  const status = exploitData?.updateStatus ? 'online' : 'offline';
  const statusText = status === 'online' ? 'Online' : 'Down';
  const version = exploitData?.version || null;
  const uncPercentage = exploitData?.uncPercentage ?? null;
  const suncPercentage = exploitData?.suncPercentage ?? null;
  const hasDecompiler = exploitData?.decompiler ?? false;
  const hasMultiInject = exploitData?.multiInject ?? false;

  return (
    <SpotlightCard
      className="cursor-target h-[280px] w-full max-w-[280px] hover:border-pink-500/30 hover:-translate-y-1 transition-all duration-300"
      spotlightColor="rgba(255, 10, 226, 0.15)"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-bold text-white">{product.name}</h3>
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold uppercase flex-shrink-0 ${
              status === 'online'
                ? 'bg-green-500/15 text-green-500 border border-green-500/30'
                : 'bg-red-500/15 text-red-500 border border-red-500/30'
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full animate-pulse ${
                status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{statusText}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-gray-400">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
              </svg>
              Version
            </span>
            <span className="font-semibold text-white">{formatValue(version)}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff0ae2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              UNC/SUNC
            </span>
            <div className="flex items-center gap-1">
              {uncPercentage !== null ? (
                <button
                  onClick={() => onUNCClick && onUNCClick(product.apiName, 'unc', uncPercentage)}
                  className="cursor-target font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  {uncPercentage}%
                </button>
              ) : (
                <span className="text-gray-500">-</span>
              )}
              <span className="text-gray-500">/</span>
              {suncPercentage !== null ? (
                <button
                  onClick={() => onUNCClick && onUNCClick(product.apiName, 'sunc', suncPercentage)}
                  className="cursor-target font-semibold text-white hover:text-pink-400 transition-colors"
                >
                  {suncPercentage}%
                </button>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-wrap gap-1 mb-3">
          <span
            className={`px-1.5 py-0.5 rounded text-[0.6rem] font-medium ${
              hasDecompiler
                ? 'bg-pink-500/15 border border-pink-500/30 text-pink-500'
                : 'bg-white/5 border border-white/10 text-gray-500'
            }`}
          >
            DEC
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[0.6rem] font-medium ${
              hasMultiInject
                ? 'bg-pink-500/15 border border-pink-500/30 text-pink-500'
                : 'bg-white/5 border border-white/10 text-gray-500'
            }`}
          >
            MI
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <a
              href={product.buyLink || '#'}
              className="cursor-target flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-br from-pink-500 to-blue-500 hover:scale-[1.02] transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy
            </a>
            <a
              href={product.discordLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
            >
              <GlareHover
                width="36px"
                height="36px"
                background="rgba(88, 101, 242, 0.15)"
                borderRadius="8px"
                borderColor="rgba(88, 101, 242, 0.3)"
                glareColor="#5865F2"
                glareOpacity={0.4}
                glareSize={200}
                transitionDuration={500}
                className="hover:scale-[1.05] transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5865F2" className="w-4 h-4">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </GlareHover>
            </a>
          </div>
          <a
            href={product.viewLink || '#'}
            className="cursor-target w-full text-center px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        </div>
      </div>
    </SpotlightCard>
  );
};

interface ExternalCardProps {
  product: Product;
  exploitData: ExploitData | null;
}

const ExternalCard: React.FC<ExternalCardProps> = ({ product, exploitData }) => {
  const status = exploitData?.updateStatus ? 'online' : 'offline';
  const statusText = status === 'online' ? 'Online' : 'Down';
  const version = exploitData?.version || null;

  return (
    <SpotlightCard
      className="cursor-target h-[280px] w-full max-w-[280px] hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300"
      spotlightColor="rgba(59, 130, 246, 0.15)"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-bold text-white">{product.name}</h3>
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold uppercase flex-shrink-0 ${
              status === 'online'
                ? 'bg-green-500/15 text-green-500 border border-green-500/30'
                : 'bg-red-500/15 text-red-500 border border-red-500/30'
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full animate-pulse ${
                status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{statusText}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-gray-400">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
              </svg>
              Version
            </span>
            <span className="font-semibold text-white">{formatValue(version)}</span>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-wrap gap-1 mb-3">
          <span className="px-1.5 py-0.5 rounded text-[0.6rem] font-medium bg-blue-500/15 border border-blue-500/30 text-blue-500">
            External
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <a
              href={product.buyLink || '#'}
              className="cursor-target flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-br from-blue-500 to-cyan-500 hover:scale-[1.02] transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy
            </a>
            <a
              href={product.discordLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
            >
              <GlareHover
                width="36px"
                height="36px"
                background="rgba(88, 101, 242, 0.15)"
                borderRadius="8px"
                borderColor="rgba(88, 101, 242, 0.3)"
                glareColor="#5865F2"
                glareOpacity={0.4}
                glareSize={200}
                transitionDuration={500}
                className="hover:scale-[1.05] transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5865F2" className="w-4 h-4">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </GlareHover>
            </a>
          </div>
          <a
            href={product.viewLink || '#'}
            className="cursor-target w-full text-center px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        </div>
      </div>
    </SpotlightCard>
  );
};

interface AndroidCardProps {
  product: Product;
  exploitData: ExploitData | null;
  onUNCClick?: (exploitName: string, testType: 'sunc' | 'unc', percentage: number | null) => void;
}

const AndroidCard: React.FC<AndroidCardProps> = ({ product, exploitData, onUNCClick }) => {
  const status = exploitData?.updateStatus ? 'online' : 'offline';
  const statusText = status === 'online' ? 'Online' : 'Down';
  const version = exploitData?.version || null;
  const uncPercentage = exploitData?.uncPercentage ?? null;
  const suncPercentage = exploitData?.suncPercentage ?? null;
  const hasDecompiler = exploitData?.decompiler ?? false;
  const hasMultiInject = exploitData?.multiInject ?? false;

  return (
    <SpotlightCard
      className="cursor-target h-[280px] w-full max-w-[280px] hover:border-green-500/30 hover:-translate-y-1 transition-all duration-300"
      spotlightColor="rgba(34, 197, 94, 0.15)"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-bold text-white">{product.name}</h3>
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold uppercase flex-shrink-0 ${
              status === 'online'
                ? 'bg-green-500/15 text-green-500 border border-green-500/30'
                : 'bg-red-500/15 text-red-500 border border-red-500/30'
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full animate-pulse ${
                status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{statusText}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-gray-400">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
              </svg>
              Version
            </span>
            <span className="font-semibold text-white">{formatValue(version)}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              UNC/SUNC
            </span>
            <div className="flex items-center gap-1">
              {uncPercentage !== null ? (
                <button
                  onClick={() => onUNCClick && onUNCClick(product.apiName, 'unc', uncPercentage)}
                  className="cursor-target font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  {uncPercentage}%
                </button>
              ) : (
                <span className="text-gray-500">-</span>
              )}
              <span className="text-gray-500">/</span>
              {suncPercentage !== null ? (
                <button
                  onClick={() => onUNCClick && onUNCClick(product.apiName, 'sunc', suncPercentage)}
                  className="cursor-target font-semibold text-white hover:text-pink-400 transition-colors"
                >
                  {suncPercentage}%
                </button>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-wrap gap-1 mb-3">
          <span
            className={`px-1.5 py-0.5 rounded text-[0.6rem] font-medium ${
              hasDecompiler
                ? 'bg-green-500/15 border border-green-500/30 text-green-500'
                : 'bg-white/5 border border-white/10 text-gray-500'
            }`}
          >
            DEC
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[0.6rem] font-medium ${
              hasMultiInject
                ? 'bg-green-500/15 border border-green-500/30 text-green-500'
                : 'bg-white/5 border border-white/10 text-gray-500'
            }`}
          >
            MI
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <a
              href={product.buyLink || '#'}
              className="cursor-target flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-br from-green-500 to-teal-500 hover:scale-[1.02] transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy
            </a>
            <a
              href={product.discordLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
            >
              <GlareHover
                width="36px"
                height="36px"
                background="rgba(88, 101, 242, 0.15)"
                borderRadius="8px"
                borderColor="rgba(88, 101, 242, 0.3)"
                glareColor="#5865F2"
                glareOpacity={0.4}
                glareSize={200}
                transitionDuration={500}
                className="hover:scale-[1.05] transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5865F2" className="w-4 h-4">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </GlareHover>
            </a>
          </div>
          <a
            href={product.viewLink || '#'}
            className="cursor-target w-full text-center px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        </div>
      </div>
    </SpotlightCard>
  );
};

const SkeletonCard: React.FC<{ isMain?: boolean }> = ({ isMain = false }) => (
  <div className={`${isMain ? 'min-h-[280px]' : 'min-h-[200px]'} rounded-2xl border border-neutral-800 bg-neutral-900 p-6`}>
    <div className="flex justify-between items-start mb-4">
      <div className="h-5 w-3/5 bg-white/5 rounded animate-pulse" />
      <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-5 w-16 bg-white/5 rounded animate-pulse" />
      <div className="h-5 w-16 bg-white/5 rounded animate-pulse" />
    </div>
  </div>
);

// Inner App component that uses theme
const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [exploitCache, setExploitCache] = useState<Record<string, ExploitData>>({});
  const [loading, setLoading] = useState(true);
  
  // UNC Modal state
  const [uncModalOpen, setUncModalOpen] = useState(false);
  const [uncModalData, setUncModalData] = useState<{
    exploitName: string;
    testType: 'sunc' | 'unc';
    percentage: number | null;
  } | null>(null);

  const handleUNCClick = (exploitName: string, testType: 'sunc' | 'unc', percentage: number | null) => {
    setUncModalData({ exploitName, testType, percentage });
    setUncModalOpen(true);
  };

  const handleCloseModal = () => {
    setUncModalOpen(false);
    setUncModalData(null);
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/data/products.json');
      const data = await response.json();
      setProductsData(data);
      return data;
    } catch (error) {
      return null;
    }
  };

  const fetchAllExploits = async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE}/exploits`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const cache: Record<string, ExploitData> = {};
        data.forEach((exploit: ExploitData) => {
          cache[exploit.title.toLowerCase()] = exploit;
        });
        setExploitCache(cache);
      }
      return data;
    } catch (error) {
      return null;
    }
  };

  const getExploitFromCache = (apiName: string): ExploitData | null => {
    const name = apiName.toLowerCase();
    for (const key in exploitCache) {
      if (key.toLowerCase().includes(name) || name.includes(key.toLowerCase())) {
        return exploitCache[key];
      }
    }
    return null;
  };

  useEffect(() => {
    const init = async () => {
      await loadProducts();
      await fetchAllExploits();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllExploits();
    }, CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const dockItems = [
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      label: 'Home', 
      onClick: () => window.location.href = '#'
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
    <div 
      className="min-h-screen text-white font-sans antialiased overflow-x-hidden transition-colors duration-700"
      style={{ backgroundColor: theme.colors.background }}
    >
      <TargetCursor 
        targetSelector=".cursor-target"
        spinDuration={2}
        hideDefaultCursor={true}
        hoverDuration={0.2}
        parallaxOn={false}
      />

      <div className="fixed inset-0 z-0 pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
        <Particles
          key={`particles-${theme.id}`}
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

      <div 
        className="fixed top-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full pointer-events-none z-[-1] transition-all duration-700" 
        style={{ 
          background: `radial-gradient(circle, ${theme.colors.primary}40, transparent)`,
          willChange: 'transform' 
        }} 
      />
      <div 
        className="fixed bottom-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full pointer-events-none z-[-1] transition-all duration-700" 
        style={{ 
          background: `radial-gradient(circle, ${theme.colors.accent}35, transparent)`,
          willChange: 'transform' 
        }} 
      />

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

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <GradientText 
            className="text-4xl md:text-5xl font-black"
            colors={theme.gradientColors}
            animationSpeed={6}
          >
            Product Statuses
          </GradientText>
        </div>

        <section className="mb-12">
          <p className="text-center text-gray-500 text-sm mb-6">
            Real-time status updates every 30 seconds
          </p>

          <h3 className="text-center text-lg font-semibold mb-6 mt-8">Main Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => <SkeletonCard key={i} isMain />)
              : productsData?.mainProducts.map((product) => {
                  const exploitData = getExploitFromCache(product.apiName);
                  const isDown = !exploitData?.updateStatus;
                  return (
                    <div key={product.id} className="flex flex-col">
                      <MainCard
                        product={product}
                        exploitData={exploitData}
                        colorScheme={product.id as ColorScheme}
                        onUNCClick={handleUNCClick}
                      />
                      {isDown && product.id === 'wave' && (
                        <a
                          href="/downgrade"
                          className="cursor-target mt-5 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 hover:scale-[1.02] transition-all animate-pulse"
                          style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Downgrade!
                        </a>
                      )}
                      {isDown && product.id === 'seliware' && (
                        <a
                          href="/downgrade"
                          className="cursor-target mt-5 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 hover:scale-[1.02] transition-all animate-pulse"
                          style={{ boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Downgrade!
                        </a>
                      )}
                    </div>
                  );
                })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-center text-2xl font-bold mb-8">Other Products</h2>
          
          <div className="mb-8">
            <h4 className="text-center text-base font-semibold mb-4 text-gray-400">Internal Executors</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {loading
                ? Array(2)
                    .fill(0)
                    .map((_, i) => <SkeletonCard key={i} />)
                : productsData?.otherProducts.map((product) => (
                    <OtherCard
                      key={product.id}
                      product={product}
                      exploitData={getExploitFromCache(product.apiName)}
                      onUNCClick={handleUNCClick}
                    />
                  ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-center text-base font-semibold mb-4 text-gray-400">External Executors</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {loading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => <SkeletonCard key={i} />)
                : productsData?.externalProducts.map((product) => (
                    <ExternalCard
                      key={product.id}
                      product={product}
                      exploitData={getExploitFromCache(product.apiName)}
                    />
                  ))}
            </div>
          </div>

          <div>
            <h4 className="text-center text-base font-semibold mb-4 text-gray-400">Android Executors</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {loading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => <SkeletonCard key={i} />)
                : productsData?.androidProducts.map((product) => (
                    <AndroidCard
                      key={product.id}
                      product={product}
                      exploitData={getExploitFromCache(product.apiName)}
                      onUNCClick={handleUNCClick}
                    />
                  ))}
            </div>
          </div>
        </section>
      </main>

      {/* Theme Switcher - Above Footer */}
      <div className="flex justify-center pb-8 relative z-10">
        <ThemeSwitcher />
      </div>

      <footer className="border-t border-white/10 py-8 px-6 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-6">
            <a 
              href="/terms.html" 
              className="cursor-target text-gray-500 text-sm transition-colors"
              style={{ '--hover-color': theme.colors.primary } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              Terms of Service
            </a>
            <a 
              href="/privacy.html" 
              className="cursor-target text-gray-500 text-sm transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            2024 RobloxCheatz. All rights reserved. Not affiliated with Roblox Corporation.
          </p>
        </div>
      </footer>

      {/* UNC Modal */}
      <UNCModal
        isOpen={uncModalOpen}
        onClose={handleCloseModal}
        exploitName={uncModalData?.exploitName || ''}
        testType={uncModalData?.testType || 'sunc'}
        percentage={uncModalData?.percentage ?? null}
      />
    </div>
    </AnimationReadyProvider>
  );
};

// Main App wrapper with ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
