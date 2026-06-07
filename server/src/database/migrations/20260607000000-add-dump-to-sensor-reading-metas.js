export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sensor_reading_metas', 'dump', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('sensor_reading_metas', 'dump');
  },
};
