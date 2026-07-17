# Ругрейн — MVP Аграрной биржи

## Быстрый старт

### 1. Клонировать и перейти в папку
```bash
cd rugrain-mvp
```

### 2. Скопировать .env
```bash
cp backend/.env.example backend/.env
# Отредактировать backend/.env — добавить MAX_BOT_TOKEN и FNS_API_KEY
```

### 3. Запустить всё через Docker
```bash
docker-compose up -d
```

### 4. Инициализировать БД
```bash
docker-compose exec backend npx prisma migrate dev --name init
```

### 4.1. Наполнить демо-данными (опционально, но рекомендуется)
```bash
docker-compose exec backend npm run seed
```
Создаст 6 демо-продавцов (с орг. данными и рейтингами) и 6 объявлений — теми же данными, что раньше были захардкожены в `frontend/src/data/mock.js`.


### 5. Открыть
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- MinIO Console: http://localhost:9001 (rugrain / rugrainminio123)

## Структура проекта

```
rugrain-mvp/
├── docker-compose.yml      # Локальная разработка
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma   # Схема БД
│   └── src/
│       ├── index.js        # Точка входа
│       ├── routes/         # API endpoints
│       ├── services/       # Бизнес-логика
│       └── middleware/   # Auth, валидация
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx        # Точка входа
        ├── App.jsx         # Роутинг
        ├── index.css       # Tailwind + дизайн-система
        ├── components/     # UI-компоненты
        ├── pages/          # Страницы
        ├── hooks/          # React hooks
        └── store/          # Zustand store
```

## Технологический стек

| Слой | Технология |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Zustand + TanStack Query |
| Backend | Node.js + Fastify + Prisma ORM |
| БД | PostgreSQL 16 |
| Кэш | Redis 7 |
| Хранилище | MinIO (S3-совместимое) |
| Auth | MAX Bot API + JWT |

## API Endpoints (план)

- `POST /api/auth/max` — Вход через MAX
- `GET /api/auth/me` — Текущий пользователь
- `GET /api/listings` — Лента объявлений
- `POST /api/listings` — Создать объявление
- `GET /api/auctions` — Лента аукционов
- `POST /api/auctions/:id/bid` — Сделать ставку
- `GET /api/requests` — Заявки
- `POST /api/requests/:id/approve` — Одобрить заявку
- `GET /api/erp` — Складские остатки
- `POST /api/verification` — Загрузить документы
- `GET /api/contragent/:inn` — Проверка контрагента
- `GET /api/admin/dashboard` — Админ-дашборд

## Переменные окружения

| Переменная | Описание |
|-----------|----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Секрет для JWT-токенов |
| `MAX_BOT_TOKEN` | Токен MAX Bot API |
| `FNS_API_KEY` | Ключ api-cloud.ru/pb_nalog |
| `PAYMENT_*` | Настройки эквайринга |

## Лицензия

Проприетарное ПО. Все права защищены.
