'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Diagnosis', {
      docid: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      patid: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Diagnosis')
  }
};
