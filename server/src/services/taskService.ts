import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task.js';
import { db } from '../db/database.js';
import { supabase, isSupabaseConfigured } from '../db/supabase.js';
import { randomUUID } from 'node:crypto';

export const taskService = {
  // Retrieve all tasks
  async getAllTasks(): Promise<Task[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('createdAt', { ascending: true });

      if (error) {
        console.error('Supabase error fetching tasks:', error);
        throw error;
      }
      return (data || []) as Task[];
    }

    // Fallback to SQLite
    const query = db.prepare('SELECT * FROM tasks ORDER BY createdAt ASC');
    return query.all() as unknown as Task[];
  },

  // Find a task by unique ID
  async getTaskById(id: string): Promise<Task | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Supabase error fetching task by id:', error);
        throw error;
      }
      return (data as Task) || undefined;
    }

    // Fallback to SQLite
    const query = db.prepare('SELECT * FROM tasks WHERE id = ?');
    const task = query.get(id);
    return (task as unknown as Task) || undefined;
  },

  // Create a new task
  async createTask(dto: CreateTaskDTO): Promise<Task> {
    const id = randomUUID();
    const title = dto.title.trim();
    const description = dto.description?.trim() || '';
    const status = dto.status || 'TODO';
    const priority = dto.priority || 'MEDIUM';
    const now = new Date().toISOString();

    const newTask: Task = {
      id,
      title,
      description,
      status,
      priority,
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error('Supabase error inserting task:', error);
        throw error;
      }
      return data as Task;
    }

    // Fallback to SQLite
    const insert = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(id, title, description, status, priority, now, now);
    return newTask;
  },

  // Update existing task by ID
  async updateTask(id: string, dto: UpdateTaskDTO): Promise<Task | null> {
    const existing = await this.getTaskById(id);
    if (!existing) {
      return null;
    }

    const updatedTitle = dto.title !== undefined ? dto.title.trim() : existing.title;
    const updatedDescription = dto.description !== undefined ? dto.description.trim() : existing.description;
    const updatedStatus = dto.status !== undefined ? dto.status : existing.status;
    const updatedPriority = dto.priority !== undefined ? dto.priority : existing.priority;
    const updatedAt = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updatedTitle,
          description: updatedDescription,
          status: updatedStatus,
          priority: updatedPriority,
          updatedAt,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating task:', error);
        throw error;
      }
      return data as Task;
    }

    // Fallback to SQLite
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
  async deleteTask(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        console.error('Supabase error deleting task:', error);
        return false;
      }
      return true;
    }

    // Fallback to SQLite
    const deleteQuery = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteQuery.run(id);
    return Number(result.changes) > 0;
  },
};
