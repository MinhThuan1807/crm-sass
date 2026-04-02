---
inclusion: always
---

# Project: Multi-Tenant CRM SaaS

Đây là ứng dụng CRM B2B multi-tenant cho sales team. Gồm 2 phần:

- `be/` — NestJS backend
- `fe/` — Next.js 16 frontend

## Tech Stack

### Backend (`be/`)

- NestJS + TypeScript
- PostgreSQL + Prisma ORM (generated client tại `be/generated/prisma-client`)
- JWT auth + Passport.js + Refresh Token
- Zod validation (nestjs-zod)
- bcrypt cho password hashing

### Frontend (`fe/`)

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui + Radix UI
- TanStack React Query (data fetching/caching)
- React Hook Form + Zod
- Axios (HTTP client)

## Database Schema (Prisma)

Models: Tenant, User, Contact, Deal, Activity, Task, AiSuggestion, RefreshToken

Enums:

- Role: ADMIN | MANAGER | SALES_REP
- DealStage: PROSPECT | QUALIFIED | PROPOSAL | CLOSED_WON | CLOSED_LOST
- ActivityType: CALL | EMAIL | MEETING | NOTE
- AiSuggestionType: TASK_LIST | EMAIL_DRAFT | SUMMARY

Multi-tenant: mọi model đều có `tenantId`. Email là globally unique (không per-tenant).
Soft delete: Contact và Deal có field `deletedAt`.

## Backend Structure

```
be/src/
├── common/
│   ├── decorators/   # @CurrentUser(), @Roles()
│   ├── guards/       # JwtAuthGuard, RolesGuard
│   ├── services/     # PrismaService, HashingService, TokenService
│   ├── filters/      # HttpExceptionFilter
│   └── pipe/         # MyZodValidationPipe
└── routes/
    ├── auth/         # Login, register, refresh token
    ├── contacts/     # CRUD contacts (soft delete)
    ├── activities/   # CALL, EMAIL, MEETING, NOTE
    └── tenant/       # Tenant management (đang xây dựng)
```

### Module Pattern (mỗi feature)

Mỗi route module gồm: `*.controller.ts`, `*.service.ts`, `*.repo.ts`, `*.dto.ts`, `*.module.ts`

### Naming Convention DTOs

Format: `[Entity][Action][Kind]`

- `CreateContactBody` — input từ client (@Body)
- `GetContactRes` — output trả về client (@ZodSerializerDto)
- `GetContactsQuery` — query params (@Query)
- `ContactBase` — schema gốc nội bộ

## Frontend Structure

```
fe/src/app/
├── (auth)/           # Login, Register pages
├── (dashboard)/      # Protected pages
│   └── contacts/     # Contacts list + detail [id]
└── providers/        # React Query setup
```

## Quy tắc quan trọng

1. Luôn filter theo `tenantId` trong mọi query DB
2. Dùng `@CurrentUser()` decorator để lấy user từ JWT
3. Soft delete: set `deletedAt = new Date()`, không xóa thật
4. Validate input bằng Zod schema, không dùng class-validator 
5. Prisma client import từ `generated/prisma-client`, không phải `@prisma/client`
