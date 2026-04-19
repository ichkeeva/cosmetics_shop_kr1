import React, { useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

export default function ProfilePage({ onLogout }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await authAPI.getMe();
                setUser(response.data);
            } catch (err) {
                console.error(err);
                onLogout();
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [onLogout]);

    if (loading) return <div>Загрузка...</div>;
    if (!user) return null;

    return (
        <div className="profile">
            <h1>Добро пожаловать, {user.first_name}!</h1>
            <p>Email: {user.email}</p>
            <p>Имя: {user.first_name} {user.last_name}</p>
            <button onClick={onLogout}>Выйти</button>
        </div>
    );
}