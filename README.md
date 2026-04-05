# Finance Dashboard Backend

A robust Node.js backend for a Finance Dashboard system. This project was designed to showcase proper structure, validation, security, and role-based access control. 

## Features

- **Role-Based Access Control (RBAC):** Three predefined roles (`VIEWER`, `ANALYST`, `ADMIN`) that govern permissions correctly.
- **REST APIs:** Full set of endpoints using standardized routing in Express.
- **Data Integrity:** Strict input parsing via **Zod** and schema separation.
- **SQL Data Persistence:** Handled globally through **SQLite3** wrapped via safe parameterized promises.
- **Dashboard Sums:** Aggregations computed within SQL to lower Node.js loop stress.
- **Strong Typings:** End-to-end type safety provided by TypeScript.

## Start the server
Prerequisites: Node v16+
Because Prisma had compatibility issues in the local environment, the architecture pivoted quickly to native `sqlite3`.
```bash
npm install
npm run build
npm start
```
*Note: A seed script is available to auto-populate some test data:*
```bash
npm run seed
```

## Setup & Scripts
1. `npm run dev` starts the ts-node-dev watcher (requires npx).
2. `npm run build` compiles TS to `/dist`.
3. `npm start` runs the compiled output.
4. Database builds dynamically when the server runs.

## Architecture

1. **Routing Layer**: Encapsulates specific paths (`auth`, `finance`, `dashboard`).
2. **Middleware**: Contains the JWT processing (`auth.ts`), Payload Validations (`validate.ts`), and Global Error Handling (`errorHandler.ts`).
3. **Database Layer**: `sqlite3` driver customized to run on modern Promisified methods for high reliability.

## Endpoints

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register` (Passes back `userId`)

### Financial Records
*Requires Role: `ADMIN` for edits, `ANALYST/ADMIN` for views*
- `GET /api/finance/` (Query parameters: type, category, startDate)
- `POST /api/finance/` 
- `PUT /api/finance/:id`
- `DELETE /api/finance/:id`

### Dashboard Summaries
*Requires Role: `ANALYST/ADMIN`*
- `GET /api/dashboard/summary` (Returns totalIncome, totalExpenses, netBalance)
- `GET /api/dashboard/category-totals` (Returns aggregations per category per type)
- `GET /api/dashboard/recent` (Returns recent items bounded by limit)

## Tradeoffs

- **Native SQL over ORM:** Started with Prisma but pivoted due to a local binary mismatch. Used `sqlite3` natively which provides higher performance, but slightly less type safety on generic query strings compared to Prisma type maps.
- **JWT tokens:** Stored loosely and not tracked in a revocation list for simplicity.
- **In-Memory Config:** Small hardcoded secrets for rapid bootstrapping, which should be ENV variables in production.
