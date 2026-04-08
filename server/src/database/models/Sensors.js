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
    parameter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    min_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    is_active: {
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
    updated_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    deleted_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    },
  },
  {
    tableName: 'sensors',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

Sensors.associate = (models) => {
  Sensors.belongsTo(models.Users, {
    foreignKey: 'created_by',
    as: 'createdBy',
  });
  
  Sensors.belongsTo(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy',
  });

  Sensors.belongsTo(models.Users, {
    foreignKey: 'deleted_by',
    as: 'deletedBy',
  });

  Sensors.belongsTo(models.GreenSpaceZones, {
    foreignKey: 'green_space_zone_id',
    as: 'greenSpaceZone',
  });

	Sensors.hasMany(models.SensorReadingMetas, {
    foreignKey: 'sensors_id',
    as: 'sensorReadings',
  });
};

export default Sensors;

