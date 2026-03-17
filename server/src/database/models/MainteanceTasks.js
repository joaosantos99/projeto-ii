import { DataTypes } from 'sequelize';

import sequelize from '../database/connection';

const MaintenanceTaks = sequelize.define(
  'MaintenanceTaks',
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
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'green_spaces_zones',
    timestamps: true,
    paranoid: true,
    scheduled_date: 'scheduled_date',
    completedAt: 'completed_at',
  },
);

MaintenanceTaks.associate = (models) => {
  MaintenanceTaks.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_spaces_id',
    as: 'greenSpace',
  });
};

export default MaintenanceTaks;

