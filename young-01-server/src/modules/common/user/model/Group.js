const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/lib/sequelize');

class Group extends Model {}

Group.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Group',
        tableName: 'auth_groups',
        timestamps: false,
    },
);

Group.associate = (models) => {
    Group.belongsToMany(models.User, {
        through: {
            model: models.UserGroupMap,
            timestamps: false,
        },
        foreignKey: 'group_id',
        otherKey: 'user_id',
    });
};

module.exports = Group;
