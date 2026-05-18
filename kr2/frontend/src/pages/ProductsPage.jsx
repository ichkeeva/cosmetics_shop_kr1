import React, { useState, useEffect } from 'react';
import { productAPI } from '../api/products';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

// Вспомогательная функция для преобразования VAPID-ключа
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function ProductsPage({ user, onShowProfile }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const { data } = await productAPI.getAll();
            setProducts(data);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить товар?')) return;
        try {
            await productAPI.delete(id);
            loadProducts();
        } catch (err) {
            alert('Ошибка удаления');
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingProduct) {
                await productAPI.update(editingProduct.id, formData);
            } else {
                await productAPI.create(formData);
                // Отправляем уведомление через WebSocket при добавлении товара
                if (typeof socket !== 'undefined' && socket) {
                    socket.emit('newProduct', { name: formData.title });
                }
            }
            setShowForm(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            alert('Ошибка сохранения');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    // Функция включения push-уведомлений
    const enableNotifications = async () => {
        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Необходимо разрешить уведомления');
                return;
            }
        }
        
        if (!('serviceWorker' in navigator)) {
            alert('Service Worker не поддерживается');
            return;
        }
        
        try {
            const registration = await navigator.serviceWorker.ready;
            // Замените на ваш публичный VAPID-ключ из server.js
            const VAPID_PUBLIC_KEY = 'BGOJ7LcWMv_kkpYx8Tn95txpPfKWKLA2-nuTxUYC_Ys1Y1fIzq4FNsy_zH6ZfyJ3wR5TEdfOCsxSD4FXXN1Y5yM';
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
            await fetch('http://localhost:3002/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });
            alert('✅ Уведомления включены!');
        } catch (err) {
            console.error('Ошибка подписки:', err);
            alert('❌ Ошибка при включении уведомлений');
        }
    };

    const canManageProducts = user?.role === 'seller' || user?.role === 'admin';
    const canDeleteProducts = user?.role === 'admin';

    if (loading) return <div className="loading">Загрузка...</div>;

    return (
        <div className="products-page">
            <div className="header">
                <h1>🛍️ Магазин косметики</h1>
                <div className="header-buttons">
                    <button onClick={onShowProfile}>👤 {user?.first_name}</button>
                    
                    {user?.role === 'admin' && (
                        <button className="btn-notify" onClick={enableNotifications}>
                            🔔 Включить уведомления
                        </button>
                    )}
                    
                    {canManageProducts && (
                        <button className="btn-add" onClick={() => setShowForm(true)}>
                            + Добавить товар
                        </button>
                    )}
                </div>
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={canManageProducts ? handleEdit : null}
                        onDelete={canDeleteProducts ? handleDelete : null}
                        showActions={canManageProducts}
                    />
                ))}
            </div>

            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onClose={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                    }}
                />
            )}
        </div>
    );
}