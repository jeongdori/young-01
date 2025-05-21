const User = require('@/modules/member/user/User');
const Group = require('@/modules/member/user/Group');
const UserGroupMap = require('@/modules/member/user/UserGroupMap');

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
