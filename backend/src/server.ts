import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { initDatabase } from './db';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import visitorRoutes from './routes/visitors';
import attendanceRoutes from './routes/attendance';
import dashboardRoutes from './routes/dashboard';
import adminRequestRoutes from './routes/adminRequests';
import exportRoutes from './routes/export';
import databaseRoutes from './routes/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',  // Allows access from mobile browsers on same WiFi network
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check & Root Routes for Render Health Checker
app.get('/', (req: Request, res: Response) => {
  res.send('Glorious Apostolic Church India Council API Service is Live!');
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    organization: 'Glorious Apostolic Church India Council',
    system: 'Sunday Attendance Management System',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin/requests', adminRequestRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/database', databaseRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Initialize Database & Start Server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`===================================================================`);
    console.log(` Glorious Apostolic Church India Council - Backend Server Running`);
    console.log(` Environment: Production Ready | Timezone: IST (UTC+5:30)`);
    console.log(` Server URL:  http://localhost:${PORT}`);
    console.log(` Super Admin Email: gloriousapostolicchurch777@gmail.com`);
    console.log(`===================================================================`);
  });
}).catch(err => {
  console.error('Failed to initialize database server:', err);
});
