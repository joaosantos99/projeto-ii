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
      type: DataTypes.TEXT,
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
      allowNull: false,
    }
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
    foreignKey: 'created_by',
    as: 'createdBy',
  });

  Roles.belongsTo(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy',
  });

  Roles.belongsTo(models.Users, {
    foreignKey: 'deleted_by',
    as: 'deletedBy',
  });
};

export default Roles;

