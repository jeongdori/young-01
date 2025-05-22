const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/lib/sequelize');

class UserGroupMap extends Model {}

UserGroupMap.init(
    {
        user_id: { type: DataTypes.INTEGER, primaryKey: true },
        group_id: { type: DataTypes.INTEGER, primaryKey: true },
    },
    {
        sequelize,
        modelName: 'UserGroupMap',
        tableName: 'user_group_map',
        timestamps: false,
    },
);

module.exports = UserGroupMap;
