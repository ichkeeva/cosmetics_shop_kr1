import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import ProfilePage from './pages/ProfilePage';
import { authAPI } from './api/auth';
import './App.css';

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleRegister = async (userData) => {
        try {
            await authAPI.register(userData);
            setError('');
            // После регистрации переключаемся на вход
            setIsLogin(true);
            alert('Регистрация успешна! Теперь войдите.');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        }
    };

    const handleLogin = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setIsAuthenticated(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка входа');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
    };

    const handleSubmit = (data) => {
        if (isLogin) {
            handleLogin(data);
        } else {
            handleRegister(data);
        }
    };

    if (isAuthenticated) {
        return <ProfilePage onLogout={handleLogout} />;
    }

    return (
        <div className="app">
            <div className="auth-container">
                <div className="tabs">
                    <button 
                        className={isLogin ? 'active' : ''} 
                        onClick={() => { setIsLogin(true); setError(''); }}
                    >
                        Вход
                    </button>
                    <button 
                        className={!isLogin ? 'active' : ''} 
                        onClick={() => { setIsLogin(false); setError(''); }}
                    >
                        Регистрация
                    </button>
                </div>
                <AuthForm 
                    isLogin={isLogin} 
                    onSubmit={handleSubmit} 
                    error={error}
                />
            </div>
        </div>
    );
}

export default App;
