import { DataTypes } from 'sequelize';

import sequelize from '../connection';

const Sensors = sequelize.define(
  'Sensors',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    green_space_zone_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'green_spaces_zones',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
			allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'sensors',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);

Sensors.associate = (models) => {
  Sensors.belongsTo(models.GreenSpaceZones, {
    foreignKey: 'green_spaces_zones_id',
    as: 'greenSpaceZone',
  });
	Sensors.hasMany(models.SensorReadingMeta, {
    foreignKey: 'sensors_id',
    as: 'sensorReadings',
  });
};

export default Sensors;

