export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      green_space_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'green_spaces',
          key: 'id',
        },
      },
      green_spaces_zone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'green_spaces_zones',
          key: 'id',
        },
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false
      },
      type:{
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deleted_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: true,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('reports');
  }
};
