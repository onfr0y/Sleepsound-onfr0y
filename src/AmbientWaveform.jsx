import React, { useEffect, useRef } from 'react';

export default function AmbientWaveform({ isRunning, isMeditationMode, breathLabels, breathPhaseIndex, themeColor }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;
    
    // Smooth interpolation variables
    let currentAmplitude = 5;
    let targetAmplitude = 5;
    let currentSpeed = 0.02;
    let targetSpeed = 0.02;
    
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
      }
      canvas.height = 35; // compact height for the visualizer strip inside iPod screen
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Determine target properties based on state
      if (!isRunning) {
        targetAmplitude = 2.5;
        targetSpeed = 0.006;
      } else if (!isMeditationMode) {
        // Study/Reading modes
        targetAmplitude = 9;
        targetSpeed = 0.025;
      } else {
        // Meditation Mode: React to breathing phase!
        const label = (breathLabels[breathPhaseIndex] || '').toLowerCase();
        if (label.includes('inhale')) {
          targetAmplitude = 18;
          targetSpeed = 0.04;
        } else if (label.includes('exhale')) {
          targetAmplitude = 5;
          targetSpeed = 0.012;
        } else if (label.includes('hold') || label.includes('sniff')) {
          // Stay expanded or small based on box breathing state
          const isHighHold = breathPhaseIndex === 1 || label.includes('high') || label.includes('inhale');
          targetAmplitude = isHighHold ? 18 : 5;
          targetSpeed = 0.005; // slow ripple during hold
        } else {
          targetAmplitude = 5;
          targetSpeed = 0.01;
        }
      }
      
      // Lerp toward targets for buttery smooth animations
      currentAmplitude += (targetAmplitude - currentAmplitude) * 0.04;
      currentSpeed += (targetSpeed - currentSpeed) * 0.04;
      
      phase += currentSpeed;
      
      // Draw 3 layers of waves with varying frequency and opacity
      const waves = [
        { freq: 0.018, amp: currentAmplitude, opacity: 0.15, offset: 0 },
        { freq: 0.028, amp: currentAmplitude * 0.6, opacity: 0.28, offset: Math.PI / 3 },
        { freq: 0.038, amp: currentAmplitude * 0.3, opacity: 0.42, offset: Math.PI * 2 / 3 }
      ];
      
      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = themeColor || 'rgba(196, 167, 255, 0.4)';
        ctx.lineWidth = w.opacity * 4; // varying line thickness
        ctx.globalAlpha = w.opacity;
        
        const centerY = canvas.height / 2;
        ctx.moveTo(0, centerY);
        
        for (let x = 0; x < canvas.width; x++) {
          // Sine wave formula: y = sin(x * freq + phase + offset) * amplitude
          const y = centerY + Math.sin(x * w.freq + phase + w.offset) * w.amp;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      });
      
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, isMeditationMode, breathPhaseIndex, breathLabels, themeColor]);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: '100%', 
        height: '35px', 
        display: 'block',
        margin: '0.15rem 0',
        pointerEvents: 'none'
      }} 
    />
  );
}
