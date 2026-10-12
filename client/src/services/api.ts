import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';

// Base URL leverages our Vite development proxy configured in vite.config.ts
const API_BASE = '/api/tasks';

export const taskApi = {
  // GET /api/tasks
  async getTasks(): Promise<Task[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) {
      throw new Error(`Failed to load tasks (Status: ${res.status})`);
    }
    const json = await res.json();
    return json.data;
  },

  // POST /api/tasks
  async createTask(dto: CreateTaskDTO): Promise<Task> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to create task');
    }
    return json.data;
  },

  // PUT /api/tasks/:id
  async updateTask(id: string, dto: UpdateTaskDTO): Promise<Task> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update task');
    }
    return json.data;
  },

  // DELETE /api/tasks/:id
  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message || 'Failed to delete task');
    }
  },
};
