---
name: dashboard-components
description: Skill for creating pages and components in the Dashboard Tailwind project using HeroUI, common components, and proper coding conventions.
---

# Dashboard Component Development Skill

This skill provides guidance for developing pages and components in the Dashboard Tailwind project.

## Tech Stack

- **UI Library**: `@heroui/react` (HeroUI)
- **CSS**: Tailwind CSS 4.0
- **Icons**: `@heroicons/react/24/outline`
- **i18n**: `react-i18next`
- **Routing**: `react-router-dom`

## 🔥 CRITICAL: Always Use Common Components

**NEVER** use raw HeroUI components or native HTML elements directly. Always import from `@/components/common`:

```tsx
import {
    PageHeader,
    Card,
    Button,
    Input,
    Select,
    Modal,
    ConfirmModal,
    AlertModal,
    Table,
    useTableData,
} from '@/components/common';
```

### Component Defaults

| Component  | Default Props                                                     |
| ---------- | ----------------------------------------------------------------- |
| **Button** | `radius="full"`, `font-medium`                                    |
| **Input**  | `radius="full"`, `variant="flat"`, `labelPlacement="outside-top"` |
| **Select** | `radius="full"`, `variant="bordered"`                             |

## Page Structure Template

```tsx
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Card, Button } from '@/components/common';

export function ExamplePage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('page.title')}
                breadcrumbs={[{ label: t('nav.home'), href: '/' }, { label: t('page.name') }]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('common.add')}
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

## ❌ Do NOT

- Wrap page content in `<div className="p-6">` - layout handles spacing
- Use `@heroui/react` Button/Input/Select directly - use `@/components/common`
- Hardcode text - always use `t('key')` for translations
- Use inline styles - use Tailwind classes

## ✅ Do

- Start every page with `<PageHeader />`
- Use React Fragment `<>...</>` as root element
- Import icons from `@heroicons/react/24/outline`
- Use `useTranslation()` for all text
- Use `useNavigate()` from `react-router-dom` for navigation
- Group imports: React → 3rd party → local components

## Dark Mode

All components support dark mode automatically via Tailwind's `dark:` prefix. The theme is managed by `ThemeContext`.

## Form Example

```tsx
import { Input, Button, Select } from '@/components/common';
import { Form, Checkbox } from '@heroui/react'; // Only Form/Checkbox from HeroUI

<Form onSubmit={handleSubmit}>
    <Input isRequired label={t('form.name')} name="name" placeholder="Enter name" />
    <Select label={t('form.status')} name="status">
        <SelectItem key="active">Active</SelectItem>
        <SelectItem key="inactive">Inactive</SelectItem>
    </Select>
    <Button type="submit" color="primary">
        {t('common.save')}
    </Button>
</Form>;
```

## Modal Example

```tsx
import { Modal, ConfirmModal } from '@/components/common';

// For custom content
<Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Modal Title"
>
    {/* Content */}
</Modal>

// For confirmations
<ConfirmModal
    isOpen={isConfirmOpen}
    onClose={() => setIsConfirmOpen(false)}
    onConfirm={handleDelete}
    title="Confirm Delete"
    message="Are you sure you want to delete this item?"
/>
```

## Skeleton (Loading State)

Use `Skeleton` from `@heroui/react` to show loading placeholders:

```tsx
import { Skeleton } from '@heroui/react';

// Wrapping content - takes shape of children
<Skeleton isLoaded={!isLoading}>
    <div className="h-24 rounded-lg bg-secondary"></div>
</Skeleton>

// Standalone usage
<div className="space-y-3">
    <Skeleton className="w-3/5 rounded-lg">
        <div className="h-3 rounded-lg bg-default-200"></div>
    </Skeleton>
    <Skeleton className="w-4/5 rounded-lg">
        <div className="h-3 rounded-lg bg-default-200"></div>
    </Skeleton>
    <Skeleton className="w-2/5 rounded-lg">
        <div className="h-3 rounded-lg bg-default-300"></div>
    </Skeleton>
</div>

// Card loading example
<Card>
    <Skeleton isLoaded={!isLoading} className="rounded-lg">
        <div className="h-48 bg-default-300"></div>
    </Skeleton>
    <div className="space-y-3 p-4">
        <Skeleton isLoaded={!isLoading} className="w-3/5 rounded-lg">
            <div className="h-4 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
            <div className="h-3 rounded-lg bg-default-200"></div>
        </Skeleton>
    </div>
</Card>
```

### Skeleton Props

| Prop               | Type      | Default | Description                |
| ------------------ | --------- | ------- | -------------------------- |
| `children`         | ReactNode | -       | Content to wrap            |
| `isLoaded`         | boolean   | false   | When true, shows children  |
| `disableAnimation` | boolean   | false   | Disables shimmer animation |
| `classNames`       | object    | -       | Slots: `base`, `content`   |
