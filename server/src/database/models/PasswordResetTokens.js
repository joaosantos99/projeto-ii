import { DataTypes } from 'sequelize';

import sequelize from '../connection.js';

const PasswordResetTokens = sequelize.define(
  'PasswordResetTokens',
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
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'password_reset_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  },
);

PasswordResetTokens.associate = (models) => {
  PasswordResetTokens.belongsTo(models.Users, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

export default PasswordResetTokens;
