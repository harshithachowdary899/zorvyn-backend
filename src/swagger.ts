import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

// Read JSON synchronously
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/swagger.json'), 'utf8'));

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger API Docs available at /api-docs');
};
