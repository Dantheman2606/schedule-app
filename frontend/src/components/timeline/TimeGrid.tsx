import React from 'react';
import './TimeGrid.css';

export const TimeGrid: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
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
