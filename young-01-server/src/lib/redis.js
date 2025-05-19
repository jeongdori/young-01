const { createClient } = require('redis');
const redisConfig = require('@config/redis');

const redis = createClient({
    url: redisConfig.url,
});

redis.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redis.connect();
})();

module.exports = redis;
