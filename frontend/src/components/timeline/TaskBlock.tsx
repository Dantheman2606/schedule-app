import React from 'react';
import { type Task } from '../../types/task.types';
import { timeToMinutes, isTimeInRange } from '../../utils/timeUtils';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import './TaskBlock.css';

interface TaskBlockProps {
  task: Task;
  hasOverlap: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const TaskBlock: React.FC<TaskBlockProps> = ({
  task,
  hasOverlap,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const { currentTime } = useCurrentTime();
  
  const startMinutes = timeToMinutes(task.startTime);
  const endMinutes = timeToMinutes(task.endTime);
  const duration = endMinutes - startMinutes;
  
  // Calculate position and height in pixels (1 minute = 1 pixel, since each hour is 60px)
  const top = startMinutes;
  const height = duration;
  
  const isActive = isTimeInRange(currentTime, task.startTime, task.endTime);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.taskId || task._id);
    onDragStart();
  };

  return (
    <div
      className={`task-block ${isActive ? 'task-block-active' : ''} ${hasOverlap ? 'task-block-overlap' : ''}`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: task.color,
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onEdit}
    >
      <div className="task-block-content">
        <div className="task-block-header">
          <span className="task-block-time">
            {task.startTime} - {task.endTime}
          </span>
          {hasOverlap && <span className="task-block-warning">⚠</span>}
        </div>
        <h3 className="task-block-title">{task.title}</h3>
        {task.description && (
          <p className="task-block-description">{task.description}</p>
        )}
      </div>
      <button
        className="task-block-delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ×
      </button>
    </div>
  );
};
