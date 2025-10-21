import 'reflect-metadata';
import dotenv from 'dotenv';
import { createApp } from './app';
import { TypeormDataSource } from './config/typeorm';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await TypeormDataSource.initialize();
    console.log('Database connection established');

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
