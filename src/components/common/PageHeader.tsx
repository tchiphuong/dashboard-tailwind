import { ReactNode } from 'react';
import { Breadcrumb } from '@/components/layout';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: { label: string; href?: string }[];
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    className = '',
}: PageHeaderProps) {
    return (
        <div className={`mb-6 ${className}`}>
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
        </div>
    );
}
