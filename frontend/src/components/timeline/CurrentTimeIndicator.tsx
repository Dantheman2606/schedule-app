import React, { useEffect } from 'react';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import './CurrentTimeIndicator.css';

export const CurrentTimeIndicator: React.FC = () => {
  const { currentMinutes } = useCurrentTime();
  
  // Position in pixels = minutes since midnight
  // 1 minute = 1 pixel, so 11:41 = 701 minutes = 701px from top
  const positionInPixels = currentMinutes;
  
  const hours = Math.floor(currentMinutes / 60);
  const mins = Math.round(currentMinutes % 60);
  console.log(`Current time: ${hours}:${mins.toString().padStart(2, '0')} = ${currentMinutes} minutes = ${positionInPixels}px`);

  useEffect(() => {
    // Scroll to current time on mount
    const indicator = document.getElementById('current-time-indicator');
    if (indicator) {
      indicator.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div 
      id="current-time-indicator"
      className="current-time-indicator"
    >
      <div className="current-time-line" style={{ top: `${positionInPixels}px` }} />
      <div className="current-time-dot" style={{ top: `${positionInPixels}px` }} />
    </div>
  );
};
