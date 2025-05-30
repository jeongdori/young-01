import UserListPage from "@/features/user/pages/UserListPage";

const defaultPath = "/user";
const userRoutes = [{ path: `${defaultPath}/list`, element: <UserListPage /> }];

export default userRoutes;
