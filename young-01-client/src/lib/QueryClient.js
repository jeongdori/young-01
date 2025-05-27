import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const message = error?.response?.data?.message;
        // 토큰 관련 에러면 재시도 X
        return !["TOKEN_EXPIRED", "INVALID_TOKEN", "NO_TOKEN"].includes(
          message
        );
      },
      staleTime: 1000 * 60 * 10,
    },
  },
});

export default queryClient;
