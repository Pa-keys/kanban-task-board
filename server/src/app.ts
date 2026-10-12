import express, { Request, Response } from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import { initDatabase, seedInitialData } from './db/database.js';

// Initialize SQLite database schema and seed data
initDatabase();
seedInitialData();

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

export default app;
