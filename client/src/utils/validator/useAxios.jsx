import axios from "axios";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,  // Ensure cookies are sent
  });

  // Remove this Authorization header part since you're using cookies for auth.
  axiosInstance.interceptors.request.use(
    (config) => {
      // const auth = JSON.parse(localStorage.getItem("auth"));
      // if (auth?.token) {
      //   config.headers.Authorization = `Bearer ${auth.token}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default useAxios;
