import axios from "@/api/axios";

const defaultPath = "";
const authService = {
  getPublicKey: () => axios.get("/public-key"),
  login: (data) =>
    axios.post(`${defaultPath}/login`, data, {
      withCredentials: true,
    }),

  register: (data) => axios.post(`${defaultPath}/register`, data),

  refreshAccessToken: () =>
    axios.post(`${defaultPath}/refresh`, {}, { withCredentials: true }),

  logout: () =>
    axios.post(`${defaultPath}/logout`, {}, { withCredentials: true }),
};
export default authService;
