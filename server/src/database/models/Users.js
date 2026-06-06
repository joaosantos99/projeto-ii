import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';
import CacheService from '../../services/cache.js';

const sessionCache = new CacheService({
  namespace: 'session',
  indexNamespace: 'user-sessions',
  label: 'session-cache',
});

// Fields whose value is baked into the cached `req.user` session payload
// (see middleware/auth.js). Any change to them must drop the user's cached
// sessions so the next request is re-hydrated from the database.
const SESSION_FIELDS = ['role_id', 'full_name', 'email'];

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

// Instance update (e.g. UsersService.updateUser via user.update(...)).
Users.addHook('afterUpdate', async (user) => {
  if (SESSION_FIELDS.some((f) => user.changed(f))) {
    await sessionCache.invalidateIndex(user.id);
  }
});

// Bulk update (e.g. Users.update({ role_id }, { where })). Affected ids are
// resolved from the same filter so each user's sessions are dropped.
Users.addHook('afterBulkUpdate', async (options) => {
  const fields = options.fields ?? Object.keys(options.attributes ?? {});
  if (!fields.some((f) => SESSION_FIELDS.includes(f))) return;

  const rows = await Users.findAll({
    where: options.where,
    attributes: ['id'],
    paranoid: false,
  });
  await Promise.all(rows.map((u) => sessionCache.invalidateIndex(u.id)));
});

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