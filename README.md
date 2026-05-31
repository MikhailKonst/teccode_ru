# TechCode RU

Корпоративный сайт компании TechCode — публичный маркетинговый сайт с каталогом программных модулей и документацией, плюс админ-панель для управления контентом.

## Стек

| Часть    | Технологии                                                    |
|----------|---------------------------------------------------------------|
| Frontend | Vue 3 (Composition API), TypeScript, Pinia, Vue Router, SCSS |
| Backend  | Express.js, Node.js 22                                        |
| БД       | PostgreSQL + Prisma ORM                                       |
| Сборка   | Vite 5                                                        |
| Деплой   | Docker + docker-compose                                       |

---

## Локальная разработка

### Требования

- Node.js 22+
- Docker + Docker Compose (для БД)

### Установка

```bash
git clone <repo>
cd teccode_ru
npm install
cp .env.example .env   # заполни ADMIN_LOGIN, ADMIN_PASSWORD
```

### Запуск

```bash
# 1. Поднять PostgreSQL
docker compose up -d db

# 2. Применить миграции
npm run prisma:deploy

# 3. Запустить frontend (Vite :5173) + backend (Express :3001)
npm run dev:full
```

Открой http://localhost:5173 — сайт, http://localhost:5173/admin — админ-панель.

---

## Команды

```bash
npm run dev           # только Vite dev-сервер
npm run dev:server    # только Express с hot-reload (nodemon)
npm run dev:full      # оба параллельно (npm-run-all2)

npm run build         # type-check + production сборка
npm run type-check    # vue-tsc
npm run lint          # ESLint --fix
npm run format        # Prettier src/

npm run prisma:migrate  # создать новую миграцию (dev)
npm run prisma:deploy   # применить существующие миграции (prod/CI)
npm run prisma:generate # обновить Prisma Client

npm run db:up         # docker compose up -d db
npm run db:down       # docker compose down
```

---

## Переменные окружения

Скопируй `.env.example` → `.env` и заполни:

| Переменная        | Обязательна | Описание |
|-------------------|-------------|----------|
| `DATABASE_URL`    | ✅ всегда   | PostgreSQL connection string |
| `ADMIN_LOGIN`     | ✅ всегда   | Логин администратора |
| `ADMIN_PASSWORD`  | ✅ всегда   | Пароль администратора |
| `PORT`            | нет         | Порт Express (default: 3001) |
| `NODE_ENV`        | нет         | `production` включает доп. проверки |
| `TRUST_PROXY`     | нет         | `1` — если за nginx/Traefik |
| `HSTS`            | нет         | `1` — включить Strict-Transport-Security |
| `CORS_ORIGIN`     | нет         | Список origins через запятую (пусто = CORS отключён) |
| `SMTP_HOST/PORT/USER/PASS/FROM` | нет | SMTP для отправки заявок |
| `MAIL_TO`         | нет         | Куда пересылать заявки с формы |

---

## Docker (продакшен)

```bash
cp .env.example .env   # заполнить все переменные
docker compose -f docker-compose.prod.yml up -d --build
```

Контейнер при старте автоматически применяет миграции (`prisma migrate deploy`) и запускает сервер. Фронтенд собирается в `dist/` и раздаётся Express.

---

## Структура проекта

```
src/
  components/     # компоненты, организованы по страницам
  pages/          # маршрутные страницы
  admin/          # изолированный модуль админ-панели
    pages/        # AdminPanelPage, AdminModuleEditPage, AdminContactsPage
    components/   # RichTextEditor
    api/          # admin API клиент
    stores/       # Pinia стор авторизации
  api/            # публичный HTTP клиент (http.ts, software.ts)
  composables/    # useScrollReveal
  router/         # маршруты с meta requiresAdmin / guestOnly
  assets/styles/  # SCSS переменные, миксины, анимации

server/
  index.js        # Express приложение, все эндпоинты
  lib/
    auth.js       # сессии Bearer-токенов, getAdminCredentials
    prisma.js     # Prisma Client singleton
    mailer.js     # nodemailer (опционально)
    slugify.js    # генерация slug

prisma/
  schema.prisma   # Module, Document, Session, ContactSubmission
  migrations/     # SQL миграции
```

---

## API (краткий обзор)

### Публичные
- `GET /api/health` — статус сервера и БД
- `GET /api/modules` — список модулей
- `GET /api/modules/:slug` — модуль + список документов
- `GET /api/documents/:id` — содержимое документа
- `POST /api/contact` — отправить заявку

### Админ (Bearer-токен обязателен)
- `POST /api/auth/login` — получить токен
- `POST /api/auth/logout` — инвалидировать токен
- `GET/POST/PUT/DELETE /api/admin/modules` — CRUD модулей
- `POST /api/admin/modules/:id/documents` — создать документ
- `PUT/DELETE /api/admin/documents/:id` — редактировать/удалить документ
- `GET/DELETE /api/admin/contacts` — журнал заявок
- `POST /api/uploads` — загрузить изображение (base64 → файл)
