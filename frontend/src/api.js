import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND_URL ,
    // baseURL: "https://google-auth-backend-g1v3.onrender.com/auth/",
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);