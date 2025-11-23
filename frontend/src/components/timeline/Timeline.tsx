import React, { useState, useCallback, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { TimeGrid } from './TimeGrid';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { TaskBlock } from './TaskBlock';
import { TaskForm } from './TaskForm';
import { OverlapWarning } from './OverlapWarning';
import { type Task, type CreateTaskInput } from '../../types/task.types';
import { minutesToTime } from '../../utils/timeUtils';
import './Timeline.css';

interface TimelineProps {
  date: string;
  showNewTaskForm?: boolean;
  onCloseNewTaskForm?: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ date, showNewTaskForm, onCloseNewTaskForm }) => {
  const { tasks, createTask, updateTask, deleteTask, loadTasks, getOverlappingTasks } = useTasks();
  const { dragState, handleDragStart, handleDragEnd, calculateDropTime } = useDragAndDrop();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStartTime, setDefaultStartTime] = useState<string>('09:00');
  const [showOverlapWarning, setShowOverlapWarning] = useState(false);
  const [overlappingTasks, setOverlappingTasks] = useState<Task[]>([]);
  const [pendingTask, setPendingTask] = useState<CreateTaskInput | null>(null);
  const [pendingEditTask, setPendingEditTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks(date);
  }, [date, loadTasks]);

  useEffect(() => {
    if (showNewTaskForm) {
      setEditingTask(null);
      setIsFormOpen(true);
    }
  }, [showNewTaskForm]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.className === 'timeline-wrapper' || target.className === 'time-grid') {
      const wrapper = e.currentTarget.querySelector('.timeline-wrapper') as HTMLElement;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const y = e.clientY - rect.top;
        // Direct pixel to minute conversion (1px = 1 minute)
        const minutes = Math.floor(y);
        // Round to nearest 15 minutes
        const roundedMinutes = Math.round(minutes / 15) * 15;
        const timeString = minutesToTime(Math.min(roundedMinutes, 1440));
        
        setDefaultStartTime(timeString);
        setEditingTask(null);
        setIsFormOpen(true);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        // Error is already handled in TaskContext
      }
    }
  }, [deleteTask]);

  const handleFormSubmit = async (taskData: CreateTaskInput) => {
    // When editing, create a combined object with task data and IDs for overlap checking
    const taskToCheck = editingTask 
      ? { ...taskData, _id: editingTask._id, taskId: editingTask.taskId } as Task
      : taskData;
    
    const overlaps = getOverlappingTasks(taskToCheck);
    
    if (overlaps.length > 0) {
      setOverlappingTasks(overlaps);
      setPendingTask(taskData);
      setPendingEditTask(editingTask); // Store the editing context
      setShowOverlapWarning(true);
      return;
    }

    await submitTask(taskData);
  };

  const submitTask = async (taskData: CreateTaskInput) => {
    try {
      if (editingTask) {
        // For updates, exclude the date field
        const { date, ...updateData } = taskData;
        const taskIdentifier = editingTask.taskId || editingTask._id;
        await updateTask(taskIdentifier, updateData);
      } else {
        await createTask(taskData);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      // Error is already handled in TaskContext
    }
  };

  const handleOverlapProceed = async () => {
    if (pendingTask) {
      try {
        if (pendingEditTask) {
          // This was an edit operation
          const { date, ...updateData } = pendingTask;
          const taskIdentifier = pendingEditTask.taskId || pendingEditTask._id;
          await updateTask(taskIdentifier, updateData);
        } else {
          // This was a create operation
          await createTask(pendingTask);
        }
        setIsFormOpen(false);
        setEditingTask(null);
      } catch (error) {
        // Error is already handled in TaskContext
      }
      setShowOverlapWarning(false);
      setPendingTask(null);
      setPendingEditTask(null);
      setOverlappingTasks([]);
    }
  };

  const handleOverlapCancel = () => {
    setShowOverlapWarning(false);
    setPendingTask(null);
    setPendingEditTask(null);
    setOverlappingTasks([]);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!dragState.draggedTask) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = y / rect.height;
    const minutes = Math.floor(percentage * 1440);
    const roundedMinutes = Math.round(minutes / 15) * 15;
    const targetTime = minutesToTime(roundedMinutes);

    const { startTime, endTime } = calculateDropTime(targetTime, dragState.draggedTask);

    try {
      const taskIdentifier = dragState.draggedTask.taskId || dragState.draggedTask._id;
      await updateTask(taskIdentifier, { startTime, endTime });
    } catch (error) {
      // Error is already handled in TaskContext
    }

    handleDragEnd();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2 className="timeline-date">{new Date(date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</h2>
      </div>
      
      <div
        className="timeline-content"
        onClick={handleTimelineClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <TimeGrid />
        <CurrentTimeIndicator />
        
        {tasks.map((task) => {
          const overlaps = getOverlappingTasks(task);
          return (
            <TaskBlock
              key={task.taskId || task._id}
              task={task}
              hasOverlap={overlaps.length > 0}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task.taskId || task._id)}
              onDragStart={() => handleDragStart(task)}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </div>

      {isFormOpen && (
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
            onCloseNewTaskForm?.();
          }}
          onSubmit={handleFormSubmit}
          initialData={editingTask}
          defaultStartTime={defaultStartTime}
          date={date}
        />
      )}

      {showOverlapWarning && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 2000, maxWidth: '500px' }}>
          <OverlapWarning
            overlappingTasks={overlappingTasks}
            onProceed={handleOverlapProceed}
            onCancel={handleOverlapCancel}
          />
        </div>
      )}
    </div>
  );
};
