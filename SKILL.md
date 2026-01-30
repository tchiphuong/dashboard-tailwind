# Dashboard Development Skills & Rules

This document outlines the coding standards, component usage, and best practices for the Dashboard Tailwind project.

## 1. UI Library & Styling

- **Primary Library**: `@heroui/react` (HeroUI)
- **CSS Framework**: Tailwind CSS 4.0
- **Icons**: `@heroicons/react/24/outline`

## 2. Common Components

Always use the following common components from `@/components/common` instead of native HTML elements or raw HeroUI components where applicable to ensure consistency.

### Imports

```typescript
import {
    PageHeader,
    Card,
    Button,
    Input,
    Select,
    Modal,
    ConfirmModal,
} from '@/components/common';
```

### Components List

| Component        | Usage                   | Notes                                                                 |
| ---------------- | ----------------------- | --------------------------------------------------------------------- |
| **PageHeader**   | Top of every page       | Includes title, description, breadcrumbs, and action buttons.         |
| **Button** | All button interactions | Waps HeroUI `Button`. Default `radius="full"`, `font-medium`.         |
| **Input**  | Form inputs, Search     | Wraps HeroUI `Input`. Default `radius="full"`, `variant="bordered"`.  |
| **Select** | Dropdowns               | Wraps HeroUI `Select`. Default `radius="full"`, `variant="bordered"`. |
| **Card**         | Content containers      | Standardized white box with shadow and border.                        |
| **Modal**  | Generic modals          | Base for all custom modals.                                           |
| **ConfirmModal** | Delete/Confirm actions  | Use for standard confirmation dialogs.                                |
| **AlertModal**   | Information/Alerts      | Use for simple alerts.                                                |

## 3. Page Structure

- **Root Element**: Use a React Fragment `<>...</>` or strict functional component structure.
- **No Padding Wrappers**: Do **NOT** wrap the page content in a `<div className="p-6">`. The layout handles necessary spacing.
- **Header**: Always start with `<PageHeader />`.

**Example:**

```tsx
export function ExamplePage() {
    return (
        <>
            <PageHeader
                title="Page Title"
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Page' }]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        Add New
                    </Button>
                }
            />

            <div className="grid gap-6">
                <Card>{/* Content */}</Card>
            </div>
        </>
    );
}
```

## 4. Coding Conventions

- **Imports**: Organize imports logically. Group React, 3rd party, and local imports.
- **Types**: Use strict TypeScript interfaces.
- **Translations**: Use `useTranslation` hook for all text. `t('key')`.

## 5. State Management

- Use local `useState` for page-level state.
- Use Context for global state (Theme, Sidebar).
