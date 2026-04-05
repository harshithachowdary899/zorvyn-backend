import app from './app';
import { generateSchema } from './db/schema';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await generateSchema();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
