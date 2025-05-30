import instance from "@/api/axios";
import useAuth from "@/stores/auth/useAuth";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const logoutState = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await instance.post("/logout");
    } catch (err) {
      console.error("로그아웃 요청 실패:", err);
    } finally {
      logoutState();
      navigate("/login");
    }
  };

  return logout;
};

export default useLogout;
