import React, { useEffect } from 'react';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { getTodayString } from '../../utils/dateUtils';
import './CurrentTimeIndicator.css';

interface CurrentTimeIndicatorProps {
  currentDate: string;
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ currentDate }) => {
  const { currentMinutes } = useCurrentTime();
  const isToday = currentDate === getTodayString();
  
  // Position in pixels = minutes since midnight
  // 1 minute = 1 pixel, so 11:41 = 701 minutes = 701px from top
  const positionInPixels = currentMinutes;

  useEffect(() => {
    // Scroll to current time on mount
    if (!isToday) return;
    const indicator = document.getElementById('current-time-indicator');
    if (indicator) {
      indicator.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isToday]);

  // Don't show current time indicator for future dates
  if (!isToday) {
    return null;
  }

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
