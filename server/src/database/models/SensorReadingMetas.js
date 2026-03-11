import { DataTypes } from 'sequelize';

import sequelize from '../connection';

const SensorReadingMetas = sequelize.define(
  'SensorReadingMetas',
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
    recorded_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valid: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    tableName: 'alert_rules',
    paranoid: true,
    recordedAt: 'recorded_at',
  },
);

SensorReadingMetas.associate = (models) => {
  SensorReadingMetas.belongsTo(models.Sensors, {
    foreignKey: 'Sensors_id',
    as: 'sensor',
  });
};

export default SensorReadingMetas;

