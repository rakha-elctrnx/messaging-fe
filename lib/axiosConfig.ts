import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    "X-App-Id": process.env.NEXT_PUBLIC_MESSAGING_APP_ID,
    "X-Secret-Key": process.env.NEXT_PUBLIC_MESSAGING_SECRET_KEY,
  },
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`
            return axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise((resolve, reject) => {
        axiosInstance
          .post("/refresh-token", {
            refreshToken: localStorage.getItem("refreshToken"),
          })
          .then(({ data }) => {
            localStorage.setItem("token", data.token)
            localStorage.setItem("refreshToken", data.refreshToken)
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
            originalRequest.headers["Authorization"] = `Bearer ${data.token}`
            processQueue(null, data.token)
            resolve(axiosInstance(originalRequest))
          })
          .catch((err) => {
            processQueue(err, null)
            reject(err)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

