const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

// VAPID-ключи (сгенерируйте свои: npx web-push generate-vapid-keys)
const vapidKeys = {
    publicKey: 'BGOJ7LcWMv_kkpYx8Tn95txpPfKWKLA2-nuTxUYC_Ys1Y1fIzq4FNsy_zH6ZfyJ3wR5TEdfOCsxSD4FXXN1Y5yM',
    privateKey: 'VK3UaytUe-kZkIgKTXAB1v0mQiEzFrGxchZ_BBYde2g'
};

webpush.setVapidDetails(
    'mailto:admin@cosmetics.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend/build'));

let subscriptions = [];

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    console.log('✅ Клиент подключён:', socket.id);
    
    socket.on('newProduct', (product) => {
        io.emit('productAdded', product);
        
        const payload = JSON.stringify({
            title: '🛍️ Новый товар',
            body: `${product.name} добавлен в магазин`
        });
        
        subscriptions.forEach(sub => {
            webpush.sendNotification(sub, payload).catch(err => console.error('Push error:', err));
        });
    });
    
    socket.on('disconnect', () => {
        console.log('❌ Клиент отключён:', socket.id);
    });
});

app.post('/subscribe', (req, res) => {
    subscriptions.push(req.body);
    res.status(201).json({ message: 'Подписка сохранена' });
});

app.post('/unsubscribe', (req, res) => {
    const { endpoint } = req.body;
    subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
    res.status(200).json({ message: 'Подписка удалена' });
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`🚀 WebSocket сервер запущен на http://localhost:${PORT}`);
});
