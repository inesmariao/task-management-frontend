import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-task-management-2xvy.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
