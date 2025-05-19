const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/lib/sequelize');

class User extends Model {}

User.init(
    {
        email: { type: DataTypes.STRING, unique: true },
        password: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
    },
);

User.associate = (models) => {
    User.belongsToMany(models.Group, {
        through: {
            model: models.UserGroupMap,
            timestamps: false,
        },
        foreignKey: 'user_id',
        otherKey: 'group_id',
    });
};

module.exports = User;
