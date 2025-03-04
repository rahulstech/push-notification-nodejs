const { DataTypes, Model } = require('sequelize');

class Member extends Model {

    static associate({ User, Group }) {
        User.hasMany(Member, {
            foreignKey: 'memberId',
        });
        Member.belongsTo(User, {
            foreignKey: 'memberId',
        });

        Group.hasMany(Member, {
            foreignKey: 'groupId',
        });
        Member.belongsTo(Group, {
            foreignKey: 'groupId',
        })
    }
}

module.exports = (sequelize) => {

    Member.init({
        memberId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },

        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        }
    }, {
        sequelize, 
        timestamps: false,
    });

    return Member;
}