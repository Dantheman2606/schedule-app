import apiService from './api';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/task.types';

class TaskService {
  async getTasks(date: string): Promise<Task[]> {
    return apiService.get<Task[]>('/tasks', { date });
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    return apiService.post<Task>('/tasks', task);
  }

  async updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
    return apiService.patch<Task>(`/tasks/${id}`, updates);
  }

  async deleteTask(id: string): Promise<void> {
    console.log('TaskService.deleteTask called with id:', id);
    await apiService.delete(`/tasks/${id}`);
  }
}

export default new TaskService();
