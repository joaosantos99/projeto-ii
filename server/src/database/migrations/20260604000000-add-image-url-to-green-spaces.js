export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('green_spaces', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('green_spaces', 'image_url');
  },
};
