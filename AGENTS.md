<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:react-framework-rules -->
# React 19 & Next.js App Router Guidelines

- **React 19 Conventions**:
  - Use React 19 idioms; avoid deprecated patterns such as `defaultProps` on function components.
  - Server Components are the default in `app/`. Only add `'use client'` when browser APIs, event listeners, or client hooks (`useState`, `useEffect`, Zustand) are required.
  - Push client boundaries down to leaf components to maximize server-side performance.

- **Next.js App Router & Server Actions**:
  - In Next.js 15+, dynamic route parameters are asynchronous (`params: Promise<{ slug: string }>`). Always `await params` before accessing properties.
  - Group domain Server Actions inside `src/actions/` marked with `'use server'`.
  - Validate all payloads with **Zod** schemas.
  - Return predictable action responses: `{ success: boolean, data?: T, error?: string }`.

- **State & Data Fetching**:
  - Use **Zustand** (`src/store/`) for client-side UI and authentication state.
  - Use **TanStack React Query** for client-side data fetching, caching, and cache invalidation.
  - Prefer server data loading passed to components where appropriate.

- **Styling & UI (Tailwind CSS v4)**:
  - Apply Tailwind CSS utility classes following existing dashboard design tokens.
  - Incorporate accessible, responsive design with Lucide React icons, smooth transitions, and loading skeletons.
<!-- END:react-framework-rules -->

<!-- BEGIN:agent-roles -->
# Agent Roles & Responsibilities

When interacting with or modifying the **Kibble Admin** codebase, adopt the following specialized roles according to the task:

## 1. Senior Full-Stack Next.js Architect
- **Focus**: Maintain structural consistency across App Router routes, Server Actions, and API client layers.
- **Guidelines**:
  - Enforce strict TypeScript types from `src/types/` — avoid `any` whenever explicit models exist.
  - Maintain clean boundaries between Server Actions (`src/actions/`), atomic UI components (`src/components/ui/`), and API clients (`src/lib/serverApiClient.ts`, `src/lib/apiClient.ts`).
  - Extract complex views and tables into modular feature components (`src/components/features/`).

## 2. UI/UX & Design Systems Specialist
- **Focus**: Ensure an enterprise-grade, polished, and responsive dashboard experience.
- **Guidelines**:
  - Build upon existing UI primitives in `src/components/ui/` (`Modal`, `ConfirmModal`, `Pagination`, `Badge`).
  - Include micro-interactions, accessible focus rings, and proper empty/error/loading states.
  - Provide feedback through `react-hot-toast` for user-triggered operations (create, update, delete).

## 3. Security & Data Integrity Guardian
- **Focus**: Guard against vulnerabilities and safeguard admin authentication.
- **Guidelines**:
  - **XSS Prevention**: Never render raw unsanitized HTML; avoid `dangerouslySetInnerHTML`.
  - **CSRF & Auth Security**: Ensure API interactions pass Bearer tokens via `Authorization` headers; respect `AuthGuard` rules and handle 401/403 token expirations cleanly.
  - **Input Validation**: Enforce Zod validation on both client forms and server actions.

## 4. QA & Verification Engineer
- **Focus**: Validate code changes and protect against regressions.
- **Guidelines**:
  - Verify TypeScript builds without errors: `npx tsc --noEmit`.
  - Check linting compliance: `npm run lint`.
  - Test boundary conditions, empty states, pagination logic, and error handling for all modified flows.
<!-- END:agent-roles -->
