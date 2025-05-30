import { Sequelize } from 'sequelize-typescript';
import dbConfig from '@config/db';

import { User } from '@/modules/common/user/model/User';
import { Group } from '@/modules/common/user/model/Group';
import { UserGroupMap } from '@/modules/common/user/model/UserGroupMap';

const sequelize = new Sequelize({
    database: dbConfig.dbName!,
    username: dbConfig.dbUser!,
    password: dbConfig.dbPass!,
    host: dbConfig.dbHost!,
    dialect: 'mysql',
    logging: true,
    models: [User, Group, UserGroupMap],
});

export default sequelize;
