const COLUMNS = ['user_id', 'green_spaces_zone_id', 'updated_by'];

export default {
  async up(queryInterface, Sequelize) {
    for (const column of COLUMNS) {
      await queryInterface.changeColumn('reports', column, {
        type: Sequelize.UUID,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (const column of COLUMNS) {
      await queryInterface.changeColumn('reports', column, {
        type: Sequelize.UUID,
        allowNull: false,
      });
    }
  },
};
