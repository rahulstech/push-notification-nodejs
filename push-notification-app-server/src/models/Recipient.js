const { DataTypes, Model } = require('sequelize')

class Recipient extends Model {

    static associate({ Message, User }) {
        Message.hasMany(Recipient, { foreignkey: 'msgId' })
        Recipient.belongsTo(Message, { foreignKey: 'msgId' })

        User.hasMany(Recipient, { foreignKey: 'userId' })
        Recipient.belongsTo(User, { foreignKey: 'userId' })
    }
}

module.exports = (sequelize) => {

    Recipient.init({

        msgId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },

    }, {
        sequelize,
        timestamps: false
    })

    return Recipient
}