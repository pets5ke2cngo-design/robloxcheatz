import React, { useEffect } from 'react';

// Inject global styles once
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected || typeof document === 'undefined') return;
  
  const styleEl = document.createElement('style');
  styleEl.id = 'shiny-text-styles';
  styleEl.textContent = `
    @keyframes shinyTextShine {
      0% {
        background-position: 100%;
      }
      100% {
        background-position: -100%;
      }
    }
  `;
  document.head.appendChild(styleEl);
  stylesInjected = true;
};

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shineColor?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '', shineColor = '#ffffff' }) => {
  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        color: '#ffffff',
        background: `linear-gradient(
          120deg,
          #ffffff 0%,
          #ffffff 40%,
          ${shineColor} 50%,
          #ffffff 60%,
          #ffffff 100%
        )`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: disabled ? 'none' : `shinyTextShine ${speed}s linear infinite`
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
