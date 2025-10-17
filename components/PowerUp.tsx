import React from 'react';
import { PowerUpObject, PowerUpType } from '../types';
import { ScoreDoublerIcon, StarIcon, UmbrellaIcon } from './Icons';

interface PowerUpProps {
  powerUp: PowerUpObject;
}

const PowerUp: React.FC<PowerUpProps> = ({ powerUp }) => {
  const renderIcon = () => {
    switch (powerUp.type) {
      case PowerUpType.SHIELD:
        return <StarIcon className="w-full h-full" />;
      case PowerUpType.SCORE_DOUBLER:
        return <ScoreDoublerIcon className="w-full h-full" />;
      case PowerUpType.UMBRELLA:
        return <UmbrellaIcon className="w-full h-full" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="absolute z-10 animate-pulse"
      style={{
        left: `${powerUp.x}%`,
        top: `${powerUp.y}%`,
        width: '40px',
        height: '40px',
        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
      }}
    >
      {renderIcon()}
    </div>
  );
};

export default PowerUp;