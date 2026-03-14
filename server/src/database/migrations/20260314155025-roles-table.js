export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('roles', 
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name:{
          type: Sequelize.STRING,
          allowNull: false
        },
        permissions_dump: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '[]',
        },
        permissions: {
          type: Sequelize.VIRTUAL,
          get() {
            return JSON.parse(this.permissions_dump);
          },
          set(value) {
            this.permissions_dump = JSON.stringify(value);
          },
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        created_by: {
          type: Sequelize.UUIDV4,
          references: {
            model: 'users',
            key: 'id',
          },
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_by: {
          type: Sequelize.UUIDV4,
          references: {
            model: 'users',
            key: 'id',
          },
          allowNull: false,
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        deleted_by: {
          type: Sequelize.UUIDV4,
          references: {
            model: 'users',
            key: 'id',
          },
          allowNull: true,
        },
      }
    );
  },

  async down (queryInterface) {
    await queryInterface.dropTable('roles');
  }
};
