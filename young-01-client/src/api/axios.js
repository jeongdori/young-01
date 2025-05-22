import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

// 토큰 재발급 여부를 기억하는 변수
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 요청 인터셉터
// instance.interceptors.request.use(
//   (request) => {
//     console.log("request success:", request);
//     return request;
//   },
//   (error) => {
//     console.log("Response error:", error);

//     return error;
//   }
// );

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    const expiredMessages = ["TOKEN_EXPIRED", "jwt expired"];
    if (
      status === 401 &&
      expiredMessages.includes(message) &&
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
        await instance.post("/refresh", {}, { withCredentials: true });
        processQueue(null);
        return instance(originalRequest); // 다시 요청
      } catch (err) {
        processQueue(err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          // 상태 초기화, 로그인 페이지 이동
          useAuth.getState().logout(); // 상태 초기화 유틸
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(
            currentPath
          )}`;
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
