export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('sensors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      green_space_zone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'green_spaces_zones',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('sensors');
  }
};
