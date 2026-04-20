import React, { useState, useEffect } from 'react';

export default function ProductForm({ product, onSave, onClose }) {
    const [formData, setFormData] = useState({
        title: '', category: '', description: '', price: '', stock: '', rating: '', image: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title,
                category: product.category,
                description: product.description,
                price: product.price,
                stock: product.stock,
                rating: product.rating,
                image: product.image || ''
            });
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{product ? 'Редактировать' : 'Новый товар'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Название" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <input type="text" placeholder="Категория" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                    <textarea placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <input type="number" placeholder="Цена" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    <input type="number" placeholder="Количество" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                    <input type="number" placeholder="Рейтинг" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} step="0.1" />
                    <input type="text" placeholder="URL картинки" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Отмена</button>
                        <button type="submit">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
