import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки');
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
            await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
            loadProducts();
        } catch (err) {
            alert('Ошибка удаления');
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingProduct) {
                await fetch(`http://localhost:3000/api/products/${editingProduct.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                await fetch('http://localhost:3000/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }
            setShowForm(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            alert('Ошибка сохранения');
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;

    return (
        <div className="container">
            <div className="header">
                <h1>🛍️ Магазин косметики</h1>
                <button onClick={() => setShowForm(true)}>+ Добавить</button>
            </div>
            <div className="products">
                {products.map(p => (
                    <ProductCard 
                        key={p.id} 
                        product={p} 
                        onEdit={(product) => {
                            setEditingProduct(product);
                            setShowForm(true);
                        }} 
                        onDelete={handleDelete} 
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