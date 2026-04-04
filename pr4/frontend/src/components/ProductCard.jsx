import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <span className="category">{product.category}</span>
            <p>{product.description}</p>
            <div className="details">
                <span className="price">{product.price} ₽</span>
                <span className="stock">В наличии: {product.stock} шт.</span>
                <span className="rating">⭐ {product.rating}</span>
            </div>
            <div className="actions">
                <button className="edit" onClick={() => onEdit(product)}>Редактировать</button>
                <button className="delete" onClick={() => onDelete(product.id)}>Удалить</button>
            </div>
        </div>
    );
}