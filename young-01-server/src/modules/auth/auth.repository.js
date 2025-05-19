const { User, Group } = require('@models');

exports.findUserWithGroupsByEmail = async (email) => {
    return User.findOne({
        where: { email },
        include: {
            model: Group,
            through: { attributes: [] }, // join 테이블 필드 제외
        },
    });
};

exports.findUserWithGroupsById = async (id) => {
    return User.findOne({
        where: { id },
        include: {
            model: Group,
            through: { attributes: [] },
        },
    });
};

exports.findUserByEmail = (email) => {
    return User.findOne({ where: { email } });
};

exports.createUser = ({ email, password, name }) => {
    return User.create({ email, password, name });
};

exports.findGroupByName = (name) => {
    return Group.findOne({ where: { name } });
};
