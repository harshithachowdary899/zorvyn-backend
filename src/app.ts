import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import financeRoutes from './routes/finance.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Swagger docs before routes
setupSwagger(app);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Redirect root to api docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
