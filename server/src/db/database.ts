import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

// Allow database path override (e.g. ':memory:' for isolated testing)
const dbPath = process.env.DATABASE_PATH || path.resolve(process.cwd(), 'kanban.db');

let _db: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(dbPath);
  }
  return _db;
}

// Backward-compatible lazy getter
export const db = {
  prepare(sql: string) {
    return getDatabase().prepare(sql);
  },
  exec(sql: string) {
    return getDatabase().exec(sql);
  },
};

// Initialize schema: Create tables and indexes if they don't already exist
export function initDatabase() {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK(status IN ('TODO', 'IN_PROGRESS', 'DONE')),
      priority TEXT NOT NULL CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  `);
}

// Seed initial tasks if table is empty
export function seedInitialData() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number };
  if (countRow.count === 0) {
    const insert = db.prepare(`
      INSERT INTO tasks (id, title, description, status, priority, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    insert.run('1', 'Set up project architecture', 'Configure TypeScript, Express server, and project folders.', 'DONE', 'HIGH', now, now);
    insert.run('2', 'Implement Task REST API', 'Create CRUD endpoints for managing Kanban tasks.', 'DONE', 'HIGH', now, now);
    insert.run('3', 'Build React UI with Vite', 'Create drag-and-drop or column layout for tasks in the browser.', 'TODO', 'MEDIUM', now, now);
  }
}
