import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export default {
  // Server
  PORT: process.env.PORT || 3000,

  // Database
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,

  // Cache (Dragonfly / Redis-compatible). When unset, auth falls back to the DB only.
  CACHE_URL: process.env.CACHE_URL,
  CACHE_HOST: process.env.CACHE_HOST,
  CACHE_PORT: Number(process.env.CACHE_PORT) || 6379,

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || 'no-reply@cm-viladoconde.pt',

  // Object storage (Hetzner S3-compatible)
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_REGION: process.env.S3_REGION || 'eu-central',
  S3_BUCKET: process.env.S3_BUCKET,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
};
