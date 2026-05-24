export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('maintenance_tasks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      green_spaces_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'green_spaces',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scheduled_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('maintenance_tasks');
  }
};
