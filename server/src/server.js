import express, { Router } from 'express';
import cors from "cors";
import swaggerUi from 'swagger-ui-express';

import sequelize from './database/connection.js';
import './database/models/index.js';
import env from './env.js';
import openapiSpec from './openapi.js';

import usersRouter from './routers/users.js'
import spacesRouter from './routers/spaces.js'
import authRouter from './routers/auth.js'
import rolesRouter from './routers/roles.js'
import permissionsRouter from './routers/permissions.js'
import reportsRouter from './routers/reports.js'
import sensorsRouter from './routers/sensors.js'
import alertsRouter from './routers/alerts.js'
import maintenanceRouter from './routers/maintenance.js'

const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = Router();
app.use('/api', apiRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/docs.json', (_req, res) => res.json(openapiSpec));

apiRouter.use('/users', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/spaces', spacesRouter);
apiRouter.use('/roles', rolesRouter);
apiRouter.use('/permissions', permissionsRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/sensors', sensorsRouter);
apiRouter.use('/alerts', alertsRouter);
apiRouter.use('/maintenance', maintenanceRouter);

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
