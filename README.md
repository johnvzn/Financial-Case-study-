# UX/UI Portfolio Starter

Базовый старт проекта под личное портфолио UX/UI дизайнера.

## Project Rules

Каноничные правила стека и архитектуры:
[`PROJECT_RULES.md`](./PROJECT_RULES.md)

Каноничная структура проекта:
[`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md)

## Запуск

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## Текущий этап

- Главная страница с первым экраном (hero)
- Базовая страница `/cases` как заготовка под кейсы
- Минимальная структура без лишних слоёв

## Deploy on Render

Проект готов к деплою как `Web Service` на Render.

Что уже настроено:

- `render.yaml` с командами сборки и запуска
- `npm run build` успешно проходит в production-режиме
- приложение стартует через `next start`, что подходит для Render Web Service

Быстрый сценарий деплоя:

```bash
git push
```

1. Откройте [Render Dashboard](https://dashboard.render.com/).
2. Нажмите `New` -> `Web Service`.
3. Подключите GitHub/GitLab-репозиторий с папкой `case-study-app`.
4. Если Render обнаружит `render.yaml`, подтвердите создание сервиса по blueprint.
5. Дождитесь первого deploy.

Если позже в приложении начнёт использоваться база данных или Supabase на рантайме, добавьте в Render переменные окружения из `.env.example`.
