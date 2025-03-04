const { DataTypes, Model } = require('sequelize');

class Group extends Model {}

module.exports = (sequelize) => {

    Group.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },

        topicName: {
            type: DataTypes.STRING(60),
            allowNull: false,
        }
    },{
        sequelize,
        timestamps: false,
    });

    return Group;
}