export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

// Data Transfer Object (DTO) for creating a new task
export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

// DTO for updating an existing task (all fields optional)
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
