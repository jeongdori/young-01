const User = require('./User');
const Group = require('./Group');
const UserGroupMap = require('./UserGroupMap');

const models = {
    User,
    Group,
    UserGroupMap,
};

// 모든 모델의 associate 호출
Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

module.exports = models;
