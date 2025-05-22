// src/features/auth/hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/stores/auth/useAuth";
import authService from "../services";

const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    location.state?.from?.pathname ||
    new URLSearchParams(location.search).get("redirect") ||
    "/main";

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      useAuth.getState().login(res.data.data);
      navigate(redirectTo, {
        replace: true,
      });
    },
    onError: (error) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";

      console.error(`STATUS: ${status} | MESSAGE: ${message}`);
      alert(`[${status}] 로그인 실패: ${message}`);
    },
  });
};

export default useLogin;
