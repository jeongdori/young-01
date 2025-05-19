import instance from "@/api/axios";
import useAuth from "@/stores/auth/useAuth";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const logoutState = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await instance.post("/auth/logout");
      logoutState();
      navigate("/login");
    } catch (err) {
      console.error("로그아웃 요청 실패:", err);
    }
  };

  return logout;
};

export default useLogout;
