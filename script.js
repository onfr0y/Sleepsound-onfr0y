// Timer State
let timerInterval = null;
let isRunning = false;
let currentMode = '25-5'; // '25-5' or '50-10'
let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let timeLeft = workTime;
let isWorkSession = true;
let totalTime = workTime;
let youtubePlayer = null;
let isSoundEnabled = true;
let volume = 50;

// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const sessionType = document.getElementById('session-type');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const progressBar = document.getElementById('progress-bar');
const mode25_5Btn = document.getElementById('mode-25-5');
const mode50_10Btn = document.getElementById('mode-50-10');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const settingsPanel = document.getElementById('settings-panel');
const soundBtn = document.getElementById('sound-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');

// Initialize YouTube Player
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'pQI64hD2sJw',
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': 'pQI64hD2sJw',
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'playsinline': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.setVolume(volume);
    if (isSoundEnabled) {
        event.target.playVideo();
    }
    updateSoundButton();
}

function onPlayerStateChange(event) {
    // Auto-restart if video ends (though loop should handle this)
    if (event.data === YT.PlayerState.ENDED) {
        event.target.playVideo();
    }
}

// Timer Functions
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startPauseBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                // Session finished
                clearInterval(timerInterval);
                isRunning = false;
                
                // Switch between work and break
                isWorkSession = !isWorkSession;
                
                if (isWorkSession) {
                    // Starting work session
                    sessionType.textContent = 'Work';
                    timeLeft = workTime;
                    totalTime = workTime;
                    timerDisplay.classList.add('pulse');
                } else {
                    // Starting break session
                    sessionType.textContent = 'Break';
                    timeLeft = breakTime;
                    totalTime = breakTime;
                    timerDisplay.classList.add('pulse');
                }
                
                setTimeout(() => {
                    timerDisplay.classList.remove('pulse');
                }, 500);
                
                updateDisplay();
                startPauseBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Start</span>';
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startPauseBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Start</span>';
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isWorkSession = true;
    sessionType.textContent = 'Work';
    timeLeft = workTime;
    totalTime = workTime;
    updateDisplay();
    startPauseBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Start</span>';
}

function setMode(mode) {
    if (mode === '25-5') {
        currentMode = '25-5';
        workTime = 25 * 60;
        breakTime = 5 * 60;
        mode25_5Btn.classList.add('active');
        mode50_10Btn.classList.remove('active');
    } else {
        currentMode = '50-10';
        workTime = 50 * 60;
        breakTime = 10 * 60;
        mode25_5Btn.classList.remove('active');
        mode50_10Btn.classList.add('active');
    }
    
    // Reset timer with new mode
    resetTimer();
}

// Event Listeners
startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', () => {
    resetTimer();
});

mode25_5Btn.addEventListener('click', () => {
    setMode('25-5');
});

mode50_10Btn.addEventListener('click', () => {
    setMode('50-10');
});

settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('show');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('show');
});

// Close settings when clicking outside
settingsPanel.addEventListener('click', (e) => {
    if (e.target === settingsPanel) {
        settingsPanel.classList.remove('show');
    }
});

soundBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    updateSoundButton();
    
    if (youtubePlayer) {
        if (isSoundEnabled) {
            youtubePlayer.playVideo();
        } else {
            youtubePlayer.pauseVideo();
        }
    }
});

function updateSoundButton() {
    if (isSoundEnabled) {
        soundBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
    } else {
        soundBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
        `;
    }
}

volumeSlider.addEventListener('input', (e) => {
    volume = parseInt(e.target.value);
    volumeValue.textContent = `${volume}%`;
    
    if (youtubePlayer) {
        youtubePlayer.setVolume(volume);
    }
});

// Initialize
updateDisplay();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    } else if (e.code === 'KeyR' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        resetTimer();
    }
});
