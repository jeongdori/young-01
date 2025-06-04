// src/lib/reactQuery.ts
import * as ReactQuery from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/index';

// 에러 타입
type DefaultError = AxiosError<ApiErrorResponse>;

// 커스텀 useQuery 래퍼
export function useQuery<TData>(
    options: Omit<UseQueryOptions<TData, DefaultError, TData>, 'queryKey' | 'queryFn'> & {
        queryKey: readonly unknown[];
        queryFn: () => Promise<TData>;
    }
): UseQueryResult<TData, DefaultError> {
    const { queryKey, queryFn, ...restOptions } = options;
    return ReactQuery.useQuery<TData, DefaultError, TData>({
        queryKey,
        queryFn,
        ...restOptions,
    });
}

// 커스텀 useMutation 래퍼
export function useMutation<TData, TVariables = void>(
    options: UseMutationOptions<TData, DefaultError, TVariables, unknown>
): UseMutationResult<TData, DefaultError, TVariables, unknown> {
    return ReactQuery.useMutation<TData, DefaultError, TVariables>({
        ...options,
    });
}

export const queryClient = new ReactQuery.QueryClient({
    defaultOptions: {
        queries: {
            // retry 로직: 실패 카운트와 에러 메시지를 보고 재시도 여부 결정
            retry: (failureCount, error) => {
                const message = (error as AxiosError<ApiErrorResponse>)?.response?.data?.message;
                return !['TOKEN_EXPIRED', 'INVALID_TOKEN', 'NO_TOKEN'].includes(message ?? '');
            },
            staleTime: 1000 * 60 * 10, // 10분 동안은 캐시 유지
        },
        // 필요하다면 mutation 기본 옵션도 여기에 추가 가능
        // mutations: { ... }
    },
});

export const {
    QueryClient,
    QueryClientProvider,
    useQueryClient,
    useIsFetching, // (선택) 모든 활성화된 쿼리 카운트
    useIsMutating, // (선택) 모든 활성화된 뮤테이션 카운트
} = ReactQuery;
