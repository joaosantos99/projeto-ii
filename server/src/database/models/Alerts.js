import { DataTypes } from 'sequelize';

import sequelize from '../connection';

const Alerts = sequelize.define(
  'Alerts',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    alert_rule_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'alert_rules',
        key: 'id',
      },
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notified: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'alerts',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
  },
);

Alerts.associate = (models) => {
  Alerts.hasOne(models.AlertRules, {
    foreignKey: 'alerts_id',
    as: 'alertRule',
  });
};

export default Alerts;

