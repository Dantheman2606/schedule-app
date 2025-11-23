import React from 'react';
import { type Task } from '../../types/task.types';
import './OverlapWarning.css';

interface OverlapWarningProps {
  overlappingTasks: Task[];
  onProceed: () => void;
  onCancel: () => void;
}

export const OverlapWarning: React.FC<OverlapWarningProps> = ({
  overlappingTasks,
  onProceed,
  onCancel,
}) => {
  if (overlappingTasks.length === 0) return null;

  return (
    <div className="overlap-warning">
      <div className="overlap-warning-icon">⚠</div>
      <div className="overlap-warning-content">
        <h4 className="overlap-warning-title">Time Conflict Detected</h4>
        <p className="overlap-warning-message">
          This task overlaps with {overlappingTasks.length} other task{overlappingTasks.length > 1 ? 's' : ''}:
        </p>
        <ul className="overlap-warning-list">
          {overlappingTasks.map((task) => (
            <li key={task.taskId || task._id}>
              <strong>{task.title}</strong> ({task.startTime} - {task.endTime})
            </li>
          ))}
        </ul>
        <div className="overlap-warning-actions">
          <button type="button" className="overlap-warning-button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="overlap-warning-button primary" onClick={onProceed}>
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
