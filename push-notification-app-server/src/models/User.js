const { DataTypes, Model } = require('sequelize')

class User extends Model {}

module.exports = (sequelize) => {

    User.init({
        pushToken: {
            type: DataTypes.TEXT,
        }
    }, {
        sequelize,
        timestamps: false
    })

    return User
}