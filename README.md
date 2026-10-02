# Kibble Admin Dashboard

Enterprise management dashboard for **Kibble Pet Store** built with Next.js 16 App Router, React 19, Tailwind CSS v4, and Zustand.

---

## Key Features

- **Dashboard & Analytics**:
  - Live revenue, order count, customer statistics, and interactive sales performance charts with Recharts.

- **Product & Inventory Management**:
  - Full CRUD operations for pet products and variants (size, weight, flavor, SKU, pricing, stock).
  - Image upload management and discount percentage calculations.

- **Category & Brand Management**:
  - Category creation, subcategory tagging, and featured brand assignments.

- **Order Fulfillment & Tracking**:
  - Real-time order status updates (Pending, Processing, Shipped, Delivered, Cancelled).
  - Detailed invoice viewing and customer shipping address verification.

- **Staff & Customer Management**:
  - Administrative user creation, role assignments, customer profile auditing, and loyalty points tracking.

- **Marketing & Promotional Coupons**:
  - Coupon code creation, usage limits, expiration tracking, and discount percentages.

- **Auth & Security**:
  - Role-based access control (`AuthGuard`), JWT session management, and secure admin API requests.

---

## Architecture & Directory Structure

```
src/
├── actions/             # Next.js Server Actions ("use server") grouped by domain (auth, upload)
├── app/                 # Next.js App Router (Dashboard routes & Auth routes)
│   ├── (auth)/          # Admin login routes
│   └── (dashboard)/     # Admin dashboard pages (products, orders, categories, staff, settings)
├── components/          # React Component Library
│   ├── ui/              # Atomic UI primitives (Modal, ConfirmModal, Pagination, Badge)
│   ├── layout/          # Layout & Navigation (Header, Sidebar, AdminLayout)
│   ├── auth/            # Authentication guards (AuthGuard)
│   └── features/        # Feature modules (products, categories, orders, marketing, staff)
├── lib/                 # Core infrastructure
│   ├── apiClient.ts     # Client-side API fetch client
│   ├── serverApiClient.ts # Server-side API client for Server Actions & SSR
│   ├── uploadClient.ts  # Multipart file upload client with automatic token refresh
│   └── clientAuth.ts    # Client token refresh utilities
├── store/               # State management (Zustand admin and session stores)
├── types/               # TypeScript interfaces & domain type definitions
└── utils/               # Pure helper utilities (date formatters, currency, auth)
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** / **yarn** / **pnpm**
- Running instance of **kibble-api** backend on port 5000 (or configured URL)

### Installation

1. Navigate to the admin directory:
   ```bash
   cd kibble-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) to view the admin dashboard.

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Runs the Next.js development server on port 3001 using Webpack. |
| `build` | `npm run build` | Compiles and optimizes the production build. |
| `start` | `npm run start` | Starts the production server. |
| `lint` | `npm run lint` | Runs ESLint to check for code quality and syntax issues. |
| Type Check | `npx tsc --noEmit` | Validates TypeScript types across the entire project without emitting output. |

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Asynchronous Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## Coding Standards & Agent Guidelines

See [AGENTS.md](file:///Users/fedora/Desktop/My%20Workspace/kibble/kibble-admin/AGENTS.md) for detailed architecture rules, React 19 / Server Component guidelines, and specialized agent responsibilities.
