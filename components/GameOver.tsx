import React from 'react';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score > 0 && score === highScore;

  return (
    <div className="w-full h-full bg-sky-500/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-white text-center">
      <h1 className="text-8xl font-bold text-red-500" style={{ fontFamily: "'Comic Sans MS', 'cursive', 'sans-serif'", textShadow: '4px 4px 0px #795548' }}>
        Game Over!
      </h1>

      {isNewHighScore && (
        <p className="text-4xl mt-6 text-yellow-300 animate-bounce font-bold">
          New High Score!
        </p>
      )}

      <p className="text-4xl mt-6">Your Score:</p>
      <p className="text-9xl font-bold text-yellow-300 mt-2" style={{ textShadow: '3px 3px 0px #795548' }}>
        {score}
      </p>
      <p className="text-2xl mt-4">High Score: {highScore}</p>
      
      <button
        onClick={onRestart}
        className="mt-12 bg-yellow-400 text-4xl text-white font-bold py-4 px-12 rounded-full shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;
