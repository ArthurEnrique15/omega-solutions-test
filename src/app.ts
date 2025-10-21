import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(routes);

  return app;
};
