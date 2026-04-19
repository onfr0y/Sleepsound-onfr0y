import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Image as ImageIcon, Volume2, VolumeX, ListTodo, Play, Pause, RotateCcw, X, Check } from 'lucide-react';
import TaskTracker from './TaskTracker';
import './index.css';

const MEDITATION_SOUNDS = {
  'med1': {
    id: 'FOwCCvHEfY0',
    name: '432Hz – Healing Tones',
    description: 'Deep meditation & inner peace'
  },
  'med2': {
    id: 'lFcSrYw-ARY',
    name: 'Tibetan Singing Bowls',
    description: 'Chakra cleansing & relaxation'
  },
  'med3': {
    id: 'eKFTSSKCzWA',
    name: 'Forest Rain',
    description: 'Gentle rain sounds for mindfulness'
  },
  'med4': {
    id: '77ZozI0rw7w',
    name: 'Theta Waves 6Hz',
    description: 'Deep meditation, creativity & intuition'
  },
};

const READING_SOUNDS = {
  'read1': {
    id: 'I-s4OOweAEE',
    name: 'Library Ambience',
    description: 'Quiet library with page turning & distant rain'
  },
  'read2': {
    id: 'DWcJFNfaw9c',
    name: 'Lofi Hip Hop chill',
    description: 'Beats to relax/study to'
  },
  'read3': {
    id: '5qap5aO4i9A',
    name: 'Cozy Coffee Shop',
    description: 'Rainy window and jazz in a cafe'
  },
  'read4': {
    id: 'MCkTebktZVc',
    name: 'Hogwarts Library Room',
    description: 'Harry Potter ambient soundscape'
  },
};

const SOUNDS = {
  'sound1': {
    id: 'nMfPqeZjc2c',
    name: 'White Noise',
    description: 'Background ambient sound'
  },
  'sound2': {
    id: 'ca3fBRmmrBA',
    name: 'Study Music',
    description: 'Focus and relax'
  },
  'sound3': {
    id: 'pQI64hD2sJw',
    name: '40 HZ Binaural beat/s',
    description: '"FOCUS & CONCENTRATION" with Dr. Andrew Huberman'
  }
};

const SOUND_CATEGORIES = [
  { name: 'Focus', sounds: SOUNDS },
  { name: 'Meditation', sounds: MEDITATION_SOUNDS },
  { name: 'Reading', sounds: READING_SOUNDS }
];

const MODES = {
  '25-5': { work: 25 * 60, break: 5 * 60 },
  '50-10': { work: 50 * 60, break: 10 * 60 },
  '60-10': { work: 60 * 60, break: 10 * 60 },
  'meditation-10': { work: 10 * 60, break: 0 },
  'meditation-20': { work: 20 * 60, break: 0 },
  'meditation-custom': { work: 10 * 60, break: 0 },
  'reading-20': { work: 20 * 60, break: 0 },
  'reading-30': { work: 30 * 60, break: 0 },
  'reading-custom': { work: 20 * 60, break: 0 },
};

