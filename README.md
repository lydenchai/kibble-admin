# ⚙️ Kibble Admin Dashboard

Enterprise management dashboard for **Kibble Pet Store** built with Next.js 15 App Router, React 19, Tailwind CSS, and Zustand.

---

## 🌟 Key Features

- **📊 Dashboard & Analytics**:
  - Live revenue, order count, customer statistics, and sales performance charts.

- **📦 Product & Inventory Management**:
  - Full CRUD operations for pet products and variants (size, weight, flavor, SKU, pricing, stock).
  - Image upload management and discount percentage calculations.

- **📂 Category & Brand Management**:
  - Category creation, subcategory tagging, and featured brand assignments.

- **🛒 Order Fulfillment & Tracking**:
  - Real-time order status updates (Pending, Processing, Shipped, Delivered, Cancelled).
  - Detailed invoice viewing and customer shipping address verification.

- **🏷️ Marketing & Promotional Coupons**:
  - Coupon code creation, usage limits, expiration tracking, and discount percentages.

- **🔒 Auth & Security**:
  - Role-based access control (`AuthGuard`), JWT session management, and secure admin API requests.

---

## 🏗️ Architecture & Directory Structure

```
src/
├── actions/             # Next.js Server Actions ("use server") grouped by domain
├── app/                 # Next.js App Router (Dashboard routes & Auth routes)
│   ├── (auth)/          # Admin login routes
│   └── (dashboard)/     # Admin dashboard pages (products, orders, categories, settings)
├── components/          # React Components
│   ├── ui/              # Atomic UI primitives (Modal, ConfirmModal, Pagination, Badge)
│   ├── layout/          # Layout & Navigation (Header, Sidebar, AdminLayout)
│   ├── auth/            # Authentication guards (AuthGuard)
│   └── features/        # Feature modules (products, categories, orders, marketing)
├── lib/                 # Core infrastructure
│   └── api/             # API client instances (serverApiClient.ts, apiClient.ts)
├── store/               # State management (Zustand auth & admin stores)
├── types/               # TypeScript interfaces & domain type definitions
└── utils/               # Pure helper utilities (date formatters, currency, auth)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository and navigate to `kibble-admin`**:
   ```bash
   cd kibble-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) to view the admin dashboard in your browser.

5. **Type Checking & Verification**:
   ```bash
   npx tsc --noEmit
   ```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
