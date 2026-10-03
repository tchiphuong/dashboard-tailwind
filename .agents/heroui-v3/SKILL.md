---
name: HeroUI v3 Frontend Developer
description: Standard guidelines for frontend UI development using HeroUI v3 (React 19 & Tailwind CSS v4)
---

# HeroUI v3 Guidelines

This is a mandatory guidance document (Mandatory Rules) for AI Agents when writing User Interface (UI) code for frontend projects (Next.js & Vite) using the **HeroUI v3** library (formerly NextUI).

## 1. Core Technologies

- **UI Library**: HeroUI v3 (`@heroui/react` version 3.x and above).
- **Styling**: Tailwind CSS v4.
- **Base Components**: Built on top of **React Aria Components**, ensuring optimal Keyboard Navigation, Focus Management, and Accessibility.
- **Framework**: Supports both Next.js 15 (App Router, React 19) and Vite (React-Router, React 18+).

## 2. Component Usage Rules

### 2.1. Default Configurations (Wrappers)

To ensure system-wide consistency and avoid excessively rounded interfaces, **always prioritize using the pre-configured Component Wrappers** available in the project instead of importing directly from `@heroui/react` if they exist:

- **Input / Button / Table / Select / Modal / ...**:
  - Import path: `@/components/common`
  - Example: `import { Input, Button, Table } from "@/components/common";`
  - Strictly DO NOT import directly from `@heroui/react` or `@nextui-org/react` for components that already exist in the common folder.

### 2.2. Direct Imports (Strict Rule)

Absolutely DO NOT import any component directly from `@heroui/react` into pages or business logic components.

- If a HeroUI component (such as Dropdown, Avatar, Badge, etc.) is not yet available in `@/components/common`, **you MUST create a Wrapper for it in the `components/common` directory first**, and then export it via `index.ts`.
- Purpose: Centralize all UI Framework dependencies in a single location (`common`), making it easier to modify default configurations (e.g., radius, animations) for the entire project in the future.

```tsx
// ✅ CORRECT: Always import from common
import { Dropdown, Avatar } from "@/components/common";

// ❌ INCORRECT: Direct import from the UI library into app logic
import { Dropdown } from "@heroui/react";
```

## 3. HeroUI v3 Updates (Breaking Changes)

HeroUI v3 introduces major changes that must be strictly followed:

1. **Button Component API**:
   - The `color` prop has been removed. To use colored buttons, use the `variant` prop (e.g., `variant="danger"` or `variant="primary"`).
   - The `startContent` and `endContent` props have been removed. Place icons directly inside the `children`.

2. **Table Empty State**:
   - Due to React Aria requirements, the number of `Cell` elements must perfectly match the number of `Column` elements.
   - Absolutely DO NOT write custom `if (empty) render 1 row` logic.
   - You MUST use the `renderEmptyState` prop of the Table component to handle the display when there is no data.

3. **Compound Components**:
   - Many components (Pagination, Dropdown, Modal...) have migrated to the Compound Components pattern. Always refer to the v3 documentation to write the correct structure (e.g., `<Pagination.Content><Pagination.Item>...`).

## 4. Design Principles

1. **Radius & Sharpness**:
   - The HeroUI Core CSS in `hero.js` has been finely tuned (`radius.medium = "0.375rem"`).
   - Avoid overriding the radius using tailwind classes (like `rounded-2xl` or `rounded-full`) except for Avatars or specific Badges.

2. **Scrollbar & Overflow**:
   - Instead of using raw `overflow-y-auto`, **always prioritize using `<ScrollShadow>`** for long content areas to create a smooth fade effect at the edges.

3. **Icons**:
   - **Standard areas**: Use the `@heroicons/react/24/outline` library.
   - **Featured areas**: Use the `<img src="/icons/[icon-name].png" />` tag with local icons.

4. **Variables and Configurations (App Config)**:
   - Default numbers (Page size, Date format, Base URL) MUST NEVER be hard-coded into components.
   - Always call from the configuration file: `import { appConfig } from "@/config/app.config";`.

## 5. Next.js vs Vite Specifics

- **Next.js (uni-manage)**: Use `useRouter` from `next/navigation` or `@/i18n/navigation`. Often combined with the Next `<Link>` tag.
- **Vite (dashboard_tailwind_repo)**: Use `useNavigate` from `react-router-dom` and the React-Router `<Link>` tag.

## 6. HeroUI v3 & Pro Critical Rules (Agent Skills)

Based on the official standards from HeroUI Pro:

