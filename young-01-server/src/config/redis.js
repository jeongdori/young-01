module.exports = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: process.env.REDIS_TTL || 60 * 60 * 24 * 7, // 기본 7일
};
