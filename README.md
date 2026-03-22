# QR-Code Integrated Inventory Management System

A production-ready inventory management system for the General Supplies Office, built with Next.js, TypeScript, and PostgreSQL. Features QR code generation and scanning for quick item lookups and transaction processing.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: Auth.js v5 (next-auth) with credentials provider
- **Validation**: Zod
- **Forms**: React Hook Form
- **QR Codes**: qrcode (generation) + html5-qrcode (scanning)

## Features

- **Authentication & RBAC**: Login with hashed passwords, 3 roles (Admin, Staff, Auditor)
- **Dashboard**: Summary cards for total items, low stock alerts, recent transactions
- **Inventory Management**: Full CRUD for items with categories
- **QR Code System**: Auto-generated QR codes per item, downloadable as PNG
- **QR Scanner**: Camera-based scanning with fallback manual entry
- **Transactions**: Record IN/OUT/RETURN movements; stock computed from transaction history
- **Reports**: Filterable transaction reports with date range, item, and type filters
- **Audit Logs**: Track all user actions with timestamps
- **User Management**: Admin-only user CRUD with role assignment
- **REST API**: Full API layer ready for mobile app integration

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qr_inventory?schema=public"
AUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
```

### 3. Setup database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Login Credentials

| Role    | Username | Password    |
|---------|----------|-------------|
| Admin   | admin    | password123 |
| Staff   | staff    | password123 |
| Auditor | auditor  | password123 |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/login/       # Login page
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── inventory/      # Inventory CRUD
│   │   ├── categories/     # Category management
│   │   ├── scan/           # QR scanner page
│   │   ├── transactions/   # Transaction records
│   │   ├── reports/        # Filtered reports
│   │   ├── audit-logs/     # Audit trail
│   │   └── users/          # User management (Admin)
│   └── api/                # REST API routes
│       ├── auth/           # NextAuth handlers
│       ├── items/          # Items CRUD API
│       ├── categories/     # Categories API
│       ├── transactions/   # Transactions API
│       └── scan/           # QR scan lookup API
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Sidebar, PageHeader, Pagination
│   ├── dashboard/          # Summary cards, alerts
│   ├── inventory/          # Item forms, tables, QR display
│   ├── scan/               # QR scanner, scan results
│   ├── transactions/       # Transaction forms, tables
│   └── reports/            # Report filters, audit logs
├── lib/                    # Shared utilities
│   ├── auth.ts             # NextAuth configuration
│   ├── db.ts               # Prisma client singleton
│   ├── audit.ts            # Audit logging helper
│   ├── validations.ts      # Zod schemas
│   ├── constants.ts        # App constants
│   └── utils.ts            # cn() utility
├── server/                 # Server actions (business logic)
│   ├── items.ts            # Item CRUD + stock calculation
│   ├── categories.ts       # Category CRUD
│   ├── transactions.ts     # Transaction processing
│   ├── dashboard.ts        # Dashboard statistics
│   ├── users.ts            # User management
│   └── audit-logs.ts       # Audit log queries
├── types/
│   └── next-auth.d.ts      # Auth type extensions
└── middleware.ts            # Route protection
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed script
```

## API Endpoints

| Method | Endpoint              | Description           | Auth Required |
|--------|----------------------|-----------------------|--------------|
| GET    | /api/items           | List items            | Yes          |
| POST   | /api/items           | Create item           | Admin/Staff  |
| GET    | /api/items/:id       | Get item details      | Yes          |
| PATCH  | /api/items/:id       | Update item           | Admin/Staff  |
| DELETE | /api/items/:id       | Delete item           | Admin        |
| GET    | /api/categories      | List categories       | Yes          |
| POST   | /api/categories      | Create category       | Admin/Staff  |
| GET    | /api/transactions    | List transactions     | Yes          |
| POST   | /api/transactions    | Create transaction    | Admin/Staff  |
| GET    | /api/scan?value=...  | Lookup item by QR     | Yes          |

## Database Scripts

```bash
npm run db:generate   # Generate Prisma Client
npm run db:migrate    # Run migrations
npm run db:push       # Push schema without migration
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio
npm run db:reset      # Reset database
```

## Security

- Passwords hashed with bcrypt (12 rounds)
- All inputs validated with Zod
- JWT-based sessions
- Role-based access control on routes and API
- Protected middleware for all dashboard routes
- Audit logging for all mutations

## License

MIT
