const { DataTypes, Model } = require('sequelize');

class GroupMessage extends Model {

    static associate({ Message, Group }) {
        Message.hasMany(GroupMessage, {
            foreignKey: "messageId",
        });
        GroupMessage.belongsTo(Message, {
            foreignKey: 'messageId',
        });

        Group.hasMany(Message, {
            foreignKey: 'groupId',
        });
        GroupMessage.belongsTo(Group, {
            foreignKey: 'groupId',
        });
    }
}

module.exports = (sequelize) => {

    GroupMessage.init({
        groupId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        messageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    },{
        sequelize,
        timestamps: false,
    })
    return GroupMessage;
}