import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export default {
  PORT: process.env.PORT || 3000,
};
