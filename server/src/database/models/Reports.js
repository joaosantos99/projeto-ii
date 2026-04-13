import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';

const Reports = sequelize.define(
  'Reports',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    green_space_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'green_spaces',
        key: 'id',
      },
    },
    green_spaces_zone_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'green_spaces_zones',
        key: 'id',
      },
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
		type:{
			type: DataTypes.STRING,
			allowNull: false
		},
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
		status: {
			type: DataTypes.STRING
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
    tableName: 'reports',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);

Reports.associate = (models) => {
  Reports.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_space_id',
    as: 'greenSpace',
  });
  
  Reports.belongsTo(models.GreenSpaceZones, {
    foreignKey: 'green_spaces_zone_id',
    as: 'greenSpaceZone',
  });

  Reports.belongsTo(models.Users, {
    foreignKey: 'user_id',
    as: 'createdBy',
  });

  Reports.belongsTo(models.Users, {
    foreignKey: 'updated_by',
    as: 'updatedBy',
  });

  Reports.belongsTo(models.Users, {
    foreignKey: 'deleted_by',
    as: 'deletedBy',
  });
};

export default Reports;

