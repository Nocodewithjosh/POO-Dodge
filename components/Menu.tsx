import React from 'react';
import { EnterFullScreenIcon, ExitFullScreenIcon } from './Icons';

interface MenuProps {
  onStart: () => void;
  highScore: number;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const Menu: React.FC<MenuProps> = ({ onStart, highScore, onToggleFullscreen, isFullscreen }) => {
  return (
    <div className="w-full h-full bg-sky-500/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-white text-center">
      <h1 className="text-7xl md:text-8xl font-bold text-yellow-300" style={{ fontFamily: "'Comic Sans MS', 'cursive', 'sans-serif'", textShadow: '4px 4px 0px #795548' }}>
        Poo Poo Dodge
      </h1>
      <div className="bg-white/20 p-6 rounded-2xl mt-8 text-left max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-yellow-200">Rules:</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>Use your <span className="font-bold text-yellow-300">MOUSE</span> to move left and right.</li>
          <li>Or use the <span className="font-bold text-yellow-300">A/D</span> or <span className="font-bold text-yellow-300">Arrow Keys</span>.</li>
          <li>Dodge the falling poop for as long as you can!</li>
          <li>You have 3 lives!</li>
        </ul>
      </div>
      <div className="mt-8 text-3xl font-bold">
        High Score: <span className="text-yellow-300" style={{ textShadow: '2px 2px 0px #795548' }}>{highScore}</span>
      </div>
      <button
        onClick={onStart}
        className="mt-8 bg-yellow-400 text-4xl text-white font-bold py-4 px-12 rounded-full shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        Start Game
      </button>
      
      <button 
        onClick={onToggleFullscreen} 
        className="absolute top-4 right-4 text-white bg-black/20 rounded-full p-3 hover:bg-black/40 transition-colors"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? <ExitFullScreenIcon className="w-6 h-6" /> : <EnterFullScreenIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default Menu;