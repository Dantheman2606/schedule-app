import { useState, useEffect } from 'react';
import { getCurrentMinutesSinceMidnight, getCurrentTimeString } from '../utils/timeUtils';

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTimeString());
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutesSinceMidnight());

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeString());
      setCurrentMinutes(getCurrentMinutesSinceMidnight());
    };

    // Update immediately
    updateTime();

    // Update every 60 seconds
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return { currentTime, currentMinutes };
};
