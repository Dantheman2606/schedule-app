import { useState, useCallback } from 'react';
import { type Task } from '../types/task.types';
import { timeToMinutes, minutesToTime, calculateDuration } from '../utils/timeUtils';

interface DragState {
  draggedTask: Task | null;
  dropTargetTime: string | null;
  isDragging: boolean;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    draggedTask: null,
    dropTargetTime: null,
    isDragging: false,
  });

  const handleDragStart = useCallback((task: Task) => {
    setDragState({
      draggedTask: task,
      dropTargetTime: null,
      isDragging: true,
    });
  }, []);

  const handleDragOver = useCallback((targetTime: string) => {
    setDragState((prev) => ({
      ...prev,
      dropTargetTime: targetTime,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedTask: null,
      dropTargetTime: null,
      isDragging: false,
    });
  }, []);

  const calculateDropTime = useCallback((targetTime: string, task: Task): { startTime: string; endTime: string } => {
    const duration = calculateDuration(task.startTime, task.endTime);
    const newStartMinutes = timeToMinutes(targetTime);
    const newEndMinutes = newStartMinutes + duration;

    return {
      startTime: minutesToTime(newStartMinutes),
      endTime: minutesToTime(newEndMinutes),
    };
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    calculateDropTime,
  };
};
