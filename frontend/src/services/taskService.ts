import apiService from './api';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/task.types';

class TaskService {
  /**
   * GET /api/tasks?date=YYYY-MM-DD
   * Fetch all tasks for a specific date
   */
  async getTasks(date: string): Promise<Task[]> {
    try {
      const tasks = await apiService.get<Task[]>('/tasks', { date });
      return tasks;
    } catch (error) {
      throw new Error('Failed to fetch tasks');
    }
  }

  /**
   * POST /api/tasks
   * Create a new task
   */
  async createTask(task: CreateTaskInput): Promise<Task> {
    try {
      const newTask = await apiService.post<Task>('/tasks', task);
      return newTask;
    } catch (error) {
      throw new Error('Failed to create task');
    }
  }

  /**
   * PATCH /api/tasks/:id
   * Update an existing task by ID (supports both _id and taskId)
   */
  async updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
    try {
      const updatedTask = await apiService.patch<Task>(`/tasks/${id}`, updates);
      return updatedTask;
    } catch (error) {
      throw new Error('Failed to update task');
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete a task by ID (supports both _id and taskId)
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await apiService.delete<{ message: string }>(`/tasks/${id}`);
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  }
}

export default new TaskService();
