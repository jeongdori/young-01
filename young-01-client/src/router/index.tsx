import { Routes, Route, Navigate } from "react-router-dom";

import HomeLayout from "@/layouts/HomeLayout";

import mainRoutes from "./main.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const Router = () => {
  const homeRoutes = [
    { path: "/", element: <Navigate to="/main" replace /> },
    ...mainRoutes,
    ...authRoutes,
    ...userRoutes,
  ];

  return (
    <Routes>
      <Route element={<HomeLayout />}>
        {homeRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default Router;
