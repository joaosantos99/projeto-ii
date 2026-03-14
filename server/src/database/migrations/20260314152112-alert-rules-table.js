
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('alert-rules',
      {
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
        parameter: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        min_value: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        max_value: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        active: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
      },
    )
  },

  async down (queryInterface) {
    await queryInterface.dropTable('alert-rules');
  }
};
