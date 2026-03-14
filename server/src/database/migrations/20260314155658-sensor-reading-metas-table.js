export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sensor_reading_metas', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      sensor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sensors',
          key: 'id',
        },
      },
      recorded_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valid: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('sensor_reading_metas');
  }
};
