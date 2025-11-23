import React from 'react';
import { type Task } from '../../types/task.types';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { isTimeInRange } from '../../utils/timeUtils';
import './CurrentTaskDisplay.css';

interface CurrentTaskDisplayProps {
  tasks: Task[];
}

export const CurrentTaskDisplay: React.FC<CurrentTaskDisplayProps> = ({ tasks }) => {
  const { currentTime } = useCurrentTime();
  
  const currentTask = tasks.find(task => 
    isTimeInRange(currentTime, task.startTime, task.endTime)
  );

  if (!currentTask) {
    return (
      <div className="current-task-display empty">
        <div className="current-task-header">
          <span className="current-task-label">Current Task</span>
          <span className="current-task-time">{currentTime}</span>
        </div>
        <div className="current-task-empty">
          <p>No task scheduled right now</p>
          <span className="current-task-empty-icon">🎯</span>
        </div>
      </div>
    );
  }

  return (
    <div className="current-task-display" style={{ borderColor: currentTask.color }}>
      <div className="current-task-header">
        <span className="current-task-label">Current Task</span>
        <span className="current-task-time">{currentTime}</span>
      </div>
      <div className="current-task-content">
        <div 
          className="current-task-color-indicator" 
          style={{ backgroundColor: currentTask.color }}
        />
        <div className="current-task-info">
          <h2 className="current-task-title">{currentTask.title}</h2>
          <p className="current-task-schedule">
            {currentTask.startTime} - {currentTask.endTime}
          </p>
          {currentTask.description && (
            <p className="current-task-description">{currentTask.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
