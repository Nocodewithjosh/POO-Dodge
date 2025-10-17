import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { PoopObject, SplatObject, PowerUpObject, PowerUpType, PoopType, EnemyObject } from '../types';
import Player, { PLAYER_WIDTH } from './Player';
import Poop from './Poop';
import Splat from './Splat';
import PowerUp from './PowerUp';
import Enemy from './Enemy';
import { HeartIcon, ScoreDoublerIcon } from './Icons';
import { audioManager } from '../utils/audio';

const BASE_POOP_SPAWN_RATE = 800; // ms
const BASE_POOP_MIN_SPEED = 0.15;
const BASE_POOP_MAX_SPEED = 0.4;
const POOP_MIN_SIZE = 30;
const POOP_MAX_SIZE = 60;
const INITIAL_LIVES = 3;
const INVINCIBILITY_DURATION = 1500; // ms
const POWERUP_SPAWN_RATE = 10000; // ms
const POWERUP_SPEED = 0.1;
const SHIELD_DURATION = 5000; // ms
const UMBRELLA_DURATION = 7000; // ms
const SCORE_DOUBLER_DURATION = 10000; // ms
const MEGA_POOP_EVENT_MIN_INTERVAL = 20000; // ms
const MEGA_POOP_EVENT_MAX_INTERVAL = 30000; // ms
const ENEMY_SPAWN_MIN_INTERVAL = 12000;
const ENEMY_SPAWN_MAX_INTERVAL = 18000;
const ENEMY_LIFESPAN = 8000;
const ENEMY_THROW_RATE = 1500;
const ENEMY_POOP_SPEED_X = 0.3;
const ENEMY_POOP_SPEED_Y = 0.2;


