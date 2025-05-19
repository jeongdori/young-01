import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
];

export default authRoutes;
