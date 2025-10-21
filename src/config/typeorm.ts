import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const entityPath = isProduction ? 'dist/database/entities/**/*.js' : 'src/database/entities/**/*.ts';
const migrationPath = isProduction ? 'dist/database/migrations/**/*.js' : 'src/database/migrations/**/*.ts';

export const TypeormDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'omega_db',
  synchronize: false,
  logging: false,
  entities: [entityPath],
  migrations: [migrationPath],
  migrationsRun: true,
  subscribers: [],
});
