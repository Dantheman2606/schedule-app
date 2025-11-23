import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import taskService from '../services/taskService';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/task.types';

interface TaskContextType {
  tasks: Task[];
  currentTask: Task | null;
  createTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  loadTasks: (date: string) => Promise<void>;
  getOverlappingTasks: (task: Task | CreateTaskInput) => Task[];
  isLoading: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async (date: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentDate(date);
      const loadedTasks = await taskService.getTasks(date);
      setTasks(loadedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = async (task: CreateTaskInput) => {
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await taskService.createTask(task);
      setTasks((prev) => [...prev, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (err) {
      setError('Failed to create task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, updates: UpdateTaskInput) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('TaskContext.updateTask called with:', { id, updates });
      await taskService.updateTask(id, updates);
      console.log('Task updated successfully, refetching tasks...');
      // Refetch all tasks to ensure UI is in sync
      const allTasks = await taskService.getTasks(currentDate);
      setTasks(allTasks.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (err) {
      console.error('TaskContext.updateTask error:', err);
      setError('Failed to update task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('TaskContext.deleteTask called with id:', id);
      await taskService.deleteTask(id);
      console.log('Task deleted successfully, removing from state');
      // Remove from state using either taskId or _id
      setTasks((prev) => prev.filter((task) => task.taskId !== id && task._id !== id));
    } catch (err) {
      console.error('TaskContext.deleteTask error:', err);
      setError('Failed to delete task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getOverlappingTasks = useCallback((targetTask: Task | CreateTaskInput): Task[] => {
    return tasks.filter((task) => {
      // Skip comparing with itself if it's an existing task (check both IDs)
      if ('_id' in targetTask && 'taskId' in targetTask) {
        if (task._id === targetTask._id || task.taskId === targetTask.taskId) {
          return false;
        }
      }
      
      // Check for overlap
      return (
        task.startTime < targetTask.endTime &&
        task.endTime > targetTask.startTime
      );
    });
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        currentTask: null,
        createTask,
        updateTask,
        deleteTask,
        loadTasks,
        getOverlappingTasks,
        isLoading,
        error,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
