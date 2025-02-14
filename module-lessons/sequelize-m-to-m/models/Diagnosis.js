const { DataTypes, Model } = require('sequelize')

class Diagnosis extends Model {

    static associate({ Doctor, Patient }) {
        /**
         * Note: 
         * 1. foreignKey is mentioned in both hasMany and belongTo. it's required to tell the sequelize 
         * which columns are connected. 
         * 
         * 2. the foreignKey name is the name of the attribute not the column. since i am setting the attribute name
         * only, there is a shorthand 
         * { foreignKey: 'attrname' }
         * 
         * 3. the model where i called hasMany is the parent table and the model where i called belongsTo is the child table.
         * tables are associated via the primary key of the parent table and the named column in the child table.
         */
        Doctor.hasMany(Diagnosis, {
            foreignKey: {
                name: 'docid'
            }
         })
        Diagnosis.belongsTo(Doctor, {
            foreignKey: {
                name: 'docid'
            }
        })

        Patient.hasMany(Diagnosis, {
            foreignKey: {
                name: 'patid'
            }
        })
        Diagnosis.belongsTo(Patient, {
            foreignKey: {
                name: 'patid'
            }
        })
    }
}

module.exports = (sequelize) => {

    Diagnosis.init({
        docid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        patid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        sequelize,
        timestamps: false,

        // i don't need to set unique index
        // simply adding primaryKey = true all the columns in composite pk is enough
        // same rule applies for writing migration script too. see migrations -> create-diagnosis-table
        // 
        // To create composite primary key
        // 1. set each of the fields primaryKey = true
        // 2. create composite unique index for the columns
        indexes: [
            // {
            //     unique: true,
            //     fields: ['docid', 'patid']
            // }    
        ]
    })
    return Diagnosis
}