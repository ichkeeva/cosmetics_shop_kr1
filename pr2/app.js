// Подключение Express
const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// База данных товаров (магазин косметики)
let products = [
    { id: 1, name: "Увлажняющий крем с гиалуроновой кислотой", price: 1890 },
    { id: 2, name: "Сыворотка с витамином С", price: 2450 },
    { id: 3, name: "Очищающая пенка для умывания", price: 890 },
    { id: 4, name: "Тоник для лица с розой", price: 750 },
    { id: 5, name: "Ночная маска для восстановления", price: 1650 }
];

// ======== МАРШРУТЫ (CRUD операции) ========

// Главная страница
app.get('/', (req, res) => {
    res.send('Добро пожаловать в API магазина косметики!');
});

// CREATE - Добавить новый товар (POST)
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// READ - Получить все товары (GET)
app.get('/products', (req, res) => {
    res.json(products);
});

// READ - Получить товар по ID (GET)
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

// UPDATE - Обновить товар (PUT)
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const product = products.find(p => p.id === id);
    
    if (product) {
        product.name = name;
        product.price = price;
        res.json(product);
    } else {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

// DELETE - Удалить товар (DELETE)
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        products.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});