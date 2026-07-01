import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

const GRID_SIZE = 14;

export default function SnakeGame({ isOpen, onClose, timeLeft, isWorkSession }) {
  const [snake, setSnake] = useState([
    { x: 7, y: 6 },
    { x: 7, y: 7 },
    { x: 7, y: 8 }
  ]);
  const [direction, setDirection] = useState('UP');
  const [food, setFood] = useState({ x: 3, y: 4 });
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('study-sound-snake-high') || '0', 10);
  });
  const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'wrap'

  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Refs for stable game loop closure
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const gameModeRef = useRef(gameMode);
  const snakeRef = useRef(snake);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  // Audio Context Provider
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playEatSound = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.06); // E5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  };

  const playCrashSound = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const resetGame = () => {
    const initialSnake = [
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 }
    ];
    setSnake(initialSnake);
    setDirection('UP');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood(initialSnake);
  };

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const onSnake = currentSnake.some(cell => cell.x === newFood.x && cell.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  };

  // Inputs routing
  useEffect(() => {
    window.handleSnakeDirection = (dir) => {
      setDirection(prev => {
        if (dir === 'UP' && prev !== 'DOWN') return 'UP';
        if (dir === 'DOWN' && prev !== 'UP') return 'DOWN';
        if (dir === 'LEFT' && prev !== 'RIGHT') return 'LEFT';
        if (dir === 'RIGHT' && prev !== 'LEFT') return 'RIGHT';
        return prev;
      });
    };

    window.handleSnakeAction = () => {
      if (gameOver) {
        resetGame();
      } else {
        setIsPaused(p => !p);
      }
    };

    window.handleSnakeRotateInput = (dir) => {
      setDirection(prev => {
        const clockwiseSequence = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        const idx = clockwiseSequence.indexOf(prev);
        if (dir > 0) {
          return clockwiseSequence[(idx + 1) % 4];
        } else {
          return clockwiseSequence[(idx + 3) % 4];
        }
      });
    };

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) window.handleSnakeDirection('UP');
      if (['ArrowDown', 'KeyS'].includes(e.code)) window.handleSnakeDirection('DOWN');
      if (['ArrowLeft', 'KeyA'].includes(e.code)) window.handleSnakeDirection('LEFT');
      if (['ArrowRight', 'KeyD'].includes(e.code)) window.handleSnakeDirection('RIGHT');
      if (e.code === 'Space') window.handleSnakeAction();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete window.handleSnakeDirection;
      delete window.handleSnakeAction;
      delete window.handleSnakeRotateInput;
    };
  }, [gameOver]);

  // Game Loop Ticker
  useEffect(() => {
    if (gameOver || isPaused || !isOpen) return;

    const moveSnake = () => {
      const currentSnake = snakeRef.current;
      const head = currentSnake[0];
      let newHead = { ...head };
      const currentDir = directionRef.current;
      const currentFood = foodRef.current;
      const currentMode = gameModeRef.current;

      if (currentDir === 'UP') newHead.y -= 1;
      if (currentDir === 'DOWN') newHead.y += 1;
      if (currentDir === 'LEFT') newHead.x -= 1;
      if (currentDir === 'RIGHT') newHead.x += 1;

      // classic mode boundary crash
      if (currentMode === 'classic') {
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          playCrashSound();
          setGameOver(true);
          return;
        }
      } else {
        // wrap boundary physics
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;
      }

      // self crash
      const selfCrash = currentSnake.some((cell, index) => {
        return index > 0 && cell.x === newHead.x && cell.y === newHead.y;
      });

      if (selfCrash) {
        playCrashSound();
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      // food collision
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        playEatSound();
        setScore(s => {
          const nextScore = s + 10;
          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('study-sound-snake-high', nextScore.toString());
          }
          return nextScore;
        });
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    gameLoopRef.current = setInterval(moveSnake, 160);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, isPaused, isOpen, highScore]);

  // Canvas Drawing Routine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = width / GRID_SIZE;

    // Background (Nokia LCD screen tint)
    ctx.fillStyle = '#8bac0f';
    ctx.fillRect(0, 0, width, height);

    // Light grid lines/cells for pixelated look
    ctx.fillStyle = '#9bbc0f';
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        ctx.fillRect(x * cellSize + 0.8, y * cellSize + 0.8, cellSize - 1.6, cellSize - 1.6);
      }
    }

    // Draw Food (red apple design)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    const centerX = food.x * cellSize + cellSize / 2;
    const centerY = food.y * cellSize + cellSize / 2;
    const radius = (cellSize - 3.5) / 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw Snake Body (Dark Green)
    ctx.fillStyle = '#306230';
    for (let i = 1; i < snake.length; i++) {
      const cell = snake[i];
      ctx.fillRect(cell.x * cellSize + 0.8, cell.y * cellSize + 0.8, cellSize - 1.6, cellSize - 1.6);
    }

    // Draw Snake Head (Very Dark Green)
    ctx.fillStyle = '#0f380f';
    const head = snake[0];
    ctx.fillRect(head.x * cellSize + 0.8, head.y * cellSize + 0.8, cellSize - 1.6, cellSize - 1.6);
  }, [snake, food]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="ipod-screen-panel snake-panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
    >
      <div className="settings-header">
        <h3>
          {!isWorkSession ? `Break: ${formatTime(timeLeft)}` : 'iPod Snake'}
        </h3>
        <button className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="settings-content snake-content">
        <div className="snake-top-bar">
          <div className="snake-score-wrapper">
            <span>Score: <b className="lcd-num">{score}</b></span>
            <span>Hi: <b className="lcd-num">{highScore}</b></span>
          </div>
          <button 
            className={`snake-mode-badge badge-${gameMode}`}
            onClick={() => setGameMode(m => m === 'classic' ? 'wrap' : 'classic')}
          >
            Mode: {gameMode === 'classic' ? 'Classic' : 'Wrap'}
          </button>
        </div>

        <div className="snake-grid-wrapper">
          <canvas 
            ref={canvasRef} 
            width={168} 
            height={168} 
            className="snake-canvas"
          />

          {gameOver && (
            <div className="snake-overlay">
              <div className="overlay-title">GAME OVER</div>
              <div className="overlay-desc">Press Center button to restart</div>
              <button className="snake-restart-btn" onClick={resetGame}>
                <RotateCcw size={16} style={{ marginRight: '4px' }} /> Restart
              </button>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="snake-overlay">
              <div className="overlay-title">PAUSED</div>
              <div className="overlay-desc">Press Center button to resume</div>
              <button className="snake-restart-btn" onClick={() => setIsPaused(false)}>
                <Play size={16} style={{ marginRight: '4px' }} /> Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
