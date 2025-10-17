import React, { useState, useCallback, useEffect } from 'react';
import { GameState } from './types';
import Menu from './components/Menu';
import GameScreen from './components/GameScreen';
import GameOver from './components/GameOver';
import { audioManager } from './utils/audio';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('pooPooDodgeHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      audioManager.play('background', true);
    } else {
      audioManager.stop('background');
    }
  }, [gameState]);


  const handleStartGame = useCallback(() => {
    setScore(0);
    setGameState(GameState.PLAYING);
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('pooPooDodgeHighScore', finalScore.toString());
    }
    setGameState(GameState.GAME_OVER);
  }, [highScore]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const renderGameState = () => {
    switch (gameState) {
      case GameState.MENU:
        return <Menu onStart={handleStartGame} highScore={highScore} onToggleFullscreen={handleToggleFullscreen} isFullscreen={isFullscreen} />;
      case GameState.PLAYING:
        return <GameScreen onGameOver={handleGameOver} />;
      case GameState.GAME_OVER:
        return <GameOver score={score} highScore={highScore} onRestart={handleStartGame} />;
      default:
        return <Menu onStart={handleStartGame} highScore={highScore} onToggleFullscreen={handleToggleFullscreen} isFullscreen={isFullscreen} />;
    }
  };

  return (
    <div className="bg-sky-400 font-sans w-screen h-screen select-none">
      <div className="w-full h-full bg-sky-500 overflow-hidden relative">
        {renderGameState()}
      </div>
    </div>
  );
};

export default App;