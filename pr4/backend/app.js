const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

// Разрешаем запросы с фронтенда (порт 3001)
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

// База данных товаров (10 товаров)
let products = [
    { id: nanoid(6), name: 'Увлажняющий крем', category: 'Уход за лицом', description: 'Интенсивное увлажнение на 24 часа', price: 1890, stock: 15, rating: 4.5 },
    { id: nanoid(6), name: 'Сыворотка с витамином С', category: 'Сыворотки', description: 'Осветляет кожу, выравнивает тон', price: 2450, stock: 8, rating: 4.8 },
    { id: nanoid(6), name: 'Очищающая пенка', category: 'Очищение', description: 'Мягкое очищение без сухости', price: 890, stock: 25, rating: 4.2 },
    { id: nanoid(6), name: 'Тоник с розой', category: 'Тоники', description: 'Увлажняет и освежает', price: 750, stock: 30, rating: 4.3 },
    { id: nanoid(6), name: 'Ночная маска', category: 'Маски', description: 'Восстанавливает кожу во сне', price: 1650, stock: 12, rating: 4.6 },
    { id: nanoid(6), name: 'BB-крем', category: 'Тональные средства', description: 'Легкое покрытие с SPF', price: 1250, stock: 10, rating: 4.4 },
    { id: nanoid(6), name: 'Гидрофильное масло', category: 'Очищение', description: 'Смывает макияж', price: 950, stock: 20, rating: 4.7 },
    { id: nanoid(6), name: 'Пилинг-скатка', category: 'Эксфолиация', description: 'Мягкое отшелушивание', price: 1100, stock: 18, rating: 4.5 },
    { id: nanoid(6), name: 'Крем для глаз', category: 'Уход за лицом', description: 'Сокращает темные круги', price: 1450, stock: 7, rating: 4.4 },
    { id: nanoid(6), name: 'Солнцезащитный крем', category: 'Защита', description: 'SPF 50', price: 1350, stock: 22, rating: 4.6 }
];

// GET - получить все товары
app.get('/api/products', (req, res) => {
    res.json(products);
});

// GET - получить товар по ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json(product);
});

// POST - создать новый товар
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        rating: rating || 0
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PATCH - обновить товар
app.patch('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    
    const { name, category, description, price, stock, rating } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    
    res.json(product);
});

// DELETE - удалить товар
app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Товар не найден' });
    products.splice(index, 1);
    res.status(204).send();
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🛍️ Сервер запущен на http://localhost:${port}`);
});