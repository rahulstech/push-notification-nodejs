const { DataTypes, Model } = require('sequelize')

class Patient extends Model {}

module.exports = (sequelize) => {

    Patient.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
    })

    return Patient
}