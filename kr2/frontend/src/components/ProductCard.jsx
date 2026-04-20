import React from 'react';

export default function ProductCard({ product, onEdit, onDelete, showActions }) {
    return (
        <div className="product-card">
            {product.image && (
                <img src={product.image} alt={product.title} className="product-image" />
            )}
            <h3>{product.title}</h3>
            <span className="category">{product.category}</span>
            <p>{product.description}</p>
            <div className="details">
                <span className="price">{product.price} ₽</span>
                <span className="stock">В наличии: {product.stock || 0} шт.</span>
                <span className="rating">⭐ {product.rating || 0}</span>
            </div>
            {showActions && (
                <div className="actions">
                    {onEdit && <button className="edit" onClick={() => onEdit(product)}>✏️ Редактировать</button>}
                    {onDelete && <button className="delete" onClick={() => onDelete(product.id)}>🗑️ Удалить</button>}
                </div>
            )}
        </div>
    );
}
