# Project Rules

## Tech Stack (MVP, mandatory)

- Framework: Next.js 16 (App Router) + TypeScript
- UI: Tailwind CSS v4 + shadcn/ui patterns (`components/ui`, `cn()` utility)
- Backend: Next.js Route Handlers (monolith, без отдельного backend-сервиса)
- Database: PostgreSQL (Supabase)
- ORM: Prisma 7 + `@prisma/adapter-pg`
- Deploy: Vercel

## Engineering Rules

- Делаем monolith-first: один репозиторий, один runtime, минимум инфраструктуры.
- Приоритет: скорость поставки и простота поддержки одним разработчиком.
- Новые зависимости добавляем только если они реально ускоряют разработку.
- Схему БД и миграции ведём только через Prisma.
- Не вводим микросервисы, очереди и сложный DevOps без явной необходимости.

## Accepted Constraints

- Есть зависимость от managed-сервисов (Supabase, Vercel).
- На старте ограничена гибкость backend-архитектуры.
- При существенном росте нагрузки/требований возможен инфраструктурный рефакторинг.
