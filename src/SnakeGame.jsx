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

  const gameLoopRef = useRef(null);

  // Sound Synthesizers
  const playEatSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.06); // E5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  };

  const playCrashSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  };

  const resetGame = () => {
    setSnake([
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 }
    ]);
    setDirection('UP');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood([{ x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }]);
  };

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Check if food coordinate is on snake body
      const onSnake = currentSnake.some(cell => cell.x === newFood.x && cell.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  };

  // Click Wheel and Keyboard Bindings
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
          return clockwiseSequence[(idx + 1) % 4]; // Turn 90 deg clockwise
        } else {
          return clockwiseSequence[(idx + 3) % 4]; // Turn 90 deg counter-clockwise
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

  // Main Game Loop Interval
  useEffect(() => {
    if (gameOver || isPaused || !isOpen) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newHead = { ...head };

        if (direction === 'UP') newHead.y -= 1;
        if (direction === 'DOWN') newHead.y += 1;
        if (direction === 'LEFT') newHead.x -= 1;
        if (direction === 'RIGHT') newHead.x += 1;

        // Check wall crash physics
        if (gameMode === 'classic') {
          if (
            newHead.x < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y < 0 ||
            newHead.y >= GRID_SIZE
          ) {
            playCrashSound();
            setGameOver(true);
            return prevSnake;
          }
        } else {
          // Wrap physics
          if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
          if (newHead.x >= GRID_SIZE) newHead.x = 0;
          if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
          if (newHead.y >= GRID_SIZE) newHead.y = 0;
        }

        // Check self crash physics
        const selfCrash = prevSnake.some((cell, index) => {
          // ignore tail if not growing, but to be safe check coordinate overlap
          return index > 0 && cell.x === newHead.x && cell.y === newHead.y;
        });

        if (selfCrash) {
          playCrashSound();
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
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
          newSnake.pop(); // remove tail
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, 160);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [direction, gameOver, isPaused, isOpen, food, gameMode, highScore]);

  // Format break countdown timer
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
        {/* Dynamic Pomodoro Break Time Header */}
        <h3>
          {!isWorkSession ? `Break: ${formatTime(timeLeft)}` : 'iPod Snake'}
        </h3>
        <button className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="settings-content snake-content">
        {/* Top Info Bar */}
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

        {/* Retro Green Snake Grid Screen */}
        <div className="snake-grid-wrapper">
          <div className="snake-grid">
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <div key={y} className="snake-row">
                {Array.from({ length: GRID_SIZE }).map((_, x) => {
                  const isSnakeHead = snake[0].x === x && snake[0].y === y;
                  const isSnakeBody = snake.some((cell, index) => index > 0 && cell.x === x && cell.y === y);
                  const isFood = food.x === x && food.y === y;

                  return (
                    <div
                      key={x}
                      className={`snake-cell ${isSnakeHead ? 'snake-head' : ''} ${isSnakeBody ? 'snake-body' : ''} ${isFood ? 'snake-food' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Overlays for Game Over / Pause */}
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
