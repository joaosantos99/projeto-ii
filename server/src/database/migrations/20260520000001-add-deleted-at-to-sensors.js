export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sensors', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('sensors', 'deleted_at');
  },
};
