const { createClient } = require('redis');
const redisConfig = require('@config/redis');

const redis = createClient({
    url: redisConfig.url,
});

redis.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redis.connect();
})();

const get = async (key) => {
    return await redis.get(key);
};

const getJSON = async (key) => {
    const raw = await get(key);
    return raw ? JSON.parse(raw) : null;
};

const set = async (key, value, options = {}) => {
    return await redis.set(key, value, options);
};

const setJSON = (key, obj, options = {}) =>
    set(key, JSON.stringify(obj), options);

const del = async (key) => {
    return await redis.del(key);
};

module.exports = {
    redis,
    get,
    getJSON,
    set,
    setJSON,
    del,
};
