import axios from "axios";

const baseUrl = "http://crm-be-v2-923396622.ap-southeast-1.elb.amazonaws.com:3001/";

export const axiosInstance = axios.create({
  baseURL: baseUrl || process.env.NEXT_PUBLIC_API_URL,
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
        await axiosInstance.post(
          `${baseUrl}auth/refresh-token`,
          {},
        )
        // BE set cookie mới tự động
        return axiosInstance(originalRequest)  // retry với cookie mới
      } catch {
        window.location.href = 'login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)