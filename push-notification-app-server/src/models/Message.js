const { DataTypes, Model } = require('sequelize')

class Message extends Model {

    static associate({ User }) {
        User.hasMany(Message, { foreignKey: 'sender' })
        Message.belongsTo(User, { foreignKey: 'sender' })
    }
}

module.exports = ( sequelize ) => {

    Message.init({
        contentType: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        timestamps: false,
    })

    return Message
}