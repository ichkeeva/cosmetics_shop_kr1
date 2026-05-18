// ========== ФАЙЛ ДЛЯ ХРАНЕНИЯ ДАННЫХ ==========
// Здесь хранятся: пользователи, хеши паролей, access-токены, refresh-токены

const fs = require('fs');
const path = require('path');

// Путь к файлу для сохранения данных
const DATA_FILE = path.join(__dirname, 'data.json');

// ========== ИНИЦИАЛИЗАЦИЯ ДАННЫХ ==========
let users = [];
let accessTokens = new Set();   // ← НОВОЕ: хранилище access-токенов
let refreshTokens = new Set();

// ========== ЗАГРУЗКА ДАННЫХ ИЗ ФАЙЛА ==========
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const rawData = fs.readFileSync(DATA_FILE, 'utf8');
            const data = JSON.parse(rawData);
            users = data.users || [];
            accessTokens = new Set(data.accessTokens || []);
            refreshTokens = new Set(data.refreshTokens || []);
            console.log(`📂 Данные загружены:`);
            console.log(`   👥 Пользователей: ${users.length}`);
            console.log(`   🎫 Access-токенов: ${accessTokens.size}`);
            console.log(`   🎫 Refresh-токенов: ${refreshTokens.size}`);
        } else {
            console.log('📂 Файл данных не найден, создаётся новый');
            saveData();
        }
    } catch (err) {
        console.error('Ошибка загрузки данных:', err);
    }
}

// ========== СОХРАНЕНИЕ ДАННЫХ В ФАЙЛ ==========
function saveData() {
    const data = {
        users: users.map(user => ({ ...user })),
        accessTokens: Array.from(accessTokens),
        refreshTokens: Array.from(refreshTokens)
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log(`💾 Данные сохранены:`);
    console.log(`   👥 Пользователей: ${users.length}`);
    console.log(`   🎫 Access-токенов: ${accessTokens.size}`);
    console.log(`   🎫 Refresh-токенов: ${refreshTokens.size}`);
}

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЯМИ ==========
function addUser(user) {
    users.push(user);
    saveData();
    return user;
}

function findUserByEmail(email) {
    return users.find(u => u.email === email);
}

function findUserById(id) {
    return users.find(u => u.id === id);
}

function getAllUsers() {
    return users;
}

function updateUser(id, updates) {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        saveData();
        return users[index];
    }
    return null;
}

function deleteUser(id) {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        saveData();
        return true;
    }
    return false;
}

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ACCESS-ТОКЕНАМИ ==========
function addAccessToken(token) {
    accessTokens.add(token);
    saveData();
}

function hasAccessToken(token) {
    return accessTokens.has(token);
}

function removeAccessToken(token) {
    accessTokens.delete(token);
    saveData();
}

function removeAllAccessTokens() {
    accessTokens.clear();
    saveData();
}

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С REFRESH-ТОКЕНАМИ ==========
function addRefreshToken(token) {
    refreshTokens.add(token);
    saveData();
}

function hasRefreshToken(token) {
    return refreshTokens.has(token);
}

function removeRefreshToken(token) {
    refreshTokens.delete(token);
    saveData();
}

function removeAllRefreshTokens() {
    refreshTokens.clear();
    saveData();
}

// ========== ФУНКЦИЯ ДЛЯ ВЫВОДА ВСЕХ ДАННЫХ В КОНСОЛЬ ==========
function showAllData() {
    console.log('\n========== ТЕКУЩИЕ ДАННЫЕ ==========');
    
    console.log(`\n👥 ПОЛЬЗОВАТЕЛИ (${users.length}):`);
    users.forEach(u => {
        console.log(`   ┌─────────────────────────────────────────`);
        console.log(`   │ ID: ${u.id}`);
        console.log(`   │ Email: ${u.email}`);
        console.log(`   │ Имя: ${u.first_name} ${u.last_name}`);
        console.log(`   │ Роль: ${u.role}`);
        console.log(`   │ Активен: ${u.isActive}`);
        console.log(`   │ Хеш пароля: ${u.passwordHash.substring(0, 40)}...`);
        console.log(`   └─────────────────────────────────────────`);
    });
    
    console.log(`\n🎫 ACCESS-ТОКЕНЫ (${accessTokens.size}):`);
    if (accessTokens.size === 0) {
        console.log(`   └── (нет активных токенов)`);
    } else {
        Array.from(accessTokens).forEach((token, i) => {
            console.log(`   ${i + 1}. ${token.substring(0, 60)}...`);
        });
    }
    
    console.log(`\n🎫 REFRESH-ТОКЕНЫ (${refreshTokens.size}):`);
    if (refreshTokens.size === 0) {
        console.log(`   └── (нет активных токенов)`);
    } else {
        Array.from(refreshTokens).forEach((token, i) => {
            console.log(`   ${i + 1}. ${token.substring(0, 60)}...`);
        });
    }
    
    console.log('\n=====================================\n');
}

// ========== ЭКСПОРТ ==========
module.exports = {
    // Данные
    users,
    accessTokens,
    refreshTokens,
    
    // Загрузка/сохранение
    loadData,
    saveData,
    showAllData,
    
    // Пользователи
    addUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    
    // Access-токены
    addAccessToken,
    hasAccessToken,
    removeAccessToken,
    removeAllAccessTokens,
    
    // Refresh-токены
    addRefreshToken,
    hasRefreshToken,
    removeRefreshToken,
    removeAllRefreshTokens
};