interface GameScreenProps {
  onGameOver: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [playerX, setPlayerX] = useState(50); // in percentage
  const [poops, setPoops] = useState<PoopObject[]>([]);
  const [splats, setSplats] = useState<SplatObject[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUpObject[]>([]);
  const [enemy, setEnemy] = useState<EnemyObject | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [isInvincible, setIsInvincible] = useState(false);
  const [isShielded, setIsShielded] = useState(false);
  const [isUmbrellaActive, setIsUmbrellaActive] = useState(false);
  const [isScoreDoubled, setIsScoreDoubled] = useState(false);
  const [isMegaPoopWarning, setIsMegaPoopWarning] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameDimensionsRef = useRef({ width: 0, height: 0 });
  const gameLoopRef = useRef<number | null>(null);
  const lastPoopTimeRef = useRef<number>(0);
  const lastPowerUpTimeRef = useRef<number>(0);
  const nextMegaPoopEventTimeRef = useRef<number>(0);
  const nextEnemySpawnTimeRef = useRef<number>(0);
  
  const timeouts = useRef<number[]>([]).current;

  const clearAllTimeouts = useCallback(() => {
    timeouts.forEach(clearTimeout);
  }, [timeouts]);

  const addTimeout = useCallback((id: number) => {
    timeouts.push(id);
  }, [timeouts]);

  useLayoutEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const updateDimensions = () => {
      gameDimensionsRef.current = {
        width: gameArea.clientWidth,
        height: gameArea.clientHeight,
      };
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let newPlayerX = (x / rect.width) * 100;
      const playerHalfWidthPercent = (PLAYER_WIDTH / 2 / rect.width) * 100;
      newPlayerX = Math.max(playerHalfWidthPercent, Math.min(100 - playerHalfWidthPercent, newPlayerX));
      setPlayerX(newPlayerX);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setPlayerX(prevX => {
      let newX = prevX;
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        newX -= 3;
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        newX += 3;
      }
      const playerHalfWidthPercent = (PLAYER_WIDTH / 2 / gameDimensionsRef.current.width) * 100;
      return Math.max(playerHalfWidthPercent, Math.min(100 - playerHalfWidthPercent, newX));
    });
  }, []);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMouseMove, handleKeyDown]);

  const scheduleMegaPoopEvent = useCallback((timestamp: number) => {
      const interval = MEGA_POOP_EVENT_MIN_INTERVAL + Math.random() * (MEGA_POOP_EVENT_MAX_INTERVAL - MEGA_POOP_EVENT_MIN_INTERVAL);
      nextMegaPoopEventTimeRef.current = timestamp + interval;
  }, []);

  const triggerMegaPoopStorm = useCallback(() => {
      setIsMegaPoopWarning(false);
      const newPoops: PoopObject[] = [];
      for (let i = 0; i < 10; i++) {
        newPoops.push({
            id: Date.now() + i,
            x: Math.random() * 80,
            y: -10 - Math.random() * 20,
            vx: 0,
            vy: BASE_POOP_MIN_SPEED * 1.2,
            size: 100 + Math.random() * 50, // 2-3 inches approx.
            rotation: Math.random() * 360,
            type: PoopType.MEGA,
        });
      }
      setPoops(prev => [...prev, ...newPoops]);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const { width: gameWidth, height: gameHeight } = gameDimensionsRef.current;
    if (gameWidth === 0 || gameHeight === 0) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
    }

    const difficultyFactor = 1 + score / 35;
    
    // REGULAR POOP SPAWNING
    if (timestamp - lastPoopTimeRef.current > Math.max(150, BASE_POOP_SPAWN_RATE / difficultyFactor)) {
      lastPoopTimeRef.current = timestamp;
      const rand = Math.random();
      let newPoop: PoopObject;
      const basePoop = {
        id: Date.now(),
        x: Math.random() * 95,
        y: -10,
        rotation: Math.random() * 360,
        vx: 0, vy: 0, size: 0, type: PoopType.NORMAL,
      };
      if (rand < 0.15) {
        newPoop = {...basePoop, type: PoopType.BIG, size: POOP_MAX_SIZE + 20, vy: BASE_POOP_MIN_SPEED * 0.8 * difficultyFactor};
      } else if (rand < 0.4) {
        newPoop = {...basePoop, type: PoopType.FAST, size: POOP_MIN_SIZE - 5, vy: BASE_POOP_MAX_SPEED * 1.5 * difficultyFactor};
      } else {
        newPoop = {...basePoop, type: PoopType.NORMAL, size: POOP_MIN_SIZE + Math.random() * (POOP_MAX_SIZE - POOP_MIN_SIZE), vy: (BASE_POOP_MIN_SPEED + Math.random() * (BASE_POOP_MAX_SPEED - BASE_POOP_MIN_SPEED)) * difficultyFactor};
      }
      setPoops(prev => [...prev, newPoop]);
    }

    // POWERUP SPAWNING
    if (timestamp - lastPowerUpTimeRef.current > POWERUP_SPAWN_RATE) {
      lastPowerUpTimeRef.current = timestamp;
      const rand = Math.random();
      let type: PowerUpType;
      if (rand < 0.4) type = PowerUpType.SHIELD;
      else if (rand < 0.7) type = PowerUpType.UMBRELLA;
      else type = PowerUpType.SCORE_DOUBLER;
      setPowerUps(prev => [...prev, { id: Date.now(), x: 10 + Math.random() * 80, y: -10, type }]);
    }
    
    // MEGA POOP EVENT
    if (timestamp > nextMegaPoopEventTimeRef.current) {
        setIsMegaPoopWarning(true);
        audioManager.play('warning');
        addTimeout(window.setTimeout(triggerMegaPoopStorm, 1500));
        scheduleMegaPoopEvent(timestamp);
    }
    
    // ENEMY SPAWNING & ACTIONS
    if (timestamp > nextEnemySpawnTimeRef.current && !enemy) {
        const direction = Math.random() < 0.5 ? 'left' : 'right';
        const newEnemy = {
            id: Date.now(),
            x: direction === 'left' ? -10 : 110,
            y: 20 + Math.random() * 30,
            direction,
            lastThrowTime: timestamp,
        };
        setEnemy(newEnemy);
        addTimeout(window.setTimeout(() => setEnemy(null), ENEMY_LIFESPAN));
        const interval = ENEMY_SPAWN_MIN_INTERVAL + Math.random() * (ENEMY_SPAWN_MAX_INTERVAL - ENEMY_SPAWN_MIN_INTERVAL);
        nextEnemySpawnTimeRef.current = timestamp + interval;
    }

    setEnemy(e => {
        if (!e) return null;
        if (timestamp - e.lastThrowTime > ENEMY_THROW_RATE) {
            setPoops(prev => [...prev, {
                id: Date.now(),
                x: e.direction === 'left' ? (e.x + 5) : (e.x - 5),
                y: e.y + 5,
                vx: e.direction === 'left' ? ENEMY_POOP_SPEED_X : -ENEMY_POOP_SPEED_X,
                vy: ENEMY_POOP_SPEED_Y,
                size: 40,
                rotation: 0,
                type: PoopType.NORMAL,
            }]);
            return { ...e, lastThrowTime: timestamp };
        }
        return e;
    });

    setPoops(prevPoops => {
      const updatedPoops: PoopObject[] = [];
      const newSplats: SplatObject[] = [];

      for(const p of prevPoops) {
        let newY = p.y + p.vy;
        let newX = p.x + p.vx;
        let newVx = p.vx;

        if (newX < 0 || newX > 98) newVx = -newVx; // Bounce off walls for thrown poop
        
        if (newY < 100) {
           updatedPoops.push({ ...p, y: newY, x: newX, vx: newVx });
        } else {
           audioManager.play('splat');
           newSplats.push({id: p.id, x: p.x + (p.size / gameWidth * 100) / 2, size: p.size * 1.2, rotation: Math.random() * 360});
        }
      }

      if (newSplats.length > 0) setSplats(prev => [...prev, ...newSplats]);
      
      if (!isInvincible && !isShielded && !isUmbrellaActive) {
        const playerRect = {
          left: (playerX / 100) * gameWidth - PLAYER_WIDTH / 2,
          right: (playerX / 100) * gameWidth + PLAYER_WIDTH / 2,
          top: gameHeight - 20 - PLAYER_WIDTH,
          bottom: gameHeight - 20,
        };
        
        for (const poop of updatedPoops) {
          const poopRect = {
            left: (poop.x / 100) * gameWidth, right: (poop.x / 100) * gameWidth + poop.size,
            top: (poop.y / 100) * gameHeight, bottom: (poop.y / 100) * gameHeight + poop.size,
          };

          if (playerRect.left < poopRect.right && playerRect.right > poopRect.left && playerRect.top < poopRect.bottom && playerRect.bottom > poopRect.top) {
            audioManager.play('hit');
            setLives(l => l - 1);
            setIsInvincible(true);
            addTimeout(window.setTimeout(() => setIsInvincible(false), INVINCIBILITY_DURATION));
            return updatedPoops.filter(p => p.id !== poop.id);
          }
        }
      }
      return updatedPoops;
    });

    setPowerUps(prevPowerUps =>
      prevPowerUps
        .map(p => ({ ...p, y: p.y + POWERUP_SPEED }))
        .filter(p => {
          if (p.y >= 100) return false;
          const playerRect = { left: (playerX / 100) * gameWidth - PLAYER_WIDTH / 2, right: (playerX / 100) * gameWidth + PLAYER_WIDTH / 2, top: gameHeight - 20 - PLAYER_WIDTH, bottom: gameHeight - 20 };
          const powerUpRect = { left: (p.x / 100) * gameWidth, right: (p.x / 100) * gameWidth + 40, top: (p.y / 100) * gameHeight, bottom: (p.y / 100) * gameHeight + 40 };
          
          if (playerRect.left < powerUpRect.right && playerRect.right > powerUpRect.left && playerRect.top < powerUpRect.bottom && playerRect.bottom > powerUpRect.top) {
            audioManager.play('powerup');
            if (p.type === PowerUpType.SHIELD) {
              setIsShielded(true);
              addTimeout(window.setTimeout(() => setIsShielded(false), SHIELD_DURATION));
            } else if (p.type === PowerUpType.UMBRELLA) {
              setIsUmbrellaActive(true);
              addTimeout(window.setTimeout(() => setIsUmbrellaActive(false), UMBRELLA_DURATION));
            } else if (p.type === PowerUpType.SCORE_DOUBLER) {
              setIsScoreDoubled(true);
              addTimeout(window.setTimeout(() => setIsScoreDoubled(false), SCORE_DOUBLER_DURATION));
            }
            return false;
          }
          return true;
        })
    );

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [score, playerX, isInvincible, isShielded, isUmbrellaActive, enemy, addTimeout, triggerMegaPoopStorm, scheduleMegaPoopEvent]);
  
  useEffect(() => {
    if (lives <= 0) {
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      onGameOver(score);
    }
  }, [lives, onGameOver, score]);

  useEffect(() => {
    const now = performance.now();
    lastPoopTimeRef.current = now;
    lastPowerUpTimeRef.current = now;
    scheduleMegaPoopEvent(now);
    nextEnemySpawnTimeRef.current = now + 5000 + Math.random() * 5000;
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      clearAllTimeouts();
    };
  }, [gameLoop, scheduleMegaPoopEvent, clearAllTimeouts]);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setScore(prev => prev + (isScoreDoubled ? 2 : 1));
    }, 500);
    return () => clearInterval(scoreInterval);
  }, [isScoreDoubled]);

  return (
    <div ref={gameAreaRef} className="w-full h-full relative cursor-none bg-gradient-to-b from-sky-400 to-sky-600">
      {isMegaPoopWarning && (
        <div className="absolute inset-0 bg-red-500/50 animate-pulse z-50 flex items-center justify-center">
            <h2 className="text-8xl text-white font-bold text-center" style={{ textShadow: '4px 4px 0px #000' }}>WARNING!</h2>
        </div>
      )}

      <div className="absolute top-4 left-4 flex gap-2 z-30">
        {Array.from({ length: lives }).map((_, i) => (
          <HeartIcon key={i} className="w-10 h-10" />
        ))}
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2 text-white text-4xl font-bold z-30" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        {isScoreDoubled && <ScoreDoublerIcon className="w-10 h-10" />}
        <span>Score: {score}</span>
      </div>
      
      {poops.map(p => <Poop key={p.id} poop={p} />)}
      {powerUps.map(p => <PowerUp key={p.id} powerUp={p} />)}
      {splats.map(s => <Splat key={s.id} splat={s} />)}
      {enemy && <Enemy enemy={enemy} />}
      
      <Player x={playerX} isInvincible={isInvincible} isShielded={isShielded} isUmbrellaActive={isUmbrellaActive} />

      <div className="absolute bottom-0 left-0 w-full h-8 bg-green-600 border-t-4 border-green-800 z-10" />
    </div>
  );
};

export default GameScreen;