import { DataTypes } from 'sequelize';

import sequelize from '../connection';

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
    green_spaces_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'green_spaces',
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
    tableName: 'reports',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
);

Reports.associate = (models) => {
  Reports.belongsTo(models.Users, {
    foreignKey: 'users_id',
    as: 'user',
  });

  Reports.belongsTo(models.GreenSpaces, {
    foreignKey: 'green_spaces_id',
    as: 'greenSpace',
  });
};

export default Reports;

