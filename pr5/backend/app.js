const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ============================================
// SWAGGER КОНФИГУРАЦИЯ
// ============================================
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

// ============================================
// БАЗА ДАННЫХ
// ============================================
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

// ============================================
// СХЕМА PRODUCT ДЛЯ SWAGGER
// ============================================
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный ID
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена в рублях
 *         stock:
 *           type: number
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг (0-5)
 *       example:
 *         id: "abc123"
 *         name: "Увлажняющий крем"
 *         category: "Уход за лицом"
 *         description: "Интенсивное увлажнение"
 *         price: 1890
 *         stock: 15
 *         rating: 4.5
 */

// ============================================
// GET /api/products - ПОЛУЧИТЬ ВСЕ ТОВАРЫ
// ============================================
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(products);
});

// ============================================
// GET /api/products/:id - ПОЛУЧИТЬ ТОВАР ПО ID
// ============================================
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
});

// ============================================
// POST /api/products - СОЗДАТЬ ТОВАР
// ============================================
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новый крем"
 *               category:
 *                 type: string
 *                 example: "Уход за лицом"
 *               description:
 *                 type: string
 *                 example: "Описание товара"
 *               price:
 *                 type: number
 *                 example: 1500
 *               stock:
 *                 type: number
 *                 example: 10
 *               rating:
 *                 type: number
 *                 example: 4.5
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Неверные данные
 */
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;
    
    if (!name || !category || !description || !price || !stock) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
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

// ============================================
// PATCH /api/products/:id - ОБНОВИТЬ ТОВАР
// ============================================
/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар (частично)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Товар успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.patch('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { name, category, description, price, stock, rating } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    
    res.json(product);
});

// ============================================
// DELETE /api/products/:id - УДАЛИТЬ ТОВАР
// ============================================
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удалён
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    products.splice(index, 1);
    res.status(204).send();
});

// ============================================
// ЗАПУСК СЕРВЕРА
// ============================================
app.listen(port, () => {
    console.log(`\n🛍️  Сервер интернет-магазина косметики запущен!`);
    console.log(`📍 API: http://localhost:${port}/api/products`);
    console.log(`📚 Swagger документация: http://localhost:${port}/api-docs\n`);
});