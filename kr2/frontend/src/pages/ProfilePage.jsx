import React from 'react';

export default function ProfilePage({ user, onLogout }) {
    return (
        <div className="profile">
            <h2>Профиль</h2>
            <p>Email: {user?.email}</p>
            <p>Имя: {user?.first_name} {user?.last_name}</p>
            <p>Роль: <strong>{user?.role}</strong></p>
            <button onClick={onLogout}>Выйти</button>
        </div>
    );
}
