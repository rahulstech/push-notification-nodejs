const { DataTypes, Model } = require('sequelize')

class Doctor extends Model {}

module.exports = (sequelize) => {

    Doctor.init({
        doctorId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        sequelize,
        timestamps: false
    })

    return Doctor
}