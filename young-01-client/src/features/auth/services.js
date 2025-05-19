import axios from "@/api/axios";

const authService = {
  login: (data) =>
    axios.post("/auth/login", data, {
      withCredentials: true,
    }),
  register: (data) => axios.post("/auth/register", data),
};

export default authService;
