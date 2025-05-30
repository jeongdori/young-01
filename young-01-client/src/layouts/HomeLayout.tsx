// src/layouts/MainLayout.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/stores/auth/useAuth"; // 사용자 로그인 상태 관리용
import useLogout from "@/features/auth/hook/useLogout";

import GlobalLoader from "@/components/loading/GlobalLoader";

import UserMenu from "./components/UserMenu";

const HomeLayout = () => {
  const { user } = useAuth(); // zustand 기반이라고 가정
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <a href="#" onClick={() => navigate("/")}>
              <img src="/vite.svg" alt="Young" />
            </a>
          </Typography>
          {user ? (
            <>
              <UserMenu />
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 로딩 인디케이터 */}
      <GlobalLoader />

      {/* 메인 콘텐츠 영역 */}
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default HomeLayout;
