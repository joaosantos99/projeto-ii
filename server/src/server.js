import express, { Router } from 'express';
import cors from "cors";

import sequelize from './database/connection.js';
import env from './env.js';

import usersRouter from './routers/users.js'
import spacesRouter from './routers/spaces.js'

const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = Router();
app.use('/api', apiRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/spaces', spacesRouter);

apiRouter.get('/health', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).json({status: "ok"});
})

app.listen(env.PORT, () => {
  // Check if the database is connected
  sequelize.authenticate().then(() => {
    console.log('Connection to the database has been established successfully.');
  }).catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  console.log(`Server is running on port ${env.PORT}`);
});
