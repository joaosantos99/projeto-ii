export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sensors', 'unit', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Backfill existing rows with the canonical unit for their type.
    const canonical = {
      temperature: '°C',
      humidity: '%',
      light: 'lux',
      sound: 'dB',
    };

    for (const [type, unit] of Object.entries(canonical)) {
      await queryInterface.sequelize.query(
        'UPDATE sensors SET unit = :unit WHERE type = :type AND unit IS NULL',
        { replacements: { unit, type } },
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('sensors', 'unit');
  },
};
