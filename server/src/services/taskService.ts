import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task.js';
import { db } from '../db/database.js';
import { randomUUID } from 'node:crypto';

export const taskService = {
  // Retrieve all tasks from SQLite
  getAllTasks(): Task[] {
    const query = db.prepare('SELECT * FROM tasks ORDER BY createdAt ASC');
    return query.all() as unknown as Task[];
  },

  // Find a task by unique ID
  getTaskById(id: string): Task | undefined {
    const query = db.prepare('SELECT * FROM tasks WHERE id = ?');
    const task = query.get(id);
    return (task as unknown as Task) || undefined;
  },

  // Create a new task in SQLite
  createTask(dto: CreateTaskDTO): Task {
    const id = randomUUID();
    const title = dto.title.trim();
    const description = dto.description?.trim() || '';
    const status = dto.status || 'TODO';
    const priority = dto.priority || 'MEDIUM';
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(id, title, description, status, priority, now, now);

    return {
      id,
      title,
      description,
      status,
      priority,
      createdAt: now,
      updatedAt: now,
    };
  },

  // Update existing task by ID
  updateTask(id: string, dto: UpdateTaskDTO): Task | null {
    const existing = this.getTaskById(id);
    if (!existing) {
      return null;
    }

    const updatedTitle = dto.title !== undefined ? dto.title.trim() : existing.title;
    const updatedDescription = dto.description !== undefined ? dto.description.trim() : existing.description;
    const updatedStatus = dto.status !== undefined ? dto.status : existing.status;
    const updatedPriority = dto.priority !== undefined ? dto.priority : existing.priority;
    const updatedAt = new Date().toISOString();

    const updateQuery = db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, updatedAt = ?
      WHERE id = ?
    `);

    updateQuery.run(updatedTitle, updatedDescription, updatedStatus, updatedPriority, updatedAt, id);

    return {
      ...existing,
      title: updatedTitle,
      description: updatedDescription,
      status: updatedStatus,
      priority: updatedPriority,
      updatedAt,
    };
  },

  // Delete a task by ID
  deleteTask(id: string): boolean {
    const deleteQuery = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteQuery.run(id);
    return Number(result.changes) > 0;
  },
};
