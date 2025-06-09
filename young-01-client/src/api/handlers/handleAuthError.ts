import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '@/types/index';

// store
import useAuthStore from '@/stores/auth/authStore';

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

// export func
const handleAuthError = async (error: AxiosError<ApiErrorResponse>, instance: any) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? '알 수 없는 오류가 발생했습니다.';
    const cfg = error.config;
    if (!cfg) return Promise.reject(error);

    // ──────────────────────────────────────────────────────────────
    // refresh
    if (status === 401 && refreshableMessages.includes(message ?? '') && !cfg._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => instance(cfg));
        }

        cfg._retry = true;
        isRefreshing = true;

        try {
            await instance.post('/refresh', {}, { withCredentials: true });
            processQueue(null);

            // 다시 요청
            return instance({
                ...cfg,
                headers: { ...(cfg.headers || {}) },
            });
        } catch (catchError) {
            processQueue(catchError);

            const err = catchError as AxiosError;
            if (err.response?.status === 403 || err.response?.status === 401) {
                // 상태 초기화, 로그인 페이지 이동
                useAuthStore.getState().logout();
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

    return null;
};

export default handleAuthError;
