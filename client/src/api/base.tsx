import { logoutUser } from "../redux/slices/userSlice";
import { store } from "../redux/store";
import axios, { AxiosRequestConfig } from "axios";
export const client = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json"
  },
});

export const AxiosAPI = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json"
  },
});

AxiosAPI.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const state = store.getState();
    const token = state.user?.currentUser?.accessToken;
    
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logoutUser());
    }
  }
);

// const refreshToken = async () => {
//   try {
//     const token =  store.getState().user.currentUser.refreshToken;

//     const {data}:any =  await client.post("/auth/refresh", { token: token });
//     return data
//   } catch (err) {
//   }
// };
