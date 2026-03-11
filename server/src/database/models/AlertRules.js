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
    sensor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id',
      },
    },
    parameter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    min_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    tableName: 'alert_rules',
    paranoid: true,
  },
);

AlertRules.associate = (models) => {
  AlertRules.belongsTo(models.Alerts, {
    foreignKey: 'alerts_id',
    as: 'alert',
  });
};

export default Alerts;

