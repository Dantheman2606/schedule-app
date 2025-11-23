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

  /**
   * Load all tasks for a specific date
   */
  const loadTasks = useCallback(async (date: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentDate(date);
      const loadedTasks = await taskService.getTasks(date);
      setTasks(loadedTasks.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
      console.error('TaskContext.loadTasks error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new task and refresh the task list
   */
  const createTask = async (task: CreateTaskInput) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.createTask(task);
      // Refetch all tasks after creation to ensure consistency
      const refreshedTasks = await taskService.getTasks(currentDate);
      setTasks(refreshedTasks.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      console.error('TaskContext.createTask error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing task and refresh the task list
   */
  const updateTask = async (id: string, updates: UpdateTaskInput) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.updateTask(id, updates);
      // Refetch all tasks after update to ensure consistency
      const refreshedTasks = await taskService.getTasks(currentDate);
      setTasks(refreshedTasks.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      console.error('TaskContext.updateTask error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a task and refresh the task list
   */
  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await taskService.deleteTask(id);
      // Refetch all tasks after deletion to ensure consistency
      const refreshedTasks = await taskService.getTasks(currentDate);
      setTasks(refreshedTasks.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      console.error('TaskContext.deleteTask error:', err);
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
