import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Settings, Image as ImageIcon, Volume2, VolumeX, ListTodo, Play, Pause, RotateCcw, X, Check } from 'lucide-react';
import TaskTracker from './TaskTracker';
import GlassSurface from './GlassSurface';
import ElasticSlider from './ElasticSlider';
import ShapeBlur from './ShapeBlur';
import './index.css';
import AmbientWaveform from './AmbientWaveform';
import NotesPanel from './NotesPanel';
import SnakeGame from './SnakeGame';

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

// Breathing exercise presets
const BREATHING_PRESETS = [
  {
    id: '4-4-coherent',
    name: '4-4 Coherent',
    subtitle: 'Nervous system balance',
    cycle: [4, 4],
    labels: ['Inhale', 'Exhale'],
    description: 'Equal 4s inhale and 4s exhale. Helps stabilize heart rate variability, reduce stress, and balance the nervous system.'
  },
  {
    id: 'physiological-sigh',
    name: 'Physiological Sigh (Huberman)',
    subtitle: 'Rapid stress relief',
    cycle: [4, 1, 6, 2],
    labels: ['Inhale (Deep)', 'Inhale (Sniff)', 'Exhale (Slow)', 'Rest'],
    description: 'Stanford neurobiologist Dr. Andrew Huberman\'s research shows a double-inhale (deep nose inhale + quick top-up sniff) followed by a long exhale is the fastest way to relieve stress and lower autonomic arousal.'
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing (4-4-4-4)',
    subtitle: 'Navy SEAL focus',
    cycle: [4, 4, 4, 4],
    labels: ['Inhale', 'Hold', 'Exhale', 'Hold'],
    description: 'Used by elite operators for calm, focused alertness. Four equal phases structure breathing to reset mental clarity.'
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    subtitle: 'Deep sleep & relax',
    cycle: [4, 7, 8],
    labels: ['Inhale', 'Hold', 'Exhale'],
    description: 'Created by Dr. Andrew Weil. Acts as a natural tranquilizer for the nervous system, ideal for winding down.'
  },
  {
    id: 'custom',
    name: 'Custom Exercise',
    subtitle: 'Build your own',
    cycle: [4, 4],
    labels: ['Inhale', 'Exhale'],
    description: 'Configure your own custom breathing durations for each phase.'
  }
];

const getPhaseClass = (label) => {
  if (!label) return 'rest';
  const l = label.toLowerCase();
  if (l.includes('inhale')) return 'inhale';
  if (l.includes('exhale')) return 'exhale';
  if (l.includes('hold')) return 'hold';
  if (l.includes('rest') || l.includes('pause')) return 'rest';
  return 'rest';
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
  },
  {
    id: 'bg12',
    name: 'Background 12',
    url: 'https://i.pinimg.com/736x/d1/50/df/d150dfb1bb57563e8f3b070e61a6360f.jpg'
  },
  {
    id: 'bg13',
    name: 'Animated 1',
    type: 'video',
    url: 'https://v1.pinimg.com/videos/iht/expMp4/e2/b6/29/e2b6294294505371cc9a2fd780e2fe8c_720w.mp4',
    poster: 'https://i.pinimg.com/videos/thumbnails/originals/e2/b6/29/e2b6294294505371cc9a2fd780e2fe8c.0000000.jpg'
  }
];

