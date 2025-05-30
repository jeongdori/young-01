export default {
    secret: process.env.JWT_SECRET || 'super-secret-key',
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || 60 * 30,
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 60 * 60 * 24 * 7,
};
