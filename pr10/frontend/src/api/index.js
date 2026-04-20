import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3009/api',
    headers: { 'Content-Type': 'application/json' }
});

// Перехватчик запросов: добавляем токен в заголовок
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Перехватчик ответов: обновляем токен при ошибке 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                // Нет refresh токена — выходим
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }
            
            try {
                const response = await axios.post('http://localhost:3000/api/auth/refresh', {
                    refreshToken
                });
                
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;