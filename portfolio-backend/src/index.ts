import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { corsMiddleware } from './middlewares/cors.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { rateLimiter } from './middlewares/rate-limit.middleware';
import { requestLogger } from './middlewares/logger.middleware';
import blogRouter from './routes/blog.routes';
import contactRouter from './routes/contact.routes';
import mindscapeRouter from './routes/mindscape.routes';

// Load environment variables (development only)
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.join(__dirname, '../.env');
  console.log('🔍 Loading .env from:', envPath);
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.warn('⚠️  No .env file found (this is OK in production)');
  } else {
    console.log('✅ .env loaded successfully');
  }
} else {
  console.log('🚀 Production mode: Using environment variables from Railway');
}

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 8080;

// Trust proxy (important for deployment platforms)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS middleware
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/blog', blogRouter);
app.use('/api/contact', contactRouter);
app.use('/api/mindscape', mindscapeRouter);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Portfolio Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      blog: {
        posts: 'GET /api/blog/posts',
        post: 'GET /api/blog/post/:slug',
      },
      contact: {
        submit: 'POST /api/contact',
      },
      mindscape: {
        public: 'GET /api/mindscape/public',
        all: 'GET /api/mindscape/admin/all (admin only)',
      },
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
