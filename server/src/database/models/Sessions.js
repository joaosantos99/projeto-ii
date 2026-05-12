import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';

const Sessions = sequelize.define(
  'Sessions',
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
    token: {
      type: DataTypes.STRING,
			allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'sessions',
    timestamps: false,
  },
);

Sessions.associate = (models) => {
    Sessions.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user'
    })
};

export default Sessions;

