import React from 'react';
import './TimeGrid.css';

export const TimeGrid: React.FC = () => {
  const hours = Array.from({ length: 25 }, (_, i) => i);

  const formatHour = (hour: number): string => {
    const displayHour = hour === 24 ? 0 : hour;
    return `${displayHour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="time-grid">
      {hours.map((hour) => (
        <div key={hour} className="time-slot">
          <div className="time-label">{formatHour(hour)}</div>
          <div className="time-line" />
        </div>
      ))}
    </div>
  );
};
