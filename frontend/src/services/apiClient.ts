import axios from 'axios';

export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('policy_compass_token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
