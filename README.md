# Study Sound - Pomodoro Timer

A beautiful glassmorphism-styled Pomodoro timer React app for focused studying with background music.

## Features

- **Glassmorphism Design**: Modern, translucent UI with blur effects matching the art museum aesthetic
- **Pomodoro Timer**: Two timer modes available:
  - 25 minutes work / 5 minutes break
  - 50 minutes work / 10 minutes break
- **Background Music**: Plays ambient study music from YouTube in the background
- **Background Image**: Beautiful art museum interior as the backdrop
- **Progress Bar**: Visual progress indicator for current session
- **Sound Controls**: Toggle background music on/off
- **Volume Control**: Adjustable volume slider in settings
- **Keyboard Shortcuts**:
  - `Space`: Start/Pause timer
  - `Ctrl/Cmd + R`: Reset timer

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser (Vite will auto-open it)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## Project Structure

```
study-sound/
├── index.html             # HTML template (Vite entry point)
├── vite.config.js         # Vite configuration
├── src/
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # React entry point
│   └── index.css          # Styles and glassmorphism effects
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Usage

1. Select your preferred timer mode (25/5 or 50/10)
2. Click "Start" to begin your study session
3. The timer will automatically switch between work and break sessions
4. Use the settings button (gear icon) to adjust volume
5. Toggle sound on/off with the sound button

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection (for YouTube API and background image)

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional, for command line deployment):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard** (Recommended):
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository: `onfr0y/Sleepsound-onfr0y`
   - Vercel will auto-detect it's a React app
   - Click "Deploy"

3. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to deploy.

4. **Environment Variables** (if needed):
   - No environment variables required for this app
   - YouTube API is loaded directly from Google's CDN

Your app will be live at: `https://your-project-name.vercel.app`

## Notes

- The background music uses the YouTube IFrame API
- The timer runs in your browser - refreshing the page will reset it
- Background image and music are loaded from external sources
- Built with React 18 and Vite for fast development and optimized builds
- Optimized for Vercel deployment with proper routing and caching
