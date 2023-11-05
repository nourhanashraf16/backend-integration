import axios from "axios";
export const instanceAxios = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});
// Add an interceptor to include the authorization header
instanceAxios.interceptors.request.use(
  (config) => {
    // Add your authorization header logic here
    config.headers["Authorization"] = "Bearer your-access-token"; // Replace with your actual token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
