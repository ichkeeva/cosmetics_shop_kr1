import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.on('productAdded', (product) => {
            setNotifications(prev => [{ id: Date.now(), text: `🛍️ Новый товар: ${product.name}`, time: new Date() }, ...prev]);
            setTimeout(() => setNotifications(prev => prev.slice(1)), 5000);
        });
    }, []);

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            {notifications.map(n => (
                <div key={n.id} style={{ background: '#ff6b9d', color: 'white', padding: 12, borderRadius: 8, marginBottom: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    {n.text}
                </div>
            ))}
        </div>
    );
}