import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';

const Alerts = sequelize.define(
  'Alerts',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    sensor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id',
      },
    },
    green_space_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'green_spaces',
        key: 'id',
      },
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'alerts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

Alerts.associate = (models) => {
  Alerts.belongsTo(models.Sensors, {
    foreignKey: 'sensor_id',
    as: 'sensor',
  });

  Alerts.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_space_id',
    as: 'greenSpace',
  });
  
  Alerts.belongsTo(models.Users, {
    foreignKey: 'created_by',
    as: 'createdBy',
  });
};

export default Alerts;

