import { createClient } from 'redis';
import redisConfig from '@/config/redis';

export const redis = createClient({
    url: redisConfig.url,
});

redis.on('error', (err: Error) => console.error('Redis Client Error', err));

(async () => {
    await redis.connect();
})();

export const get = async (key: string) => {
    return await redis.get(key);
};

export const getJSON = async (key: string) => {
    const raw = await get(key);
    return raw ? JSON.parse(raw) : null;
};

export const set = async (key: string, value: string, options = {}) => {
    return await redis.set(key, value, options);
};

export const setJSON = (key: string, obj: unknown, options = {}) =>
    set(key, JSON.stringify(obj), options);

export const del = async (key: string) => {
    return await redis.del(key);
};
