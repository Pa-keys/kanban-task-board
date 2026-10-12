import { Request, Response } from 'express';
import { taskService } from '../services/taskService.js';
import { TaskStatus, TaskPriority } from '../types/task.js';

const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const VALID_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const taskController = {
  // GET /api/tasks - Retrieve all tasks
  async getAll(req: Request, res: Response) {
    try {
      const tasks = await taskService.getAllTasks();
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error in taskController.getAll:', error);
      res.status(500).json({ success: false, message: 'Internal server error while fetching tasks', error: String(error) });
    }
  },

  // GET /api/tasks/:id - Retrieve single task
  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const task = await taskService.getTaskById(id);

      if (!task) {
        return res.status(404).json({ success: false, message: `Task with id '${id}' not found` });
      }

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error while fetching task' });
    }
  },

  // POST /api/tasks - Create a new task
  async create(req: Request, res: Response) {
    try {
      const { title, description, status, priority } = req.body;

      // Input Validation
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'A non-empty task "title" is required.' });
      }

      if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }

      if (priority && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority '${priority}'. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
        });
      }

      const newTask = await taskService.createTask({ title, description, status, priority });
      res.status(201).json({ success: true, data: newTask });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error while creating task' });
    }
  },

  // PUT /api/tasks/:id - Update an existing task
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { title, description, status, priority } = req.body;

      if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
        return res.status(400).json({ success: false, message: 'Title must be a non-empty string.' });
      }

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }

      if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority '${priority}'. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
        });
      }

      const updated = await taskService.updateTask(id, { title, description, status, priority });
      if (!updated) {
        return res.status(404).json({ success: false, message: `Task with id '${id}' not found` });
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error while updating task' });
    }
  },

  // DELETE /api/tasks/:id - Delete a task
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const deleted = await taskService.deleteTask(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: `Task with id '${id}' not found` });
      }

      res.status(200).json({ success: true, message: `Task '${id}' successfully deleted.` });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error while deleting task' });
    }
  },
};
