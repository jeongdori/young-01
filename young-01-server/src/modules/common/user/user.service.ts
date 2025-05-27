const userRepo = require('./user.repository');

exports.findAll = () => userRepo.findAllUsers();
exports.findById = (id) => userRepo.findUserById(id);
exports.update = (id, data) => userRepo.updateUser(id, data);
exports.delete = (id) => userRepo.deleteUser(id);
