import { DataTypes } from 'sequelize';

import sequelize from '../database/connection.js';

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
    name: {
      type: DataTypes.STRING,
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
    tableName: 'green_spaces_zones',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);

GreenSpaceZones.associate = (models) => {
  GreenSpaceZones.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_spaces_id',
    as: 'greenSpace',
  });

  GreenSpaceZones.hasMany(models.Sensors, {
    foreignKey: 'green_space_zone_id',
    as: 'sensors',
  });

  GreenSpaceZones.belongsTo(models.Users, {
    foreignKey: 'created_by',
    as: 'createdBy',
  });

  GreenSpaceZones.belongsTo(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy',
  });

  GreenSpaceZones.belongsTo(models.Users, {
    foreignKey: 'deleted_by',
    as: 'deletedBy',
  });
};

export default GreenSpaceZones;

