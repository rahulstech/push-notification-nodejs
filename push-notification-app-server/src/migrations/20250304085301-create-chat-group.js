'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      // create Groups table
      await queryInterface.createTable('Groups',{
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },

        topicName: {
          type: Sequelize.STRING(64),
          allowNull: false,
        }
      }, {
        transaction,
      });
  
      // create Members table 
      await queryInterface.createTable('Members', {
        memberId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },

        groupId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
      }, {
        transaction,
      });

      // create GroupMessages table
      await queryInterface.createTable('GroupMessages',{
        groupId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        messageId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
      },{
        transaction,
      })
    }
    catch(error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('GroupMessages');
    queryInterface.dropTable('Members');
    queryInterface.dropTable('Groups');
  }
};
