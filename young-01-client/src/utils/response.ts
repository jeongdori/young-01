export interface ClientError extends Error {
    status?: number;
    response?: {
        status: number;
        data?: any;
    };
}

export interface ApiSuccess<T = any> {
    success: true;
    message: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    data: null;
}

export const isApiSuccess = <T>(res: any): res is ApiSuccess<T> => {
    return res && res.success === true && 'data' in res;
};

export const isApiError = (res: any): res is ApiError => {
    return res && res.success === false && typeof res.message === 'string';
};
