export interface Task {
  _id: string;
  taskId: string;
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  color: string;
  icon?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  color: string;
  icon?: string;
  date: string;
}

export interface UpdateTaskInput {
  title?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  color?: string;
  icon?: string;
}
