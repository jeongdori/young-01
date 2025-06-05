import axios from 'axios';
import type { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// type
import type { ApiErrorResponse } from '@/types/index';

// store
import useAuthStore from '@/stores/auth/authStore';
import useErrorStore from '@/stores/error/errorStore';

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
        config.meta = {
            ...DEFAULT_META,
            ...config.meta,
        };
        return config;
    },
    (error) => Promise.reject(error),
);

// ──────────────────────────────────────────────────────────────
// 응답 인터셉터 구성
type FailedRequest = {
    resolve: (_value?: string | null) => void;
    reject: (_reason?: unknown) => void;
};

// 토큰 재발급 여부를 기억하는 변수
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// refresh 중 요청 담기
const processQueue = (error: unknown | null, token: string | null = null): void => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

// 분기 처리할 응답 메세지
const refreshableMessages = ['NO_TOKEN', 'TOKEN_EXPIRED', 'jwt expired'];
const redirectToLoginMessages = ['INVALID_TOKEN'];

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
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const { method, url, meta } = originalRequest;
        const status = error.response?.status;
        const message = error.response?.data?.message ?? '알 수 없는 오류가 발생했습니다.';

        logOnDev(
            meta?.log,
            'error',
            `🚨 [API] [ERROR] ${method?.toUpperCase()} ${url} → (${status}) ${message}`,
        );

        // ──────────────────────────────────────────────────────────────
        // refresh
        if (
            status === 401 &&
            refreshableMessages.includes(message ?? '') &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => instance(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await instance.post('/refresh', {}, { withCredentials: true });
                processQueue(null);

                // 다시 요청
                return instance({
                    ...originalRequest,
                    headers: { ...(originalRequest.headers || {}) },
                });
            } catch (catchError) {
                processQueue(catchError);
                const err = catchError as AxiosError;
                if (err.response?.status === 403 || err.response?.status === 401) {
                    // 상태 초기화, 로그인 페이지 이동
                    useAuthStore.getState().logout(); // 상태 초기화 유틸
                    const currentPath = window.location.pathname + window.location.search;
                    alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                }
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        // ──────────────────────────────────────────────────────────────

        // ──────────────────────────────────────────────────────────────
        // no auth
        if (redirectToLoginMessages.includes(message ?? '') || status === 403) {
            useAuthStore.getState().logout();
            const currentPath = window.location.pathname + window.location.search;
            alert('권한이 없거나 로그인 정보가 유효하지 않습니다. 로그인 후 다시 시도해주세요.');
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;

            return Promise.reject(error);
        }

        // error alert or page
        if (meta?.alert) {
            if (!originalRequest._retry) alert(`[${status}] 오류 :  ${message}`);
        } else {
            useErrorStore.getState().setError({
                status,
                statusText: message ?? '알 수 없는 오류입니다.',
            });

            window.location.href = '/error';
        }

        return Promise.reject(error);
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
