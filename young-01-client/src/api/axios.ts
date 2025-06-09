import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import { AxiosHeaders } from 'axios';

// util
import { v4 as uuidv4 } from 'uuid';

// type
import type { ApiErrorResponse } from '@/types/index';

import handleAuthError from './handlers/handleAuthError';
import handleApiError from './handlers/handleApiError';

/**
 * withCredentials
 * 크로스 도메인 요청 시 credential 정보 전달 여부(쿠키, Authorization)
 * 서버에서도 같은 설정 필요
 */
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    withCredentials: true,
    timeout: 20000, //20초
});

// ──────────────────────────────────────────────────────────────
// 요청 인터셉터 구성
const DEFAULT_META = {
    alert: true,
    log: true,
} as const;

// ──────────────────────────────────────────────────────────────
// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        // 헤더 구성
        const headers = new AxiosHeaders(config.headers);
        headers.set('X-Request-Id', uuidv4());
        headers.set('X-Site-Id', 'young-01');
        headers.set('X-Client-Version', '1.0.0');
        // headers.set('X-Locale', getCurrentLocale())
        headers.set('X-Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

        // config 구성
        config.headers = headers;
        config.meta = {
            ...DEFAULT_META,
            ...config.meta,
        };
        return config;
    },
    (error) => Promise.reject(error),
);

// ──────────────────────────────────────────────────────────────
// 응답 인터셉터
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const status = response.status;
        const raw = response.data;
        const cfg = response.config;
        const { method, url, meta } = cfg;

        if (raw.success) {
            logOnDev(
                meta?.log,
                'log',
                `🚀 [API] [SUCCESS] ${status} ${method?.toUpperCase()} ${url} → ${raw.message}`,
            );

            return raw.data;
        }
        logOnDev(
            meta?.log,
            'warn',
            `⚠️ [API] [BUSINESS ERROR] ${status} ${method?.toUpperCase()} ${url} → ${raw.message}`,
        );

        const error = new Error(raw.message) as AxiosError<ApiErrorResponse>;
        error.response = {
            ...response,
            data: raw,
        };
        throw error;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message ?? '알 수 없는 오류가 발생했습니다.';
        const cfg = error.config;
        if (!cfg) return Promise.reject(error);
        const { meta, method, url } = cfg;

        // auth ckeck..
        const authHandled = await handleAuthError(error, instance);
        if (authHandled != null) return authHandled;
        logOnDev(
            meta?.log,
            'error',
            `🚨 [API] [ERROR] ${method?.toUpperCase()} ${url} → (${status}) ${message}`,
        );

        // error
        return handleApiError(error, meta);
    },
);
/**
 *
 * @param log 로그 출력 여부
 * @param level 로그 레벨 log | warn | error
 * @param msg 로그 출력 메세지
 * @returns void
 */
export const logOnDev = (
    log: boolean | undefined,
    level: 'log' | 'warn' | 'error',
    msg: string,
) => {
    if (!log) return;

    const mode = import.meta.env.MODE;
    const modeTag = `[${mode.toUpperCase()}]`;
    if (mode === 'test' || mode === 'dev') {
        switch (level) {
            case 'log':
                console.log(modeTag, msg);
                break;
            case 'warn':
                console.warn(modeTag, msg);
                break;
            case 'error':
                console.error(modeTag, msg);
                break;
            default:
                console.log(modeTag, msg);
        }
    }
};

export default instance;
