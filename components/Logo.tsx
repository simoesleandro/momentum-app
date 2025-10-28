import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="logoTitle"
      role="img"
    >
      <title id="logoTitle">Logótipo Momentum</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM42.228 32.2281L26 68H36.336L44.88 47.168L50 58L55.12 47.168L63.664 68H74L57.772 32.2281C55.4755 26.9458 52.738 25 50 25C47.262 25 44.5245 26.9458 42.228 32.2281Z"
      />
    </svg>
  );
};

export default Logo;
