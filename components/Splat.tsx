import React from 'react';
import { SplatObject } from '../types';
import { SplatIcon } from './Icons';

interface SplatProps {
  splat: SplatObject;
}

const Splat: React.FC<SplatProps> = ({ splat }) => {
  return (
    <div
      className="absolute bottom-1 z-0 animate-fadeout"
      style={{
        left: `${splat.x}%`,
        width: `${splat.size}px`,
        height: `${splat.size}px`,
        transform: `translateX(-50%) rotate(${splat.rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <SplatIcon className="w-full h-full" />
    </div>
  );
};

export default Splat;
