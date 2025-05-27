import axios from "@/api/axios";

const defaultPath = "/user";
const userService = {
  findMe: () => axios.get(`${defaultPath}/me`),
  updateMe: () => axios.put(`${defaultPath}/me`, data),
  deleteMe: () => axios.patch(`${defaultPath}/me`, {}),

  findAll: async () => axios.get(`${defaultPath}`),
  findById: (id) => axios.get(`${defaultPath}/${id}`),
  update: (id, data) => axios.put(`${defaultPath}/${id}`, data),
  delete: (id) => axios.patch(`${defaultPath}/${id}`, {}),
};
export default userService;
