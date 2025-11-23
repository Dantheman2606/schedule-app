import React, { useEffect } from 'react';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import './CurrentTimeIndicator.css';

export const CurrentTimeIndicator: React.FC = () => {
  const { currentMinutes } = useCurrentTime();
  
  // Each hour is 60px, so calculate position in pixels
  // currentMinutes is minutes since midnight (0-1439)
  // Position in pixels = (currentMinutes / 60) * 60px per hour
  const positionInPixels = currentMinutes;
  
  console.log('Current minutes:', currentMinutes, 'Position:', positionInPixels + 'px');

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
      style={{ top: `${positionInPixels}px` }}
    >
      <div className="current-time-line" />
      <div className="current-time-dot" />
    </div>
  );
};
