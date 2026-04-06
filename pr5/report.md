# Практическая работа №5
## Расширенный REST API (Swagger)

**Студент:** Ичкеева Софья
**Дата:** 06.04.2026

---

## Что сделано:

1. Установлены пакеты:
   - `swagger-jsdoc`
   - `swagger-ui-express`

2. Добавлена конфигурация Swagger в `backend/app.js`

3. Написаны JSDoc комментарии для всех маршрутов:
   - `GET /api/products` — получить все товары
   - `GET /api/products/{id}` — получить товар по ID
   - `POST /api/products` — создать новый товар
   - `PATCH /api/products/{id}` — обновить товар
   - `DELETE /api/products/{id}` — удалить товар

4. Создана схема `Product` для документации

---

## Запуск проекта:

```bash
cd backend
npm install
node app.js