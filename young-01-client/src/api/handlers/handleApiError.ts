import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/index';

// store
import useErrorStore from '@/stores/error/errorStore';

const handleApiError = (error: AxiosError<ApiErrorResponse>, meta?: any) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? '알 수 없는 오류가 발생했습니다.';
    const cfg = error.config;
    if (!cfg) return Promise.reject(error);

    // error alert or page
    if (meta?.alert) {
        if (!cfg._retry) alert(`[${status}] 오류 :  ${message}`);
    } else {
        useErrorStore.getState().setError({
            status,
            statusText: message ?? '알 수 없는 오류입니다.',
        });

        window.location.href = '/error';
    }

    return Promise.reject(error);
};

export default handleApiError;
