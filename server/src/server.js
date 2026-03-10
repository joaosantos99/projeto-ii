import express from 'express';
import cors from "cors";

import sequelize from './database/connection.js';
import env from './env.js';

const app = express();
app.use(cors())


app.listen(env.PORT, () => {
  // Check if the database is connected
  sequelize.authenticate().then(() => {
    console.log('Connection to the database has been established successfully.');
  }).catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  console.log(`Server is running on port ${env.PORT}`);
});
