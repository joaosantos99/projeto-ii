import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';

const MaintenanceTasks = sequelize.define(
  'MaintenanceTasks',
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    },
  },
  {
    tableName: 'maintenance_tasks',
    timestamps: false,
  },
);

MaintenanceTasks.associate = (models) => {
  MaintenanceTasks.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_spaces_id',
    as: 'greenSpace',
  });

  MaintenanceTasks.belongsTo(models.Users, {
    foreignKey: 'created_by',
    as: 'createdBy',
  });

  MaintenanceTasks.belongsTo(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy',
  });
};

export default MaintenanceTasks;