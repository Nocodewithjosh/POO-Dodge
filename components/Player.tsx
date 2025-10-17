import React from 'react';
import { PlayerIcon, UmbrellaIcon } from './Icons';

export const PLAYER_WIDTH = 60;

interface PlayerProps {
  x: number;
  isInvincible: boolean;
  isShielded: boolean;
  isUmbrellaActive: boolean;
}

const Player: React.FC<PlayerProps> = ({ x, isInvincible, isShielded, isUmbrellaActive }) => {
  return (
    <div
      className="absolute bottom-5 z-20"
      style={{
        left: `calc(${x}% - ${PLAYER_WIDTH / 2}px)`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_WIDTH}px`,
        filter: isShielded ? 'drop-shadow(0 0 8px #06b6d4)' : 'none',
        transition: 'filter 0.3s ease-in-out',
      }}
    >
      {isUmbrellaActive && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20">
            <UmbrellaIcon className="w-full h-full" />
        </div>
      )}
      <PlayerIcon className={`w-full h-full ${isInvincible ? 'animate-pulse' : ''}`} />
    </div>
  );
};

export default Player;