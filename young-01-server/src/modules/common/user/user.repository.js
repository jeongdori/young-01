const { User } = require('@models');

exports.findAllUsers = () => {
    return User.findAll({});
};

exports.findUserById = (id) => {
    return User.findOne({ where: { id } });
};

exports.createUser = ({ name, email, password }) => {
    return User.create({ name, email, password });
};

exports.updateUser = (id, { name, email }) => {
    return User.update({ name, email }, { where: { id } });
};

exports.deleteUser = (id) => {
    return User.destroy({ where: { id } });
};
