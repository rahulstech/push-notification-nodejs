const { DataTypes, Model } = require('sequelize')

class Message extends Model {}

module.exports = ( sequelize ) => {

    Message.init({
        contentType: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
    })

    return Message
}