1. **Event Handlers (React Aria)**:
   - Use **`onPress`** instead of `onClick` for click/touch interactions. This is a mandatory standard of React Aria.

2. **Styling & CSS System**:
   - Leverage the BEM classes system (`base`, `wrapper`, `content`...) through the `classNames={{ ... }}` prop.
   - Avoid using raw custom CSS or overly complex nested ternary operators in `className`.

3. **Design Taste**:
   - **Generous whitespace**: Always leave ample breathing room (padding/margin).
   - **Subtle depth**: Use soft, light shadows.
   - **Minimalism**: Avoid overusing striking colors.

> Summary: Always use **HeroUI v3**, prioritize using **Wrappers in `@/components/common`**, follow the correct v3 API (do not use color/startContent for Buttons), use `onPress` instead of `onClick`, and adhere to a minimalist design style.

## 7. Production-Grade Automation & E2E Testing

1. **Tools**: Use **Playwright** for the entire E2E Testing process.
2. **Page Object Model (POM)**: Isolate UI interaction logic into POM classes located in the `e2e-tests/pages/` directory.
3. **Environments & Variables**: Never hardcode sensitive information. Always read from environment variables (`process.env`).
4. **Isolation**: Leverage Playwright's automatic isolated context mechanism.

## 8. Standard Page Layout & Zero-Drift UI (Mandatory 5-Layer Layout)

Every listing screen and table view across the system MUST strictly follow this 5-layer layout structure for 100% visual consistency:

1. **Layer 1: Compact Top Bar & Quick Actions**
   - **Left**: `Breadcrumb` locating current module and page.
   - **Right**: Primary action buttons (`Button size="sm"`): "Làm mới dữ liệu" (`variant="secondary"`) and "Tạo mới / Thêm mới" (`variant="primary"`).
   - **Strict Rule**: No heavy headers with giant `h1` titles and long descriptive text paragraphs that waste vertical space.

2. **Layer 2: Quick Stats KPI Cards**
   - Standard responsive grid: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4`.
   - **Mandatory shared component `StatCard` from `@/components/common`**:
     - General / Total records: `variant="default"` (`border-b-default-400`)
     - In progress / Active: `variant="accent"` (`border-b-accent`)
     - Completed / Success: `variant="success"` (`border-b-success`)
     - Finance / Revenue / Budget: `variant="primary"` (`border-b-primary`)
   - Mandatory `tabular-nums` for all numeric values and stats, with `isLoading` support.

3. **Layer 3: Filter & Search Bar**
   - Wrapped inside `Card className="p-4"`.
   - **Left**: `Input` for keyword search (name, code, assignee...).
   - **Right**: `Select` elements for status/category filters, along with a pagination toggle button (*Phân trang: Bật / Tắt*).

4. **Layer 4: Data Table & Scroll Container (HeroUI v3 Standards)**
   - Wrapped inside `Card className="overflow-hidden p-0"`.
   - Always use native HeroUI v3 Compound `Table` from `@/components/common/table` (strictly forbidden to create custom HTML tables or add ad-hoc table logic).
   - **Controlled height & Scroll**: `Table.ScrollContainer` MUST have `max-h-112 overflow-y-auto` to prevent excessive table height that ruins the page view.
   - **Column Sorting**: Use `allowsSorting` on `Table.Column`, wrap column label in `<Table.SortableColumnHeader sortDirection={sortDirection}>`. **The sorting indicator icon (chevron) is 100% built-in by HeroUI. Strictly forbidden to add custom sorting icons.**
   - **Empty State**: MUST use shared `Table.EmptyState` or `EmptyState` component via `renderEmptyState={() => <Table.EmptyState ... />}` on `<Table.Body>`. Strictly DO NOT render fake `Table.Row` with `colSpan` (violates React Aria standards).
   - **Cell alignment**:
     - Numbers / Currency / Percentages / Progress: Right-aligned (`text-right`).
     - Dates / Times / Deadlines / Status: Center-aligned (`text-center`).
     - Text / Names / Descriptions / Identifiers: Left-aligned (`text-left`).
   - Header casing: Table header columns must use sentence/title case, NEVER all-uppercase.

5. **Layer 5: Standard Pagination (Native Table.Footer)**
   - **Mandatory shared component `Table.PaginationFooter` from `@/components/common`** placed inside `Table`:
     - Encapsulates all 3 fixed zones: Page size selector on the left, `Pagination.Summary` in the center, and compound `Pagination.Content` with ellipsis on the right.
   - **On/Off Mechanism**: Default is ALWAYS **ON**. When toggled off, table renders all records and hides `Table.PaginationFooter`.



