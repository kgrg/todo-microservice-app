import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import { env } from './config/env.config';
import { swaggerSpec } from './config/swagger';

// Create Express app
export const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API Documentation
if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Expose swagger.json
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(env.PORT, () => {
    logger.info(`Auth service running on port ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    if (env.NODE_ENV !== 'production') {
      logger.info(`API Documentation available at http://localhost:${env.PORT}/api-docs`);
    }
  });
}

export default app; 