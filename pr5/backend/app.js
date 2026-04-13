const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ========== SWAGGER SETUP ==========
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cosmetics Shop API',
            version: '1.0.0',
            description: 'API для интернет-магазина косметики'
        },
        servers: [{ url: `http://localhost:${port}` }]
    },
    apis: ['./app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== STATIC IMAGES ==========
app.use('/images', express.static('/Users/ichkeevas/Desktop/cosmetic/pr4/frontend/public/images'));

// ========== PRODUCTS DATA ==========
let products = [
    { id: nanoid(6), name: 'Увлажняющий крем', category: 'Уход за лицом', description: 'Интенсивное увлажнение', price: 1890, stock: 15, rating: 4.5, image: '/images/cerave-cream.jpg' },
    { id: nanoid(6), name: 'Сыворотка с витамином С', category: 'Сыворотки', description: 'Осветляет кожу', price: 2450, stock: 8, rating: 4.8, image: '/images/vitamin-c-serum.jpg' },
    { id: nanoid(6), name: 'Очищающая пенка', category: 'Очищение', description: 'Мягкое очищение', price: 890, stock: 25, rating: 4.2, image: '/images/needly-cleansing-gel.jpg' },
    { id: nanoid(6), name: 'Тоник с розой', category: 'Тоники', description: 'Увлажняет и освежает', price: 750, stock: 30, rating: 4.3, image: '/images/pixi-rose-tonic.jpg' },
    { id: nanoid(6), name: 'Ночная маска', category: 'Маски', description: 'Восстанавливает кожу', price: 1650, stock: 12, rating: 4.6, image: '/images/night-mask.webp' },
    { id: nanoid(6), name: 'BB-крем', category: 'Тональные средства', description: 'Легкое покрытие', price: 1250, stock: 10, rating: 4.4, image: '/images/bb-creme-erborian.jpg' },
    { id: nanoid(6), name: 'Гидрофильное масло', category: 'Очищение', description: 'Смывает макияж', price: 950, stock: 20, rating: 4.7, image: '/images/round-lab-oil.jpg' },
    { id: nanoid(6), name: 'Пилинг-скатка', category: 'Эксфолиация', description: 'Мягкое отшелушивание', price: 1100, stock: 18, rating: 4.5, image: '/images/shiseido-peeling.jpg' },
    { id: nanoid(6), name: 'Крем для глаз', category: 'Уход за лицом', description: 'Сокращает темные круги', price: 1450, stock: 7, rating: 4.4, image: '/images/axis-y-eye-serum.jpg' },
    { id: nanoid(6), name: 'Солнцезащитный крем', category: 'Защита', description: 'SPF 50', price: 1350, stock: 22, rating: 4.6, image: '/images/sunscreen-spf50.jpg' }
];

// ========== API ROUTES ==========
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json(product);
});

app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock, rating, image } = req.body;
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        rating: rating || 0,
        image: image || '/images/cerave-cream.jpg'
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    
    const { name, category, description, price, stock, rating, image } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    if (image !== undefined) product.image = image;
    
    res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Товар не найден' });
    products.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`🛍️ Сервер запущен на http://localhost:${port}`);
    console.log(`📚 Swagger: http://localhost:${port}/api-docs`);
    console.log(`📷 Картинки: http://localhost:${port}/images/cerave-cream.jpg`);
});