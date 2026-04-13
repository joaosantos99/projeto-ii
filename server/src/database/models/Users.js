import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';

const Users = sequelize.define(
  'Users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
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
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);

Users.associate = (models) => {
  Users.belongsTo(models.Roles, {
    foreignKey: 'role_id',
    as: 'role',
  });

  Users.hasMany(models.Reports, {
    foreignKey: 'user_id',
    as: 'reports',
  });

  Users.belongsTo(models.Users, {
    foreignKey: 'created_by',
    as: 'createdBy'
  });

  Users.belongsTo(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy'
  });

  Users.belongsTo(models.Users, {
    foreignKey: 'deleted_by',
    as: 'deletedBy'
  });

  Users.hasMany(models.Sensors, {
    foreignKey: 'created_by',
    as: 'sensors'
  });

  Users.hasMany(models.Alerts, {
    foreignKey: 'created_by',
    as: 'alerts'
  });

  Users.hasMany(models.MaintenanceTasks, {
    foreignKey: 'created_by',
    as: 'maintenanceTasks'
  });
};

export default Users;