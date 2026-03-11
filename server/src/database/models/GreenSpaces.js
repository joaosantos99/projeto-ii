import { DataTypes } from 'sequelize';

import sequelize from '../connection';

const GreenSpaces = sequelize.define(
  'GreenSpace',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
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
    tableName: 'green_spaces',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);

GreenSpaces.associate = (models) => {
  GreenSpaces.hasMany(models.GreenSpaceZones, {
    foreignKey: 'green_spaces_id',
    as: 'zones',
  });

  GreenSpaces.hasMany(models.Reports, {
    foreignKey: 'green_spaces_id',
    as: 'report',
  });

  GreenSpaces.hasMany(models.MaintenanceTasks, {
    foreignKey: 'green_spaces_id',
    as: 'maintenanceTasks',
  });
};

export default GreenSpaces;

