export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('alerts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      alert_rule_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'alert_rules',
          key: 'id',
        },
      },
      severity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      notified: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('alerts');
  }
};
