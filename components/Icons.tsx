import React from 'react';

export const PoopIcon: React.FC<{ className?: string; color?: string }> = ({ className, color = '#795548' }) => (
  <svg
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))' }}
  >
    <path
      d="M103.8,93.4c-3-25.1-13.8-32.2-22.3-33.1c-1.3-15.6,5.3-28.8-1.5-35.3c-6.6-6.3-19.3-1-29.3,2.8 C40.2,33.9,31.8,43.2,32,57.1c-13.3-0.5-23.3,13.1-22.2,26.5c1.1,13.1,13,22.8,26.5,22.2c1.8-0.1,3.5-0.3,5.2-0.7 c12.3,10.1,30.3,10.5,43-0.2c2.1,0.5,4.3,0.8,6.5,0.7C102.5,104.5,106.7,99.3,103.8,93.4z"
      fill={color}
    />
    <circle cx="48" cy="74" r="8" fill="#FFFFFF" />
    <circle cx="80" cy="74" r="8" fill="#FFFFFF" />
    <circle cx="49" cy="74" r="4" fill="#000000" />
    <circle cx="81" cy="74" r="4" fill="#000000" />
  </svg>
);

export const PlayerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
  >
    <g>
      <circle cx="50" cy="50" r="45" fill="#FFD166" />
      <circle cx="35" cy="45" r="7" fill="white" />
      <circle cx="65" cy="45" r="7" fill="white" />
      <circle cx="35" cy="45" r="4" fill="black" />
      <circle cx="65" cy="45" r="4" fill="black" />
      <path d="M 35 70 Q 50 85 65 70" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="#ff4757"
    style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const SplatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="#6D4C41"
    >
        <path d="M50,10 C80,10 90,40 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 20,10 50,10 Z" transform="rotate(15, 50, 50)"/>
        <circle cx="20" cy="25" r="10" />
        <circle cx="80" cy="70" r="12" />
        <circle cx="55" cy="20" r="8" />
        <circle cx="30" cy="80" r="9" />
    </svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="#FFD700"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const ScoreDoublerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="20" cy="20" r="18" fill="#34D399" stroke="white" strokeWidth="2" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            2x
        </text>
    </svg>
);

export const UmbrellaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
    >
        <path d="M10 50 A40 40 0 0 1 90 50 Z" fill="#3498db" />
        <path d="M50 50 V 90" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round" />
        <path d="M50 50 L 15 50" stroke="white" strokeWidth="2" />
        <path d="M50 50 L 30 25" stroke="white" strokeWidth="2" />
        <path d="M50 50 L 70 25" stroke="white" strokeWidth="2" />
        <path d="M50 50 L 85 50" stroke="white" strokeWidth="2" />
        <path d="M40 90 A5 5 0 0 1 50 90" fill="none" stroke="#2c3e50" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

export const EnemyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 100 80"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
    >
        <path d="M85 40 A15 15 0 0 1 70 55 A25 25 0 0 1 20 55 A15 15 0 0 1 20 25 A25 25 0 0 1 70 25 A15 15 0 0 1 85 40 Z" fill="#FFFFFF"/>
        <path d="M35 45 L45 35 M45 45 L35 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <path d="M55 45 L65 35 M65 45 L55 35" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 55 Q50 50 60 55" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
);


export const EnterFullScreenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

export const ExitFullScreenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);