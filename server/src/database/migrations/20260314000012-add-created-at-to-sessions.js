export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sessions', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('sessions', 'created_at');
  },
};
