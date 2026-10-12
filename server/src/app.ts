import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Load environment variables (.env) immediately
dotenv.config();

import taskRoutes from './routes/taskRoutes.js';
import { initDatabase, seedInitialData } from './db/database.js';
import { isSupabaseConfigured } from './db/supabase.js';

// Only initialize SQLite fallback if Supabase is NOT configured and not in Vercel
if (!isSupabaseConfigured && !process.env.VERCEL) {
  initDatabase();
  seedInitialData();
}

const app = express();

// 1. Cross-Origin Resource Sharing: allows frontend to access API
app.use(cors());

// 2. Body Parser: automatically parses incoming JSON payloads
app.use(express.json());

// 3. Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Kanban API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// 4. Mount Task API Routes
app.use('/api/tasks', taskRoutes);

// 5. Serve static frontend in production if client/dist exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, fs.existsSync(path.resolve(__dirname, '../../client/dist')) ? '../../client/dist' : '../../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Express 5 compatible SPA fallback middleware
  app.use((req: Request, res: Response, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

export default app;
