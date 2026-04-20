const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3007;

app.use(cors());
app.use(express.json());

// ========== SWAGGER ==========
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth API',
            version: '1.0.0',
            description: 'API для регистрации и входа'
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./app.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== БАЗА ДАННЫХ (в памяти) ==========
// Поля: id, email, first_name, last_name, passwordHash
let users = [];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
const findUserByEmail = (email) => users.find(u => u.email === email);

// ========== МАРШРУТЫ ==========

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Иванов
 *     responses:
 *       201:
 *         description: Пользователь создан
 *       400:
 *         description: Пользователь уже существует или не хватает полей
 */
app.post('/api/auth/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (findUserByEmail(email)) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
        id: nanoid(8),
        email,
        first_name,
        last_name,
        passwordHash
    };
    users.push(newUser);

    res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
    });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Неверные учётные данные
 */
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const user = findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Неверные учётные данные' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return res.status(401).json({ error: 'Неверные учётные данные' });
    }

    res.json({
        message: 'Вход выполнен успешно',
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        }
    });
});

app.listen(port, () => {
    console.log(`✅ Сервер запущен: http://localhost:${port}`);
    console.log(`📚 Swagger: http://localhost:${port}/api-docs`);
});