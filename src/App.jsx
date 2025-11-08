import React, { useState, useEffect } from 'react';
import './index.css';

const MODES = {
  '25-5': { work: 25 * 60, break: 5 * 60 },
  '50-10': { work: 50 * 60, break: 10 * 60 }
};

const SOUNDS = {
  'sound1': {
    id: 'pQI64hD2sJw',
    name: '40 HZ Binaural beats',
    description: '"FOCUS & CONCENTRATION" with Dr. Andrew Huberman'
  },
  'sound2': {
    id: 'nMfPqeZjc2c',
    name: 'White Noise',
    description: 'Background ambient sound'
  }
};

const BACKGROUNDS = [
  {
    id: 'bg1',
    name: 'Background 1',
    url: 'https://i.pinimg.com/736x/9c/e1/f0/9ce1f054ab91a6b1418de23b02e664e1.jpg'
  },
  {
    id: 'bg2',
    name: 'Background 2',
    url: 'https://i.pinimg.com/736x/63/f1/a8/63f1a8d86bb62beb12d9b63b1efbf711.jpg'
  },
  {
    id: 'bg3',
    name: 'Background 3',
    url: 'https://i.pinimg.com/736x/0f/36/3f/0f363f59688eea9a66ef57b1d1b9c104.jpg'
  },
  {
    id: 'bg4',
    name: 'Background 4',
    url: 'https://i.pinimg.com/736x/c2/8b/a6/c28ba68f65b3046fdca66218dc506253.jpg'
  },
  {
    id: 'bg5',
    name: 'Background 5',
    url: 'https://i.pinimg.com/736x/c9/1d/a1/c91da14cc9aed8c8e778288ec80e363e.jpg'
  },
  {
    id: 'bg6',
    name: 'Background 6',
    url: 'https://i.pinimg.com/736x/fc/21/16/fc2116139527be69a7885d53dccce907.jpg'
  },
  {
    id: 'bg7',
    name: 'Background 7',
    url: 'https://i.pinimg.com/736x/19/f1/8c/19f18ce453ff9cf908e78ac09cfa6911.jpg'
  },
  {
    id: 'bg8',
    name: 'Background 8',
    url: 'https://i.pinimg.com/736x/59/b4/5b/59b45b5bd44f11c1340795800d731b81.jpg'
  },
  {
    id: 'bg9',
    name: 'Background 9',
    url: 'https://i.pinimg.com/736x/19/87/65/198765757bb552d86828ca3cab828471.jpg'
  },
  {
    id: 'bg10',
    name: 'Background 10',
    url: 'https://i.pinimg.com/736x/88/d7/82/88d78214908da8562209f762180948d8.jpg'
  },
  {
    id: 'bg11',
    name: 'Background 11',
    url: 'https://i.pinimg.com/736x/4a/6d/7d/4a6d7de3a3f29a2d7b0b6c1ce88f808b.jpg'
  }
];