// Breathing cycle phases in seconds: [inhale, hold, exhale, hold]
const BREATH_CYCLE = [4, 4, 6, 2]; // Box breathing variant
const BREATH_LABELS = ['Inhale', 'Hold', 'Exhale', 'Rest'];

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
  },
  {
    id: 'bg12',
    name: 'Background 12',
    url: 'https://i.pinimg.com/736x/d1/50/df/d150dfb1bb57563e8f3b070e61a6360f.jpg'
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
  const [showTasks, setShowTasks] = useState(false);
  const [isIpodMode, setIsIpodMode] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const repCountRef = React.useRef(0);

  // Meditation state
  const [customMeditationMinutes, setCustomMeditationMinutes] = useState(10);
  const [breathPhaseIndex, setBreathPhaseIndex] = useState(0);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(BREATH_CYCLE[0]);
  const breathPhaseRef = useRef(0);
  const breathSecondsRef = useRef(BREATH_CYCLE[0]);

  // Reading state
  const [pagesRead, setPagesRead] = useState(0);
  const [currentPageInput, setCurrentPageInput] = useState('');
  const [customReadingMinutes, setCustomReadingMinutes] = useState(20);

  const isMeditationMode = currentMode.startsWith('meditation');
  const isReadingMode = currentMode.startsWith('reading');

  // Custom timer state
  const [customWorkMinutes, setCustomWorkMinutes] = useState(25);
  const [customBreakMinutes, setCustomBreakMinutes] = useState(5);

  const workTime = currentMode === 'custom'
    ? customWorkMinutes * 60
    : currentMode === 'meditation-custom'
      ? customMeditationMinutes * 60
      : currentMode === 'reading-custom'
        ? customReadingMinutes * 60
        : MODES[currentMode]?.work ?? MODES['25-5'].work;
  const breakTime = currentMode === 'custom' ? customBreakMinutes * 60 : (MODES[currentMode]?.break ?? 0);

  // Completion sound video ID
  const COMPLETION_SOUND_ID = '_Gukzgo-Mi4';

  // YouTube Player
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const playerRef = React.useRef(null);
  const containerIdRef = React.useRef(`youtube-player-${Date.now()}`);

  // Completion Sound Player
  const [completionPlayer, setCompletionPlayer] = useState(null);
  const completionPlayerRef = React.useRef(null);
  const completionContainerIdRef = React.useRef(`completion-player-${Date.now()}`);

  // Sync ref with state
  useEffect(() => {
    repCountRef.current = repCount;
  }, [repCount]);

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

  // Initialize Completion Sound Player
  useEffect(() => {
    const initCompletionPlayer = () => {
      if (completionPlayerRef.current) return;

      // Create container if it doesn't exist
      let container = document.getElementById(completionContainerIdRef.current);
      if (!container) {
        container = document.createElement('div');
        container.id = completionContainerIdRef.current;
        container.style.display = 'none';
        document.body.appendChild(container);
      }

      try {
        const player = new window.YT.Player(completionContainerIdRef.current, {
          height: '0',
          width: '0',
          videoId: COMPLETION_SOUND_ID,
          playerVars: {
            autoplay: 0,
            loop: 0,
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
              setCompletionPlayer(event.target);
              completionPlayerRef.current = event.target;
            },
            onStateChange: (event) => {
              // When completion sound ends, stop it
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.stopVideo();
              }
            }
          }
        });
      } catch (error) {
        console.error('Error initializing completion player:', error);
      }
    };

    // Initialize completion player after a delay to ensure main player is set up
    const initTimer = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initCompletionPlayer();
      } else {
        // If API not ready, wait for it
        const checkApi = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkApi);
            initCompletionPlayer();
          }
        }, 100);

        // Cleanup interval after 10 seconds
        setTimeout(() => clearInterval(checkApi), 10000);
      }
    }, 2000);

    return () => clearTimeout(initTimer);
  }, []); // Only run once on mount

  // Update YouTube player volume
  useEffect(() => {
    if (youtubePlayer) {
      youtubePlayer.setVolume(volume);
    }
    if (completionPlayer) {
      completionPlayer.setVolume(volume);
    }
  }, [volume, youtubePlayer, completionPlayer]);

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

  // Function to play completion sound
  const playCompletionSound = () => {
    if (completionPlayerRef.current) {
      try {
        const player = completionPlayerRef.current;
        // Stop any currently playing completion sound
        if (player.stopVideo) {
          player.stopVideo();
        }
        // Load and play the completion sound
        player.loadVideoById({
          videoId: COMPLETION_SOUND_ID,
          startSeconds: 0
        });
        setTimeout(() => {
          if (player && player.playVideo) {
            player.playVideo();
          }
        }, 500);
      } catch (error) {
        console.error('Error playing completion sound:', error);
      }
    } else if (completionPlayer) {
      // Fallback if ref is not set but state is
      try {
        completionPlayer.loadVideoById({
          videoId: COMPLETION_SOUND_ID,
          startSeconds: 0
        });
        setTimeout(() => {
          if (completionPlayer && completionPlayer.playVideo) {
            completionPlayer.playVideo();
          }
        }, 500);
      } catch (error) {
        console.error('Error playing completion sound:', error);
      }
    }
  };

  // Breathing guide logic (only in meditation mode)
  useEffect(() => {
    if (!isMeditationMode || !isRunning) return;
    const interval = setInterval(() => {
      breathSecondsRef.current -= 1;
      if (breathSecondsRef.current <= 0) {
        const nextPhase = (breathPhaseRef.current + 1) % BREATH_CYCLE.length;
        breathPhaseRef.current = nextPhase;
        breathSecondsRef.current = BREATH_CYCLE[nextPhase];
        setBreathPhaseIndex(nextPhase);
        setBreathSecondsLeft(BREATH_CYCLE[nextPhase]);
      } else {
        setBreathSecondsLeft(breathSecondsRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isMeditationMode, isRunning]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (isMeditationMode) {
              // Meditation session done – just stop and play sound
              setIsRunning(false);
              playCompletionSound();
              setPulse(true);
              setTimeout(() => setPulse(false), 500);
              return 0;
            }

            // Study session finished
            setIsRunning(false);
            setIsWorkSession((prevIsWork) => {
              const newIsWork = !prevIsWork;

              if (prevIsWork) {
                // Work session just ended - increment rep count
                const newRepCount = repCountRef.current + 1;
                repCountRef.current = newRepCount;
                setRepCount(newRepCount);

                // Play completion sound
                playCompletionSound();

                // Calculate break time: 30 minutes if repCount is a multiple of 4
                const calculatedBreakTime = (newRepCount % 4 === 0) ? (30 * 60) : breakTime;

                setTimeLeft(calculatedBreakTime);
                setTotalTime(calculatedBreakTime);
              } else {
                // Break session just ended, start work session
                setTimeLeft(workTime);
                setTotalTime(workTime);
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
  }, [isRunning, timeLeft, workTime, breakTime, completionPlayer, isMeditationMode]);

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
    setRepCount(0);
    repCountRef.current = 0;
    // Reset breathing guide
    breathPhaseRef.current = 0;
    breathSecondsRef.current = BREATH_CYCLE[0];
    setBreathPhaseIndex(0);
    setBreathSecondsLeft(BREATH_CYCLE[0]);
    // Reset reading tracker if in reading mode
    if (isReadingMode) {
      setPagesRead(0);
      setCurrentPageInput('');
    }
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setIsRunning(false);
    setIsWorkSession(true);

    // Reset breathing guide
    breathPhaseRef.current = 0;
    breathSecondsRef.current = BREATH_CYCLE[0];
    setBreathPhaseIndex(0);
    setBreathSecondsLeft(BREATH_CYCLE[0]);

    // Reset reading tracker
    setPagesRead(0);
    setCurrentPageInput('');

    // Calculate new time based on mode
    let newTime;
    if (mode === 'custom') {
      newTime = customWorkMinutes * 60;
    } else if (mode === 'meditation-custom') {
      newTime = customMeditationMinutes * 60;
    } else if (mode === 'reading-custom') {
      newTime = customReadingMinutes * 60;
    } else {
      newTime = MODES[mode]?.work ?? MODES['25-5'].work;
    }

    setTimeLeft(newTime);
    setTotalTime(newTime);
    setRepCount(0);
    repCountRef.current = 0;

    // Switch to a calming sound when entering meditation/reading modes
    if (mode.startsWith('meditation') && !currentSound.startsWith('med')) {
      setCurrentSound('med1');
    } else if (mode.startsWith('reading') && !currentSound.startsWith('read')) {
      setCurrentSound('read1');
    }
  };

  const handleCustomWorkChange = (e) => {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setCustomWorkMinutes(val);
    if (currentMode === 'custom' && isWorkSession) {
      setIsRunning(false);
      setTimeLeft(val * 60);
      setTotalTime(val * 60);
    }
  };

  const handleCustomBreakChange = (e) => {
    const val = Math.max(1, parseInt(e.target.value) || 1);
    setCustomBreakMinutes(val);
    if (currentMode === 'custom' && !isWorkSession) {
      setIsRunning(false);
      setTimeLeft(val * 60);
      setTotalTime(val * 60);
    }
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
        setRepCount(0);
        repCountRef.current = 0;
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

  // Unified sound list for settings
  const soundCategories = SOUND_CATEGORIES;

  return (
    <div className={`App${isMeditationMode ? ' meditation-active' : ''}${isReadingMode ? ' reading-active' : ''}`}>
      <div
        className="background-image"
        style={{ backgroundImage: `url('${currentBgUrl}')` }}
      ></div>

      <motion.div 
        className={isIpodMode ? "container ipod-shell glass" : "container"}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={isIpodMode ? "ipod-screen glass-inner" : "desktop-screen-bypass"}>
          {isIpodMode && (
            <div className="ipod-status-bar">
               <span className="ipod-title">{isMeditationMode ? 'Meditate' : isReadingMode ? 'Reading' : 'Study iPod'}</span>
               <div className="ipod-status-icons">
                 {isSoundEnabled ? <Volume2 size={14}/> : <VolumeX size={14}/>}
                 <button className="icon-button-small" onClick={() => setShowWallpaperPicker(true)}>
                   <ImageIcon size={14} />
                 </button>
               </div>
            </div>
          )}

          {/* iPod in-screen Settings Panel */}
          {isIpodMode && (
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  className="ipod-screen-panel"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                >
                  <div className="settings-header">
                    <h3>Settings</h3>
                    <button className="icon-button" onClick={() => setShowSettings(false)}>
                      <X size={18} />
                    </button>
                  </div>
                  <div className="settings-content">
                    <div className="setting-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '0.3rem' }}>
                      <label style={{ margin: 0, fontWeight: 600 }}>iPod Mode</label>
                      <button
                        className={`sound-option-btn ${isIpodMode ? 'active' : ''}`}
                        style={{ padding: '0.3rem 0.8rem', width: 'auto', textAlign: 'center', boxShadow: 'none', fontSize: '0.8rem' }}
                        onClick={() => setIsIpodMode(!isIpodMode)}
                      >
                        {isIpodMode ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <div className="setting-item">
                      <label>Background Sound</label>
                      <div className="sound-options-scrollable">
                        {soundCategories.map((category) => (
                          <div key={category.name} className="sound-category-group">
                            <div className="sound-category-header">{category.name}</div>
                            <div className="sound-options">
                              {Object.entries(category.sounds).map(([key, sound]) => (
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
                        ))}
                      </div>
                    </div>
                    <div className="setting-item">
                      <label htmlFor="ipod-volume">Volume</label>
                      <input type="range" id="ipod-volume" min="0" max="100" value={volume} onChange={handleVolumeChange} />
                      <span>{volume}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* iPod in-screen Wallpaper Panel */}
          {isIpodMode && (
            <AnimatePresence>
              {showWallpaperPicker && (
                <motion.div
                  className="ipod-screen-panel"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                >
                  <div className="settings-header">
                    <h3>Wallpaper</h3>
                    <button className="icon-button" onClick={() => setShowWallpaperPicker(false)}>
                      <X size={18} />
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
                            style={{ backgroundImage: `url('${bg.url}')` }}
                          >
                            <div className="wallpaper-overlay">
                              {currentBackground === bg.id && (
                                <div className="wallpaper-check"><Check size={16} /></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div className={isIpodMode ? "ipod-content" : "desktop-cards-wrapper"}>
            <div className={`timer-card ${isIpodMode ? '' : 'glass'}${isMeditationMode ? ' meditation-card' : ''}${isReadingMode ? ' reading-card' : ''}`}>
              <div className="timer-header">
                {!isIpodMode && (
                  <button className="icon-button" onClick={() => setShowSettings(true)}>
                    <Settings size={20} />
                  </button>
                )}
                <h1 className="timer-title">
                  {isMeditationMode ? 'Meditate' : isReadingMode ? 'Reading' : 'Study Timer'}
                </h1>
                {!isIpodMode && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-button" onClick={() => setShowTasks(true)}>
                      <ListTodo size={20} />
                    </button>
                    <button className="icon-button" onClick={() => setShowWallpaperPicker(true)}>
                      <ImageIcon size={20} />
                    </button>
                    <button className="icon-button" onClick={handleToggleSound}>
                      {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                  </div>
                )}
              </div>

          <div className="timer-display-container">
            <div className="session-indicator">
              {isMeditationMode ? (
                <span className="meditation-label">Meditate</span>
              ) : isReadingMode ? (
                <span className="reading-label">Read</span>
              ) : (
                <span>{isWorkSession ? 'Work' : 'Break'}</span>
              )}
              {(!isMeditationMode && !isReadingMode) && (
                <div className="rep-indicator">
                  <div className="rep-circles">
                    {[1, 2, 3, 4].map((circleNum) => {
                      const completedInCycle = repCount % 4 === 0 ? (repCount > 0 ? 4 : 0) : repCount % 4;
                      const isFilled = circleNum <= completedInCycle;
                      const isLongBreakRep = circleNum === 4;
                      return (
                        <div
                          key={circleNum}
                          className={`rep-circle ${isFilled ? 'filled' : ''} ${isLongBreakRep ? 'long-break' : ''}`}
                          title={isLongBreakRep ? 'Long break after this rep' : `Rep ${circleNum}`}
                        >
                          {isLongBreakRep && (
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="8" cy="8" r="6" />
                              <path d="M8 4v4l3 2" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {repCount > 0 && (
                    <span className="rep-text">
                      Rep {repCount}
                      {repCount % 4 === 0 && !isWorkSession && ' • Long Break (30 min)'}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className={`timer-display ${pulse ? 'pulse' : ''}`}>
              {formatTime(timeLeft)}
            </div>
            {/* Breathing guide – shown only in meditation mode */}
            {isMeditationMode && (
              <div className={`breath-guide breath-${BREATH_LABELS[breathPhaseIndex].toLowerCase()}`}>
                <div className={`breath-orb ${isRunning ? `breath-${BREATH_LABELS[breathPhaseIndex].toLowerCase()}` : ''}`}></div>
                <div className="breath-text">
                  <span className="breath-label">{BREATH_LABELS[breathPhaseIndex]}</span>
                  <span className="breath-seconds">{breathSecondsLeft}s</span>
                </div>
              </div>
            )}
            {/* Pages Tracker - shown only in reading mode */}
            {isReadingMode && (
              <div className="pages-tracker">
                <div className="pages-display">{pagesRead} pages read</div>
                <div className="pages-input-row">
                  <input
                    type="number"
                    min="1"
                    placeholder="+"
                    className="pages-input"
                    value={currentPageInput}
                    onChange={(e) => setCurrentPageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt(currentPageInput);
                        if (!isNaN(val) && val > 0) {
                          setPagesRead(prev => prev + val);
                          setCurrentPageInput('');
                        }
                      }
                    }}
                  />
                  <button
                    className="pages-add-btn"
                    onClick={() => {
                      const val = parseInt(currentPageInput);
                      if (!isNaN(val) && val > 0) {
                        setPagesRead(prev => prev + val);
                        setCurrentPageInput('');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="timer-progress">
              <div
                className={`progress-bar${isMeditationMode ? ' meditation-progress' : ''}${isReadingMode ? ' reading-progress' : ''}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            </div>
          </div>
          
          {!isIpodMode && (
            <div className="timer-controls">
              <button className="control-btn primary" onClick={handleStartPause}>
                <span className="btn-icon">{isRunning ? <Pause size={18} /> : <Play size={18} />}</span>
                <span className="btn-text">{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button className="control-btn secondary" onClick={handleReset}>
                <span className="btn-icon"><RotateCcw size={18} /></span>
                <span className="btn-text">Reset</span>
              </button>
            </div>
          )}

        {/* Interval Selection Card */}
        <div className={`interval-card${!isIpodMode ? ' glass' : ''}${isMeditationMode ? ' meditation-interval-card' : ''}${isReadingMode ? ' reading-interval-card' : ''}`}>
          <h3 className="interval-title">
            {isMeditationMode ? 'Meditation Duration' : isReadingMode ? 'Reading Duration' : 'Timer Mode'}
          </h3>

          {(!isMeditationMode && !isReadingMode) ? (
            <>
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
                <button
                  className={`interval-btn ${currentMode === 'custom' ? 'active' : ''}`}
                  onClick={() => handleModeChange('custom')}
                >
                  <div className="interval-work">Custom</div>
                  <div className="interval-break">Set your own</div>
                </button>
              </div>
              {currentMode === 'custom' && (
                <div className="custom-timers">
                  <div className="custom-input-group">
                    <label>Work (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={customWorkMinutes}
                      onChange={handleCustomWorkChange}
                      className="custom-time-input"
                    />
                  </div>
                  <div className="custom-input-group">
                    <label>Break (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={customBreakMinutes}
                      onChange={handleCustomBreakChange}
                      className="custom-time-input"
                    />
                  </div>
                </div>
              )}
              {/* Divider + Meditation & Reading entry */}
              <div className="mode-divider"><span>or</span></div>
              <div className="mode-entry-row">
                <button
                  className="interval-btn meditation-entry-btn"
                  onClick={() => handleModeChange('meditation-10')}
                >
                  <div className="interval-work">Meditate</div>
                  <div className="interval-break">Mindfulness mode</div>
                </button>
                <button
                  className="interval-btn reading-entry-btn"
                  onClick={() => handleModeChange('reading-20')}
                >
                  <div className="interval-work">Read</div>
                  <div className="interval-break">Reading mode</div>
                </button>
              </div>
            </>
          ) : isMeditationMode ? (
            <>
              <div className="interval-options">
                <button
                  className={`interval-btn meditation-btn ${currentMode === 'meditation-10' ? 'active' : ''}`}
                  onClick={() => handleModeChange('meditation-10')}
                >
                  <div className="interval-work">10 min</div>
                  <div className="interval-break">Short session</div>
                </button>
                <button
                  className={`interval-btn meditation-btn ${currentMode === 'meditation-20' ? 'active' : ''}`}
                  onClick={() => handleModeChange('meditation-20')}
                >
                  <div className="interval-work">20 min</div>
                  <div className="interval-break">Standard session</div>
                </button>
                <button
                  className={`interval-btn meditation-btn ${currentMode === 'meditation-custom' ? 'active' : ''}`}
                  onClick={() => handleModeChange('meditation-custom')}
                >
                  <div className="interval-work">Custom</div>
                  <div className="interval-break">Set your own</div>
                </button>
              </div>
              {currentMode === 'meditation-custom' && (
                <div className="custom-timers">
                  <div className="custom-input-group">
                    <label>Duration (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={customMeditationMinutes}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setCustomMeditationMinutes(val);
                        setIsRunning(false);
                        setTimeLeft(val * 60);
                        setTotalTime(val * 60);
                      }}
                      className="custom-time-input"
                    />
                  </div>
                </div>
              )}
              {/* Divider + back to Study */}
              <div className="mode-divider"><span>or</span></div>
              <button
                className="interval-btn"
                onClick={() => handleModeChange('25-5')}
              >
                <div className="interval-work">Study</div>
                <div className="interval-break">Back to Pomodoro mode</div>
              </button>
            </>
          ) : (
            <>
              <div className="interval-options">
                <button
                  className={`interval-btn reading-btn ${currentMode === 'reading-20' ? 'active' : ''}`}
                  onClick={() => handleModeChange('reading-20')}
                >
                  <div className="interval-work">20 min</div>
                  <div className="interval-break">Short read</div>
                </button>
                <button
                  className={`interval-btn reading-btn ${currentMode === 'reading-30' ? 'active' : ''}`}
                  onClick={() => handleModeChange('reading-30')}
                >
                  <div className="interval-work">30 min</div>
                  <div className="interval-break">Standard read</div>
                </button>
                <button
                  className={`interval-btn reading-btn ${currentMode === 'reading-custom' ? 'active' : ''}`}
                  onClick={() => handleModeChange('reading-custom')}
                >
                  <div className="interval-work">Custom</div>
                  <div className="interval-break">Set your own</div>
                </button>
              </div>
              {currentMode === 'reading-custom' && (
                <div className="custom-timers">
                  <div className="custom-input-group">
                    <label>Duration (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={customReadingMinutes}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setCustomReadingMinutes(val);
                        setIsRunning(false);
                        setTimeLeft(val * 60);
                        setTotalTime(val * 60);
                      }}
                      className="custom-time-input"
                    />
                  </div>
                </div>
              )}
              {/* Divider + back to Study */}
              <div className="mode-divider"><span>or</span></div>
              <button
                className="interval-btn"
                onClick={() => handleModeChange('25-5')}
              >
                <div className="interval-work">Study</div>
                <div className="interval-break">Back to Pomodoro mode</div>
              </button>
            </>
          )}
        </div>
        
          </div>
        </div>
        
        {isIpodMode && (
          <div className="ipod-wheel-container">
            <div className="ipod-wheel">
              <button className="wheel-btn wheel-top" onClick={() => setShowSettings(true)}>MENU</button>
              <button className="wheel-btn wheel-bottom" onClick={() => setShowTasks(true)}>
                <ListTodo size={20} />
              </button>
              <button className="wheel-btn wheel-left" onClick={handleToggleSound}>
                {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
              <button className="wheel-btn wheel-right" onClick={handleReset}>
                <RotateCcw size={24} />
              </button>
              <button className="wheel-center" onClick={handleStartPause}>
                {isRunning ? <Pause size={30} /> : <Play size={30} />}
              </button>
            </div>
          </div>
        )}

        {/* Settings Panel (desktop/non-iPod mode only) */}
        {!isIpodMode && (
          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="settings-panel glass show"
                initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  if (e.target.classList.contains('settings-panel')) {
                    setShowSettings(false);
                  }
                }}
              >
                <div className="settings-header">
                  <h3>Settings</h3>
                  <button className="icon-button" onClick={() => setShowSettings(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="settings-content">
                  <div className="setting-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0, fontWeight: 600 }}>Enable iPod UI</label>
                    <button 
                      className={`sound-option-btn ${isIpodMode ? 'active' : ''}`} 
                      style={{ padding: '0.4rem 1rem', width: 'auto', textAlign: 'center', boxShadow: 'none' }}
                      onClick={() => setIsIpodMode(!isIpodMode)}
                    >
                      {isIpodMode ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="setting-item">
                    <label>Background Sound</label>
                    <div className="sound-options-scrollable">
                      {soundCategories.map((category) => (
                        <div key={category.name} className="sound-category-group">
                          <div className="sound-category-header">{category.name}</div>
                          <div className="sound-options">
                            {Object.entries(category.sounds).map(([key, sound]) => (
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
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Wallpaper Picker Panel (desktop/non-iPod mode only) */}
        {!isIpodMode && (
          <AnimatePresence>
            {showWallpaperPicker && (
              <motion.div
                className="settings-panel glass show"
                initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  if (e.target.classList.contains('settings-panel')) {
                    setShowWallpaperPicker(false);
                  }
                }}
              >
                <div className="settings-header">
                  <h3>Choose Wallpaper</h3>
                  <button className="icon-button" onClick={() => setShowWallpaperPicker(false)}>
                    <X size={20} />
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
                              <div className="wallpaper-check"><Check size={20} /></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      <TaskTracker isOpen={showTasks} onClose={() => setShowTasks(false)} />
    </div>
  );
}

export default App;
