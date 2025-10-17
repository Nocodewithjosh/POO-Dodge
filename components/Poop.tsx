
import React from 'react';
import { PoopObject, PoopType } from '../types';
import { PoopIcon } from './Icons';

interface PoopProps {
  poop: PoopObject;
}

const Poop: React.FC<PoopProps> = ({ poop }) => {
  const getColor = () => {
    switch (poop.type) {
      case PoopType.FAST:
        return '#5D4037'; // Darker brown
      case PoopType.BIG:
        return '#A1887F'; // Lighter brown
      case PoopType.MEGA:
        return '#4E342E'; // Darkest brown for mega poop
      case PoopType.NORMAL:
      default:
        return '#795548'; // Standard brown
    }
  };

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${poop.x}%`,
        top: `${poop.y}%`,
        width: `${poop.size}px`,
        height: `${poop.size}px`,
        transform: `rotate(${poop.rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <PoopIcon className="w-full h-full" color={getColor()} />
    </div>
  );
};

export default Poop;