import Alerts from './Alerts.js';
import GreenSpaces from './GreenSpaces.js';
import GreenSpaceZones from './GreenSpaceZones.js';
import MaintenanceTasks from './MaintenanceTasks.js';
import PasswordResetTokens from './PasswordResetTokens.js';
import Reports from './Reports.js';
import Roles from './Roles.js';
import SensorReadingMetas from './SensorReadingMetas.js';
import Sensors from './Sensors.js';
import Sessions from './Sessions.js';
import Users from './Users.js';

const models = {
  Alerts,
  GreenSpaces,
  GreenSpaceZones,
  MaintenanceTasks,
  PasswordResetTokens,
  Reports,
  Roles,
  SensorReadingMetas,
  Sensors,
  Sessions,
  Users,
};

for (const model of Object.values(models)) {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
}

export default models;
