import React, { useState, useEffect } from 'react';
import { productAPI } from '../api/products';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

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
            }
            setShowForm(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            alert('Ошибка сохранения');
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
                    {canManageProducts && (
                        <button className="btn-add" onClick={() => setShowForm(true)}>+ Добавить товар</button>
                    )}
                </div>
            </div>
            <div className="products-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={canManageProducts ? setEditingProduct : null}
                        onDelete={canDeleteProducts ? handleDelete : null}
                        showActions={canManageProducts}
                    />
                ))}
            </div>
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditingProduct(null); }}
                />
            )}
        </div>
    );
}
