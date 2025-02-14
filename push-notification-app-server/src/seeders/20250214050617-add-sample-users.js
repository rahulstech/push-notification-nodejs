'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      { id: 1 }, { id: 2 }, { id: 3 }
    ])
  },

  async down (queryInterface, Sequelize) {
    // TODO: delete the users
  }
};