function App() {
  const [currentMode, setCurrentMode] = useState('25-5');
  const [timeLeft, setTimeLeft] = useState(MODES['25-5'].work);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [totalTime, setTotalTime] = useState(MODES['25-5'].work);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentSound, setCurrentSound] = useState('sound1');
  const [currentBackground, setCurrentBackground] = useState('bg1');
  const [volume, setVolume] = useState(50);
  const [showSettings, setShowSettings] = useState(false);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [pulse, setPulse] = useState(false);

  const workTime = MODES[currentMode].work;
  const breakTime = MODES[currentMode].break;

  // YouTube Player
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const playerRef = React.useRef(null);
  const containerIdRef = React.useRef(`youtube-player-${Date.now()}`);

  // Initialize YouTube Player
  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) return;
      
      // Use initial sound
      const videoId = SOUNDS['sound1'].id;
      // Create container if it doesn't exist
      let container = document.getElementById(containerIdRef.current);
      if (!container) {
        container = document.createElement('div');
        container.id = containerIdRef.current;
        container.style.display = 'none';
        document.body.appendChild(container);
      }
      
      const player = new window.YT.Player(containerIdRef.current, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume);
            if (isSoundEnabled) {
              event.target.playVideo();
            }
            setYoutubePlayer(event.target);
            playerRef.current = event.target;
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // Set up global callback for YouTube API
    window.onYouTubeIframeAPIReady = initPlayer;

    // If API is already loaded, initialize immediately
    if (window.YT && window.YT.Player) {
      initPlayer();
    }
  }, []); // Only run once on mount

  // Update YouTube player volume
  useEffect(() => {
    if (youtubePlayer) {
      youtubePlayer.setVolume(volume);
    }
  }, [volume, youtubePlayer]);

  // Update YouTube player play/pause
  useEffect(() => {
    if (youtubePlayer) {
      if (isSoundEnabled) {
        youtubePlayer.playVideo();
      } else {
        youtubePlayer.pauseVideo();
      }
    }
  }, [isSoundEnabled, youtubePlayer]);

  // Change sound when currentSound changes
  useEffect(() => {
    if (youtubePlayer && playerRef.current && currentSound) {
      try {
        const newVideoId = SOUNDS[currentSound].id;
        const shouldPlay = isSoundEnabled;
        
        // Load new video
        youtubePlayer.loadVideoById({
          videoId: newVideoId,
          startSeconds: 0
        });
        
        // Set loop for continuous playback
        youtubePlayer.setLoop(true);
        
        // Play if sound is enabled
        if (shouldPlay) {
          // Use a small delay to ensure video is loaded
          setTimeout(() => {
            if (youtubePlayer && youtubePlayer.playVideo) {
              youtubePlayer.playVideo();
            }
          }, 300);
        }
      } catch (error) {
        console.error('Error changing sound:', error);
      }
    }
  }, [currentSound]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Session finished
            setIsRunning(false);
            setIsWorkSession((prev) => {
              const newIsWork = !prev;
              if (newIsWork) {
                setTimeLeft(workTime);
                setTotalTime(workTime);
              } else {
                setTimeLeft(breakTime);
                setTotalTime(breakTime);
              }
              setPulse(true);
              setTimeout(() => setPulse(false), 500);
              return newIsWork;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, workTime, breakTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(workTime);
    setTotalTime(workTime);
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(MODES[mode].work);
    setTotalTime(MODES[mode].work);
  };

  const handleToggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  const handleSoundChange = (soundKey) => {
    setCurrentSound(soundKey);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      } else if (e.code === 'KeyR' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsRunning(false);
        setIsWorkSession(true);
        setTimeLeft(workTime);
        setTotalTime(workTime);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [workTime]);

  const currentBgUrl = BACKGROUNDS.find(bg => bg.id === currentBackground)?.url || BACKGROUNDS[0].url;

  const handleBackgroundChange = (bgId) => {
    setCurrentBackground(bgId);
    setShowWallpaperPicker(false);
  };

  return (
    <div className="App">
      <div 
        className="background-image" 
        style={{ backgroundImage: `url('${currentBgUrl}')` }}
      ></div>

      <div className="container">
        {/* Main Timer Card */}
        <div className="timer-card glass">
          <div className="timer-header">
            <button className="icon-button" onClick={() => setShowSettings(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243m-4.242 0L5.636 17.364m12.728 0l-4.243-4.243m-4.242 0L5.636 6.636"></path>
              </svg>
            </button>
            <h1 className="timer-title">Study Timer</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="icon-button" onClick={() => setShowWallpaperPicker(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </button>
              <button className="icon-button" onClick={handleToggleSound}>
              {isSoundEnabled ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
              </button>
            </div>
          </div>

          <div className="timer-display-container">
            <div className="session-indicator">
              <span>{isWorkSession ? 'Work' : 'Break'}</span>
            </div>
            <div className={`timer-display ${pulse ? 'pulse' : ''}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="timer-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="timer-controls">
            <button className="control-btn primary" onClick={handleStartPause}>
              <span className="btn-icon">{isRunning ? '⏸' : '▶'}</span>
              <span className="btn-text">{isRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button className="control-btn secondary" onClick={handleReset}>
              <span className="btn-icon">↻</span>
              <span className="btn-text">Reset</span>
            </button>
          </div>
        </div>

        {/* Interval Selection Card */}
        <div className="interval-card glass">
          <h3 className="interval-title">Timer Mode</h3>
          <div className="interval-options">
            <button
              className={`interval-btn ${currentMode === '25-5' ? 'active' : ''}`}
              onClick={() => handleModeChange('25-5')}
            >
              <div className="interval-work">25 min</div>
              <div className="interval-break">5 min break</div>
            </button>
            <button
              className={`interval-btn ${currentMode === '50-10' ? 'active' : ''}`}
              onClick={() => handleModeChange('50-10')}
            >
              <div className="interval-work">50 min</div>
              <div className="interval-break">10 min break</div>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div 
            className={`settings-panel glass ${showSettings ? 'show' : ''}`}
            onClick={(e) => {
              if (e.target.classList.contains('settings-panel')) {
                setShowSettings(false);
              }
            }}
          >
            <div className="settings-header">
              <h3>Settings</h3>
              <button className="icon-button" onClick={() => setShowSettings(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Background Sound</label>
                <div className="sound-options">
                  {Object.entries(SOUNDS).map(([key, sound]) => (
                    <button
                      key={key}
                      className={`sound-option-btn ${currentSound === key ? 'active' : ''}`}
                      onClick={() => handleSoundChange(key)}
                    >
                      <div className="sound-option-title">{sound.name}</div>
                      <div className="sound-option-desc">{sound.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="setting-item">
                <label htmlFor="volume-slider">Volume</label>
                <input
                  type="range"
                  id="volume-slider"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />
                <span>{volume}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Wallpaper Picker Panel */}
        {showWallpaperPicker && (
          <div 
            className={`settings-panel glass ${showWallpaperPicker ? 'show' : ''}`}
            onClick={(e) => {
              if (e.target.classList.contains('settings-panel')) {
                setShowWallpaperPicker(false);
              }
            }}
          >
            <div className="settings-header">
              <h3>Choose Wallpaper</h3>
              <button className="icon-button" onClick={() => setShowWallpaperPicker(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Background Images</label>
                <div className="wallpaper-grid">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      className={`wallpaper-option ${currentBackground === bg.id ? 'active' : ''}`}
                      onClick={() => handleBackgroundChange(bg.id)}
                      style={{
                        backgroundImage: `url('${bg.url}')`,
                      }}
                    >
                      <div className="wallpaper-overlay">
                        {currentBackground === bg.id && (
                          <div className="wallpaper-check">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
