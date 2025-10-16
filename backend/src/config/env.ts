import 'dotenv/config';

export const env = {
  node: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/merndb',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5174'
};