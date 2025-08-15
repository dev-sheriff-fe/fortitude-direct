
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mock.redq.io/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
