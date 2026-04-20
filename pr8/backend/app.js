const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3008;

app.use(cors());
app.use(express.json());

// ========== СЕКРЕТЫ И НАСТРОЙКИ ==========
const JWT_SECRET = 'your_jwt_secret_key_here';
const ACCESS_EXPIRES_IN = '15m';

// ========== БАЗА ДАННЫХ (в памяти) ==========
// Поля: id, email, first_name, last_name, passwordHash
let users = [];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
const findUserByEmail = (email) => users.find(u => u.email === email);
const findUserById = (id) => users.find(u => u.id === id);

// Генерация access-токена
function generateAccessToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        },
        JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
    );
}

// ========== MIDDLEWARE ДЛЯ ПРОВЕРКИ ТОКЕНА ==========
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// ========== SWAGGER ==========
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth API with JWT',
            version: '1.0.0',
            description: 'API для регистрации, входа и получения информации о пользователе'
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./app.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========== МАРШРУТЫ ==========

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     security: []
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
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: qwerty123 }
 *               first_name: { type: string, example: Иван }
 *               last_name: { type: string, example: Иванов }
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
 *     summary: Вход в систему (выдаёт JWT токен)
 *     tags: [Auth]
 *     security: []
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
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает accessToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
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

    const accessToken = generateAccessToken(user);

    res.json({
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        }
    });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *       401:
 *         description: Неавторизован
 */
app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = findUserById(req.user.sub);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    });
});

app.listen(port, () => {
    console.log(`✅ Сервер запущен: http://localhost:${port}`);
    console.log(`📚 Swagger: http://localhost:${port}/api-docs`);
});