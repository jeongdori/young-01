module.exports = {
    secret: process.env.JWT_SECRET || 'super-secret-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1800',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '604800',
};