function App() {
  const [currentMode, setCurrentMode] = useState('25-5');
  const [whiteNoiseVolume, setWhiteNoiseVolume] = useState(0);
  const [rainVolume, setRainVolume] = useState(0);
  const [wavesVolume, setWavesVolume] = useState(0);

  const audioContextRef = useRef(null);
  const whiteNoiseSourceRef = useRef(null);
  const whiteNoiseGainRef = useRef(null);
  const rainAudioRef = useRef(null);
  const wavesAudioRef = useRef(null);
  const wheelRef = useRef(null);
  const [wheelAngle, setWheelAngle] = useState(null);
  const [timeLeft, setTimeLeft] = useState(MODES['25-5'].work);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [totalTime, setTotalTime] = useState(MODES['25-5'].work);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentSound, setCurrentSound] = useState('sound1');
  const [currentBackground, setCurrentBackground] = useState('bg4');
  const [volume, setVolume] = useState(50);
  const [showSettings, setShowSettings] = useState(false);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showSnakePanel, setShowSnakePanel] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const isIpodMode = true;
  const [pulse, setPulse] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 768 : false
  );
  const [isDragging, setIsDragging] = useState(false);
  const ipodControls = useAnimationControls();
  const repCountRef = React.useRef(0);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    ipodControls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    });
  }, [ipodControls]);

  // Meditation state
  const [customMeditationMinutes, setCustomMeditationMinutes] = useState(10);
  const [selectedPresetId, setSelectedPresetId] = useState('4-4-coherent');
  const [breathCycle, setBreathCycle] = useState([4, 4]);
  const [breathLabels, setBreathLabels] = useState(['Inhale', 'Exhale']);
  const [customCycle, setCustomCycle] = useState([4, 4]);
  const [customLabels, setCustomLabels] = useState(['Inhale', 'Exhale']);
  
  const [breathPhaseIndex, setBreathPhaseIndex] = useState(0);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const breathPhaseRef = useRef(0);
  const breathSecondsRef = useRef(4);

  const getBreathOrbStyle = () => {
    if (!isRunning) {
      return { 
        animation: 'breath-idle-pulse 4s ease-in-out infinite',
      };
    }
    const label = breathLabels[breathPhaseIndex] || '';
    const duration = breathCycle[breathPhaseIndex] || 4;
    const l = label.toLowerCase();

    if (l.includes('inhale') && !l.includes('hold') && !l.includes('sniff')) {
      return {
        transform: 'scale(1.35)',
        boxShadow: '0 0 30px rgba(196, 167, 255, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        transition: `transform ${duration}s linear, box-shadow ${duration}s linear`,
      };
    } else if (l.includes('exhale')) {
      return {
        transform: 'scale(0.85)',
        boxShadow: '0 0 15px rgba(196, 167, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        transition: `transform ${duration}s linear, box-shadow ${duration}s linear`,
      };
    } else if (l.includes('hold') || l.includes('sniff')) {
      const isHoldAfterInhale = breathPhaseIndex === 1 || (breathPhaseIndex > 0 && breathLabels[breathPhaseIndex - 1]?.toLowerCase().includes('inhale'));
      return {
        transform: isHoldAfterInhale ? 'scale(1.35)' : 'scale(0.85)',
        boxShadow: isHoldAfterInhale 
          ? '0 0 30px rgba(196, 167, 255, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4)' 
          : '0 0 15px rgba(196, 167, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        transition: `transform ${duration}s linear, box-shadow ${duration}s linear`,
      };
    } else {
      return {
        transform: 'scale(0.85)',
        opacity: 0.7,
        boxShadow: '0 0 15px rgba(196, 167, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      };
    }
  };

  const handlePresetChange = (presetId) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') {
      setBreathCycle(customCycle);
      setBreathLabels(customLabels);
      
      breathPhaseRef.current = 0;
      breathSecondsRef.current = customCycle[0];
      setBreathPhaseIndex(0);
      setBreathSecondsLeft(customCycle[0]);
      return;
    }
    const preset = BREATHING_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setBreathCycle(preset.cycle);
      setBreathLabels(preset.labels);
      
      // Reset breathing progress
      breathPhaseRef.current = 0;
      breathSecondsRef.current = preset.cycle[0];
      setBreathPhaseIndex(0);
      setBreathSecondsLeft(preset.cycle[0]);
    }
  };

  const handlePhaseDurationChange = (index, newDuration) => {
    const val = Math.max(1, newDuration);
    let updatedCycle;
    let updatedLabels;
    
    if (selectedPresetId === 'custom') {
      updatedCycle = [...breathCycle];
      updatedCycle[index] = val;
      setBreathCycle(updatedCycle);
      setCustomCycle(updatedCycle);
      updatedLabels = breathLabels;
    } else {
      updatedCycle = [...breathCycle];
      updatedCycle[index] = val;
      updatedLabels = [...breathLabels];
      
      setBreathCycle(updatedCycle);
      setBreathLabels(updatedLabels);
      setCustomCycle(updatedCycle);
      setCustomLabels(updatedLabels);
      setSelectedPresetId('custom');
    }

    // Reset breathing progress to keep in sync
    breathPhaseRef.current = 0;
    breathSecondsRef.current = updatedCycle[0];
    setBreathPhaseIndex(0);
    setBreathSecondsLeft(updatedCycle[0]);
  };

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
  const COMPLETION_SOUND_ID = 'DiVG89Sq6Dg';

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

  // Local mixer ambient loop audio setup
  useEffect(() => {
    rainAudioRef.current = new Audio('https://www.soundjay.com/nature/sounds/rain-07.mp3');
    rainAudioRef.current.loop = true;

    wavesAudioRef.current = new Audio('https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3');
    wavesAudioRef.current.loop = true;

    return () => {
      if (rainAudioRef.current) rainAudioRef.current.pause();
      if (wavesAudioRef.current) wavesAudioRef.current.pause();
      if (whiteNoiseSourceRef.current) {
        try { whiteNoiseSourceRef.current.stop(); } catch (e) {}
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  // Update loop volumes
  useEffect(() => {
    if (rainAudioRef.current) {
      rainAudioRef.current.volume = isSoundEnabled ? (rainVolume / 100) : 0;
      if (isSoundEnabled && rainVolume > 0) {
        rainAudioRef.current.play().catch(() => {});
      } else {
        rainAudioRef.current.pause();
      }
    }
  }, [rainVolume, isSoundEnabled]);

  useEffect(() => {
    if (wavesAudioRef.current) {
      wavesAudioRef.current.volume = isSoundEnabled ? (wavesVolume / 100) : 0;
      if (isSoundEnabled && wavesVolume > 0) {
        wavesAudioRef.current.play().catch(() => {});
      } else {
        wavesAudioRef.current.pause();
      }
    }
  }, [wavesVolume, isSoundEnabled]);

  const startWhiteNoise = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (whiteNoiseSourceRef.current) return;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start();

    whiteNoiseSourceRef.current = source;
    whiteNoiseGainRef.current = gainNode;
  };

  useEffect(() => {
    if (isSoundEnabled && whiteNoiseVolume > 0) {
      try {
        startWhiteNoise();
        if (whiteNoiseGainRef.current && audioContextRef.current) {
          whiteNoiseGainRef.current.gain.linearRampToValueAtTime(
            (whiteNoiseVolume / 100) * 0.15,
            audioContextRef.current.currentTime + 0.1
          );
        }
      } catch (e) {
        console.error('White noise failed to play:', e);
      }
    } else {
      if (whiteNoiseGainRef.current && audioContextRef.current) {
        whiteNoiseGainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
      }
    }
  }, [whiteNoiseVolume, isSoundEnabled]);

  const playTickSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch (e) {}
  };

  const handleWheelRotation = (direction) => {
    if (showSettings || showSoundPicker) {
      const scrollable = document.querySelector('.sound-options-scrollable') || document.querySelector('.settings-content');
      if (scrollable) {
        scrollable.scrollTop += direction * 25;
      }
    } else if (showTasks) {
      const scrollable = document.querySelector('.task-list');
      if (scrollable) {
        scrollable.scrollTop += direction * 25;
      }
    } else if (showWallpaperPicker) {
      const scrollable = document.querySelector('.wallpaper-grid') || document.querySelector('.ipod-screen-panel');
      if (scrollable) {
        scrollable.scrollTop += direction * 25;
      }
    } else if (showNotesPanel) {
      const scrollable = document.querySelector('.notes-history-list') || document.querySelector('.notes-content');
      if (scrollable) {
        scrollable.scrollTop += direction * 25;
      }
    } else if (showSnakePanel) {
      window.handleSnakeRotateInput?.(direction);
    } else {
      setVolume((prev) => {
        const nextVolume = Math.min(100, Math.max(0, prev + direction * 4));
        setShowVolumePopup(true);
        if (window.volumePopupTimeout) clearTimeout(window.volumePopupTimeout);
        window.volumePopupTimeout = setTimeout(() => {
          setShowVolumePopup(false);
        }, 1200);
        return nextVolume;
      });
    }
  };

  const handleWheelStart = (e) => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    setWheelAngle(angle);
  };

  const handleWheelMove = (e) => {
    if (wheelAngle === null) return;
    const wheel = wheelRef.current;
    if (!wheel) return;
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const currentAngle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);

    let dAngle = currentAngle - wheelAngle;
    if (dAngle > 180) dAngle -= 360;
    if (dAngle < -180) dAngle += 360;

    const threshold = 18;
    if (Math.abs(dAngle) >= threshold) {
      const direction = dAngle > 0 ? 1 : -1;
      setWheelAngle(currentAngle);
      playTickSound();
      handleWheelRotation(direction);
    }
  };

  const handleWheelEnd = () => {
    setWheelAngle(null);
  };

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

  // Listen to physical device volume keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      
      let changed = false;
      if (e.key === 'AudioVolumeUp' || e.key === 'ArrowUp') {
        if (e.key === 'ArrowUp') e.preventDefault();
        setVolume(v => Math.min(v + 10, 100));
        changed = true;
      } else if (e.key === 'AudioVolumeDown' || e.key === 'ArrowDown') {
        if (e.key === 'ArrowDown') e.preventDefault();
        setVolume(v => Math.max(v - 10, 0));
        changed = true;
      } else if (e.key === 'AudioVolumeMute' || (e.key === 'm' && (e.metaKey || e.ctrlKey))) {
        setIsSoundEnabled(prev => !prev);
        changed = true;
      }

      if (changed) {
        setShowVolumePopup(true);
        if (window.volumePopupTimeout) clearTimeout(window.volumePopupTimeout);
        window.volumePopupTimeout = setTimeout(() => {
          setShowVolumePopup(false);
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Breathing guide logic (only in meditation mode)
  useEffect(() => {
    if (!isMeditationMode || !isRunning) return;
    const interval = setInterval(() => {
      breathSecondsRef.current -= 1;
      if (breathSecondsRef.current <= 0) {
        const nextPhase = (breathPhaseRef.current + 1) % breathCycle.length;
        breathPhaseRef.current = nextPhase;
        breathSecondsRef.current = breathCycle[nextPhase];
        setBreathPhaseIndex(nextPhase);
        setBreathSecondsLeft(breathCycle[nextPhase]);
      } else {
        setBreathSecondsLeft(breathSecondsRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isMeditationMode, isRunning, breathCycle]);

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
    breathSecondsRef.current = breathCycle[0] || 4;
    setBreathPhaseIndex(0);
    setBreathSecondsLeft(breathCycle[0] || 4);
    // Reset reading tracker if in reading mode
    if (isReadingMode) {
      setPagesRead(0);
      setCurrentPageInput('');
    }
  };

  const handleToggleWorkBreak = () => {
    setIsRunning(false);
    setIsWorkSession((prevIsWork) => {
      const newIsWork = !prevIsWork;
      if (prevIsWork) {
        // transitioning from Work to Break
        const newRep = repCount + 1;
        setRepCount(newRep);
        repCountRef.current = newRep;
        playCompletionSound();
        const calcTime = (newRep % 4 === 0) ? (30 * 60) : breakTime;
        setTimeLeft(calcTime);
        setTotalTime(calcTime);
      } else {
        // transitioning from Break to Work
        setTimeLeft(workTime);
        setTotalTime(workTime);
      }
      return newIsWork;
    });
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setIsRunning(false);
    setIsWorkSession(true);

    // Reset breathing guide
    breathPhaseRef.current = 0;
    breathSecondsRef.current = breathCycle[0] || 4;
    setBreathPhaseIndex(0);
    setBreathSecondsLeft(breathCycle[0] || 4);

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
      const tag = document.activeElement && document.activeElement.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';
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
      } else if (e.code === 'KeyC' && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        ipodControls.start({
          x: 0,
          y: 0,
          transition: { type: 'spring', stiffness: 260, damping: 26 }
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [workTime, ipodControls]);

  const currentBg = BACKGROUNDS.find(bg => bg.id === currentBackground) || BACKGROUNDS[0];
  const currentBgUrl = currentBg.url;

  const handleBackgroundChange = (bgId) => {
    setCurrentBackground(bgId);
    setShowWallpaperPicker(false);
  };

  // Unified sound list for settings
  const soundCategories = SOUND_CATEGORIES;

  return (
    <div className={`App${isMeditationMode ? ' meditation-active' : ''}${isReadingMode ? ' reading-active' : ''}`}>
      {currentBg.type === 'video' ? (
        <video
          className="background-image background-video"
          src={currentBgUrl}
          poster={currentBg.poster}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div
          className="background-image"
          style={{ backgroundImage: `url('${currentBgUrl}')` }}
        ></div>
      )}

      {/* Top Volume Popup */}
      <AnimatePresence>
        {showVolumePopup && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            style={{ 
              position: 'absolute', 
              top: '40px', 
              left: '50%', 
              x: '-50%',
              zIndex: 1000 
            }}
            onMouseMove={() => {
              if (window.volumePopupTimeout) clearTimeout(window.volumePopupTimeout);
              window.volumePopupTimeout = setTimeout(() => {
                setShowVolumePopup(false);
              }, 1000);
            }}
          >
            <GlassSurface borderRadius={24} width={240} height={60} blur={20} opacity={0.85} distortionScale={0} redOffset={0} greenOffset={0} blueOffset={0}>
              <ElasticSlider 
                defaultValue={volume} 
                onChange={(v) => {
                  setVolume(v);
                  if (window.volumePopupTimeout) clearTimeout(window.volumePopupTimeout);
                  window.volumePopupTimeout = setTimeout(() => {
                    setShowVolumePopup(false);
                  }, 1000);
                }}
                leftIcon={<VolumeX size={16} color="white" />}
                rightIcon={<Volume2 size={16} color="white" />}
              />
            </GlassSurface>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={isIpodMode ? "container ipod-shell glass" : "container"}
        initial={{ opacity: 0, scale: 0.95, x: 0, y: 0 }}
        animate={ipodControls}
        drag={isIpodMode && isDesktop}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{
          left: -window.innerWidth / 2 + 100,
          right: window.innerWidth / 2 - 100,
          top: -window.innerHeight / 2 + 100,
          bottom: window.innerHeight / 2 - 100,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
        whileDrag={{ scale: 1.02 }}
        style={{
          marginTop: isIpodMode ? (showVolumePopup ? '80px' : '40px') : undefined,
          transition: 'margin-top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.5s ease',
          cursor: (isIpodMode && isDesktop) ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      >
        {isIpodMode && (
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, borderRadius: 'inherit', pointerEvents: 'none'}}>
            <ShapeBlur
              variation={0}
              pixelRatioProp={window.devicePixelRatio || 1}
              shapeSize={1}
              roundness={0.5}
              borderSize={0.05}
              circleSize={0.25}
              circleEdge={1}
            />
          </div>
        )}
        <div className={isIpodMode ? "ipod-screen glass-inner" : "desktop-screen-bypass"} style={{ position: 'relative' }}>
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
                  <div className="settings-content" style={{ padding: '0.2rem' }}>
                    
                    <div className="apple-group-title">Sounds & Music</div>
                    <div className="apple-group">
                      <button 
                        className="apple-row"
                        onClick={() => setShowSoundPicker(true)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="apple-icon-wrapper bg-blue">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18V5l12-2v13" />
                              <circle cx="6" cy="18" r="3" />
                              <circle cx="18" cy="16" r="3" />
                            </svg>
                          </div>
                          <span>Focus Music</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.45)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {(() => {
                              for (const cat of soundCategories) {
                                if (cat.sounds[currentSound]) return cat.sounds[currentSound].name;
                              }
                              return 'Default';
                            })()}
                          </span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.75rem' }}>&rarr;</span>
                        </div>
                      </button>

                      <div className="apple-slider-row">
                        <div className="apple-slider-header">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="apple-icon-wrapper bg-green">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </svg>
                            </div>
                            <span>Volume</span>
                          </div>
                          <span className="apple-slider-val">{volume}%</span>
                        </div>
                        <div className="apple-slider-input-wrapper">
                          <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} />
                        </div>
                      </div>
                    </div>

                    <div className="apple-group-title">Ambient Mixer</div>
                    <div className="apple-group">
                      <div className="apple-slider-row">
                        <div className="apple-slider-header">
                          <span>Rain</span>
                          <span className="apple-slider-val">{rainVolume}%</span>
                        </div>
                        <div className="apple-slider-input-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={rainVolume}
                            onChange={(e) => setRainVolume(parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="apple-slider-row">
                        <div className="apple-slider-header">
                          <span>Ocean</span>
                          <span className="apple-slider-val">{wavesVolume}%</span>
                        </div>
                        <div className="apple-slider-input-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={wavesVolume}
                            onChange={(e) => setWavesVolume(parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="apple-slider-row">
                        <div className="apple-slider-header">
                          <span>White Noise</span>
                          <span className="apple-slider-val">{whiteNoiseVolume}%</span>
                        </div>
                        <div className="apple-slider-input-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={whiteNoiseVolume}
                            onChange={(e) => setWhiteNoiseVolume(parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="apple-group-title">Tools</div>
                    <div className="apple-group">
                      <button 
                        className="apple-row"
                        onClick={() => {
                          setShowSettings(false);
                          setShowNotesPanel(true);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="apple-icon-wrapper bg-purple">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </div>
                          <span>Notes & Logs</span>
                        </div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '0.75rem' }}>&rarr;</span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Focus Music Sound Picker sub-panel */}
          {isIpodMode && (
            <AnimatePresence>
              {showSoundPicker && (
                <motion.div
                  className="ipod-screen-panel"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                >
                  <div className="settings-header">
                    <button className="icon-button" onClick={() => setShowSoundPicker(false)} style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      &larr; Back
                    </button>
                    <h3>Focus Music</h3>
                    <div style={{ width: 40 }}></div>
                  </div>
                  <div className="settings-content" style={{ padding: '0.2rem' }}>
                    {soundCategories.map((category) => (
                      <div key={category.name} style={{ marginBottom: '0.4rem' }}>
                        <div className="apple-group-title">{category.name}</div>
                        <div className="apple-group">
                          {Object.entries(category.sounds).map(([key, sound]) => (
                            <button
                              key={key}
                              className="apple-row"
                              onClick={() => handleSoundChange(key)}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.6rem' }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.72rem' }}>{sound.name}</span>
                                <span style={{ fontSize: '0.55rem', color: 'rgba(255, 255, 255, 0.45)' }}>{sound.description}</span>
                              </div>
                              {currentSound === key && (
                                <span style={{ color: '#34c759', fontWeight: 'bold', fontSize: '0.75rem' }}>✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
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
                            style={{ backgroundImage: `url('${bg.type === 'video' ? bg.poster : bg.url}')` }}
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
          {isIpodMode && (
            <AnimatePresence>
              {showNotesPanel && (
                <NotesPanel 
                  isOpen={showNotesPanel} 
                  onClose={() => setShowNotesPanel(false)} 
                  currentMode={currentMode}
                />
              )}
            </AnimatePresence>
          )}
          {isIpodMode && (
            <AnimatePresence>
              {showSnakePanel && (
                <SnakeGame 
                  isOpen={showSnakePanel} 
                  onClose={() => setShowSnakePanel(false)} 
                  timeLeft={timeLeft}
                  isWorkSession={isWorkSession}
                />
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
            {/* Play Snake Game shortcut button during Pomodoro Break */}
            {(!isWorkSession && !isMeditationMode && !isReadingMode) && (
              <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  className="glass-btn"
                  style={{ padding: '0.45rem 0.8rem', borderRadius: '10px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => setShowSnakePanel(true)}
                >
                  <span>Play Snake</span>
                </button>
              </div>
            )}
            <AmbientWaveform 
              isRunning={isRunning}
              isMeditationMode={isMeditationMode}
              breathLabels={breathLabels}
              breathPhaseIndex={breathPhaseIndex}
              themeColor={
                isMeditationMode 
                  ? 'rgba(196, 167, 255, 0.6)' 
                  : isReadingMode 
                    ? 'rgba(253, 186, 116, 0.6)' 
                    : 'rgba(147, 197, 253, 0.6)'
              }
            />
            {/* Breathing guide – shown only in meditation mode */}
            {isMeditationMode && (
              <div className={`breath-guide breath-${getPhaseClass(breathLabels[breathPhaseIndex])}`}>
                <div
                  className="breath-orb"
                  style={getBreathOrbStyle()}
                ></div>
                <div className="breath-text">
                  <span className="breath-label">{breathLabels[breathPhaseIndex]}</span>
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

              {/* Breathing Exercise Selection */}
              <div className="breathing-settings-section">
                <div className="settings-divider"></div>
                <h3 className="interval-title" style={{ marginTop: '1.25rem' }}>Breathing Exercise</h3>
                <div className="breathing-presets-scroll">
                  {BREATHING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className={`breathing-preset-btn ${selectedPresetId === preset.id ? 'active' : ''}`}
                      onClick={() => handlePresetChange(preset.id)}
                    >
                      <div className="preset-name">{preset.name}</div>
                      <div className="preset-subtitle">{preset.subtitle}</div>
                    </button>
                  ))}
                </div>
                
                {/* Preset Information / Scientific Explanation */}
                {BREATHING_PRESETS.find(p => p.id === selectedPresetId) && (
                  <div className="breathing-info-card">
                    <p className="breathing-description">
                      {BREATHING_PRESETS.find(p => p.id === selectedPresetId).description}
                    </p>
                  </div>
                )}

                {/* Phase Adjusters */}
                <div className="breathing-adjusters-container">
                  <h4 className="adjusters-title">Adjust Cycle Durations</h4>
                  <div className="adjusters-grid">
                    {breathLabels.map((label, idx) => (
                      <div key={idx} className="phase-adjuster">
                        <span className="phase-label">{label}</span>
                        <div className="adjuster-controls">
                          <button
                            className="adjuster-btn"
                            onClick={() => handlePhaseDurationChange(idx, breathCycle[idx] - 1)}
                            disabled={breathCycle[idx] <= 1}
                          >
                            -
                          </button>
                          <span className="phase-seconds-value">{breathCycle[idx]}s</span>
                          <button
                            className="adjuster-btn"
                            onClick={() => handlePhaseDurationChange(idx, breathCycle[idx] + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
            <div 
              ref={wheelRef}
              className="ipod-wheel"
              onMouseDown={handleWheelStart}
              onMouseMove={handleWheelMove}
              onMouseUp={handleWheelEnd}
              onMouseLeave={handleWheelEnd}
              onTouchStart={handleWheelStart}
              onTouchMove={handleWheelMove}
              onTouchEnd={handleWheelEnd}
            >
              <button 
                className="wheel-btn wheel-top" 
                onClick={showSnakePanel ? () => window.handleSnakeDirection?.('UP') : () => setShowSettings(true)}
              >
                MENU
              </button>
              <button 
                className="wheel-btn wheel-bottom" 
                onClick={showSnakePanel ? () => window.handleSnakeDirection?.('DOWN') : () => setShowTasks(true)}
              >
                <ListTodo size={20} />
              </button>
              <button 
                className="wheel-btn wheel-left" 
                onClick={showSnakePanel ? () => window.handleSnakeDirection?.('LEFT') : handleToggleSound}
                onMouseMove={showSnakePanel ? undefined : () => {
                  setShowVolumePopup(true);
                  if (window.volumePopupTimeout) clearTimeout(window.volumePopupTimeout);
                  window.volumePopupTimeout = setTimeout(() => {
                    setShowVolumePopup(false);
                  }, 1000);
                }}
              >
                {showSnakePanel ? <span>&larr;</span> : (isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />)}
              </button>
              <button 
                className="wheel-btn wheel-right" 
                onClick={showSnakePanel ? () => window.handleSnakeDirection?.('RIGHT') : handleReset}
              >
                {showSnakePanel ? <span>&rarr;</span> : <RotateCcw size={24} />}
              </button>
              <button 
                className="wheel-center" 
                onClick={showSnakePanel ? () => window.handleSnakeAction?.() : handleStartPause}
              >
                {showSnakePanel ? <Play size={24} /> : (isRunning ? <Pause size={30} /> : <Play size={30} />)}
              </button>
            </div>
          </div>
        )}

      </motion.div>

      {/* MacOS Liquid Glass Dock (Desktop Screen Only) */}
      <div className="desktop-dock-container">
        <GlassSurface
          width="fit-content"
          height="fit-content"
          borderRadius={20}
          blur={15}
          opacity={0.8}
          className="desktop-dock-glass"
        >
          <button 
            className={`dock-item ${!isMeditationMode && !isReadingMode ? 'active' : ''}`}
            onClick={() => handleModeChange('25-5')}
            title="Study Mode"
          >
            <img src="https://i.pinimg.com/736x/6e/af/5e/6eaf5ebad6a39c116181be827e3f7165.jpg" alt="Study" className="dock-icon-img" />
            <span className="dock-tooltip">Study</span>
          </button>
          <button 
            className={`dock-item ${isMeditationMode ? 'active' : ''}`}
            onClick={() => handleModeChange('meditation-10')}
            title="Meditate Mode"
          >
            <img src="https://i.pinimg.com/1200x/e4/b7/f3/e4b7f3fa97db257a750ace0f8767091b.jpg" alt="Meditate" className="dock-icon-img" />
            <span className="dock-tooltip">Meditate</span>
          </button>
          <button 
            className={`dock-item ${isReadingMode ? 'active' : ''}`}
            onClick={() => handleModeChange('reading-20')}
            title="Read Mode"
          >
            <img src="https://i.pinimg.com/736x/4f/08/d0/4f08d073e27356b670e6523e45369b7c.jpg" alt="Read" className="dock-icon-img" />
            <span className="dock-tooltip">Read</span>
          </button>
        </GlassSurface>
      </div>

      <TaskTracker isOpen={showTasks} onClose={() => setShowTasks(false)} />
    </div>
  );
}

export default App;
