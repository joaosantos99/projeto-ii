export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('maintenance_tasks', 'created_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    });

    await queryInterface.addColumn('maintenance_tasks', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('maintenance_tasks', 'updated_by');
    await queryInterface.removeColumn('maintenance_tasks', 'created_by');
  },
};
