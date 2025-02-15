'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Messages','sender',{
      type: Sequelize.INTEGER,
      allowNull: null,

      // set foreign key in migration
      references: {
        model: 'Users', // name of the parent table not the model
        key: 'id', // name of the column in the parent table 
        OnDelete: 'NO ACTION',
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Messages','sender')
  }
};
