import { DataTypes } from 'sequelize';

import sequelize from '../database/connection';

const GreenSpaces = sequelize.define(
  'GreenSpace',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
);
 
export default GreenSpaces;

