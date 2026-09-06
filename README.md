# Insurance Policy Management Portal — UI

Angular frontend for the Insurance Policy Management Portal. It integrates with the
companion backend REST API (`backend-repo`) and implements role-based access for
`CUSTOMER`, `AGENT`, `CLAIMS_OFFICER`, and `ADMIN` users.

## Prerequisites

- Node.js 20+ (developed against Node 22)
- npm 10+
- Angular CLI 22 (`npx @angular/cli` is used below, no global install required)
- A running instance of the backend API (see `environment.*.ts` for the base URL)

> **Note:** This repository was scaffolded with `npm install --legacy-peer-deps`.
> If you see peer-dependency errors from `npm install`, re-run with the
> `--legacy-peer-deps` flag.

## Install

```bash
npm install --legacy-peer-deps
```

## Run (development server)

```bash
npm start
# or
npx ng serve
```

Navigate to `http://localhost:4200/`. The dev server proxies API calls to the URL
configured in `src/environments/environment.development.ts`.

## Build

```bash
npm run build
```

Production artifacts are emitted to `dist/insurance-portal`.

## Test

```bash
npm test
# or
npx ng test --watch=false
```

Unit tests use the Angular CLI's built-in Vitest-based test runner and cover the
auth guards, role guard, `AuthService`, the auth HTTP interceptor, and the login
component.

## Environment configuration

API base URLs are configured per environment:

- `src/environments/environment.ts` — production (`apiBaseUrl`)
- `src/environments/environment.development.ts` — local development (`apiBaseUrl`,
  defaults to `http://localhost:8080/api`)

Update `apiBaseUrl` to point at your backend deployment.

## Authentication & role-based access

- JWT is obtained from `POST /auth/login` and stored in `localStorage`.
- An HTTP interceptor (`core/interceptors/auth.interceptor.ts`) attaches a
  `Bearer` authorization header built from the stored token to outgoing requests
  (except `/auth/login` and `/auth/register`).
- An error interceptor (`core/interceptors/error.interceptor.ts`) logs the user out
  and redirects to `/auth/login` on `401` responses, and surfaces user-friendly
  toast notifications for other failures.
- `authGuard` protects all authenticated routes; `roleGuard([...roles])` restricts
  specific routes to one or more roles and redirects unauthorized users to
  `/forbidden`.

### Assumed test users (backend-provided)

The UI assumes the backend seeds or supports registering users with the following
roles. Adjust to match your backend's actual seed data:

| Role            | Example username | Notes                                   |
|-----------------|-------------------|------------------------------------------|
| CUSTOMER        | `customer1`       | Can purchase/view policies, file claims, pay premiums |
| AGENT           | `agent1`          | Can view policies, assist customers      |
| CLAIMS_OFFICER  | `claims1`         | Reviews and updates claim status         |
| ADMIN           | `admin`           | Manages products, users, approves cancellations, views admin reports |

## Application structure

```
src/app/
  core/            # models, services, guards, interceptors (singleton, app-wide)
  layout/shell/     # sidebar + topbar app shell
  shared/           # reusable UI components (KPI card, status badge, empty state, spinner)
  features/
    auth/           # login, register
    dashboard/      # KPI cards, activity, charts
    products/       # list, detail, compare, admin CRUD
    policies/       # list, detail, purchase, cancellations (admin)
    claims/         # file claim, history/status tracker, officer queue
    payments/       # premium payment, history, invoice/receipt links
    reports/        # customer + admin reports
    profile/        # profile view
    admin/          # user management (role assignment)
```

## Backend API assumptions

The services in `core/services` assume the following REST contract (adjust to
match the actual backend if endpoint names differ):

- `POST /auth/login`, `POST /auth/register`
- `GET/POST/PUT/DELETE /products`
- `GET /policies/my`, `GET /policies`, `POST /policies`,
  `GET /policies/:id/renewal-quote`, `POST /policies/:id/renew`,
  `POST /policies/:id/cancellation-request`, `GET /policies/cancellation-requests`,
  `POST /policies/:id/cancellation-approve`, `POST /policies/:id/cancellation-reject`
- `GET /claims/my`, `GET /claims/queue`, `POST /claims`,
  `PATCH /claims/:id/status`
- `GET /payments/history`, `POST /payments`,
  `GET /payments/:id/invoice`, `GET /payments/:id/receipt`
- `GET /dashboard/summary`
- `GET /reports/customer/summary`, `GET /reports/admin/premium-collection`,
  `GET /reports/admin/claims-ratio`, `GET /reports/admin/product-performance`,
  `GET /reports/admin/monthly-revenue`, `GET /reports/admin/top-customers`
- `GET /admin/users`, `PUT /admin/users/:id/roles`, `PATCH /admin/users/:id/status`

Claim document upload is implemented as **metadata only** (file name/type/size)
since the functional requirements note the backend may only support document
metadata rather than binary storage.

## Original Angular CLI reference

This project was generated using [Angular CLI](https://github.com/angular/angular-cli)
version 22.1.7. For more information on using the Angular CLI, including detailed
command references, visit the
[Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
