import { DataTypes } from 'sequelize';

import sequelize from '../database/connection';
import GreenSpaces from './GreenSpaces';

const GreenSpaceZones = sequelize.define(
  'GreenSpaceZones',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    green_spaces_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'green_spaces',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'green_spaces_zones',
    timestamps: true,
    paranoid: true,
    scheduled_date: 'scheduled_date',
    completedAt: 'completed_at',
  },
);

GreenSpaceZones.associate = (models) => {
  GreenSpaceZones.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_spaces_id',
    as: 'greenSpace',
  });

  GreenSpacesZones.hasMany(models.Sensors, {
    foreignKey: 'green_spaces_zones_id',
    as: 'sensor',
  });
};

export default GreenSpaceZones;

