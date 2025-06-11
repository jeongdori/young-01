import { createClient } from 'redis';
import redisConfig from '@/config/redis';
import logger from '@/lib/logger';

export const redis = createClient({
    url: redisConfig.url,
});

export async function connectRedis() {
    redis.on('error', (err: Error) => logger.error('[Redis] Client Error : ', err));
    try {
        await redis.connect();
        logger.info('✅ Redis connected');
    } catch (err) {
        let msg = 'Unknown Error';
        if (err instanceof Error) msg = err.message;
        msg = '❌ Redis 연결 실패: ' + msg;
        logger.error(msg);
        throw msg;
    }
}
export async function disconnectRedis() {
    redis.quit();
}

export const get = async (key: string) => {
    return await redisCommand(() => redis.get(key), `get${key}`);
};

export const getJSON = async (key: string) => {
    const raw = await redisCommand(() => get(key), `getJSON${key}`);
    return raw ? JSON.parse(raw) : null;
};

export const set = async (key: string, value: string, options = {}) => {
    return await redisCommand(() => redis.set(key, value, options), `set${key}`);
};

export const setJSON = async (key: string, obj: unknown, options = {}) => {
    return await redisCommand(() => set(key, JSON.stringify(obj), options), `setJSON${key}`);
};
export const del = async (key: string) => {
    return await redisCommand(() => redis.del(key), `del${key}`);
};

async function redisCommand<T>(cmd: () => Promise<T>, keyDesc: string, timeout = 5000): Promise<T> {
    return withTimeout(cmd(), timeout).catch((err) => {
        logger.error(`[Redis] ${keyDesc} 실패`, err);
        throw new Error('Redis 오류가 발생했습니다.');
    });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Redis 명령어가 시간 초과되었습니다.'));
        }, ms);
        promise
            .then((val) => {
                clearTimeout(timer);
                resolve(val);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}
