const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let products = [
    { id: 1, name: "Увлажняющий крем", price: 1890 },
    { id: 2, name: "Сыворотка с витамином С", price: 2450 },
    { id: 3, name: "Очищающая пенка", price: 890 },
    { id: 4, name: "Тоник для лица", price: 750 },
    { id: 5, name: "Ночная маска", price: 1650 }
];

// GET все товары
app.get('/products', (req, res) => {
    res.json(products);
});

// GET товар по ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: "Товар не найден" });
    }
});

// POST создать товар
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

// PATCH обновить товар (частично)
app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const { price } = req.body;
    if (price !== undefined) {
        product.price = price;
    }
    
    res.json(product);
});

// DELETE удалить товар
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});