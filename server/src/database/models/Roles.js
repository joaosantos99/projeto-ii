import { DataTypes } from 'sequelize';

import sequelize from '../connection';

const Roles = sequelize.define(
  'Roles',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    permissions_dump: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '[]',
    },
    permissions: {
      type: DataTypes.VIRTUAL,
      get() {
        return JSON.parse(this.permissions_dump);
      },
      set(value) {
        this.permissions_dump = JSON.stringify(value);
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUIDV4,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.UUIDV4,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.UUIDV4,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);

Roles.associate = (models) => {
  Roles.belongsTo(models.Users, {
    foreignKey: 'users_id',
    as: 'user',
  });

  Roles.hasOne(models.Users, {
    foreignKey: 'created_by',
    as: 'createdBy',
  });

  Roles.hasOne(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy',
  });

  Roles.hasOne(models.Users, {
    foreignKey: 'deleted_by',
    as: 'deletedBy',
  });
};

export default Roles;

