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
    green_space_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'green_spaces',
        key: 'id',
      },
    },
    recorded_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'sensor_reading_metas',
    timestamps: false,
  },
);

SensorReadingMetas.associate = (models) => {
  SensorReadingMetas.belongsTo(models.Sensors, {
    foreignKey: 'sensor_id',
    as: 'sensor',
  });

  SensorReadingMetas.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_space_id',
    as: 'greenSpace',
  });
};

export default SensorReadingMetas;

