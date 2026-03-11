import { DataTypes } from 'sequelize';

import sequelize from '../database/connection';

const GreenSpaceZones = sequelize.define(
  'GreenSpaceZones',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);
 
export default GreenSpaceZones;

