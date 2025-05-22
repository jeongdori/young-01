const User = require('@/modules/common/user/model/User');
const Group = require('@/modules/common/user/model/Group');
const UserGroupMap = require('@/modules/common/user/model/UserGroupMap');

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
