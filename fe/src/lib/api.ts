import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/";

export const axiosInstance = axios.create({
  baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Refresh — cookie refreshToken tự đính vào request này
        await axios.post(
          `${baseURL}/auth/refresh`,
          {},
        )
        // BE set cookie mới tự động
        return axiosInstance(originalRequest)  // retry với cookie mới
      } catch {
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)