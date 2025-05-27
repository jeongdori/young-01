import { useQuery } from "@tanstack/react-query";
import userService from "../services";

const UserListPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "findAll"],
    queryFn: userService.findAll,
    retry: false,
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
    return (
      <p>
        [{status}] 에러: {message}
      </p>
    );
  }

  return (
    <div>
      <h2>유저 목록</h2>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserListPage;
