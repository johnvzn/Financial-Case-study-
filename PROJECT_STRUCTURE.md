# Project Structure

## Canonical Structure (current stage)

```text
case-study-app/
├── app/
│   ├── cases/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       └── button.tsx
├── lib/
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── PROJECT_RULES.md
├── README.md
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

## Responsibilities

- `app/page.tsx`: first screen (hero) of the portfolio homepage
- `app/cases/page.tsx`: base cases page (placeholder for future case studies)
- `app/layout.tsx`: shared app shell and metadata
- `app/globals.css`: global styles and design tokens
- `components/ui/button.tsx`: reusable button component
- `lib/utils.ts`: shared utility functions (`cn`)
- `prisma/schema.prisma`: database schema for future content
- `prisma.config.ts`: Prisma migration/runtime config
- `.env.example`: environment variable template

## Most Frequently Edited by Designer

- `app/page.tsx`
- `app/cases/page.tsx`
- `app/globals.css`
- `components/ui/button.tsx`
