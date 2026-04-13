import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';

const GreenSpaces = sequelize.define(
  'GreenSpaces',
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
    as: 'reports',
  });

  GreenSpaces.hasMany(models.MaintenanceTasks, {
    foreignKey: 'green_spaces_id',
    as: 'maintenanceTasks',
  });

  GreenSpaces.belongsTo(models.Users, {
    foreignKey: 'created_by',
    as: 'createdBy',
  });

  GreenSpaces.belongsTo(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy',
  });

  GreenSpaces.belongsTo(models.Users, {
    foreignKey: 'deleted_by',
    as: 'deletedBy',
  });
};

export default GreenSpaces;

