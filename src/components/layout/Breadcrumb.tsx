import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const { t } = useTranslation();

    return (
        <nav aria-label="Breadcrumb" className="py-3 transition-colors duration-300">
            <ol className="inline-flex list-none items-center gap-1 p-0">
                <li className="flex items-center">
                    <Link
                        to="/"
                        className="flex items-center text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <HomeIcon className="mr-1.5 h-4 w-4" />
                        <span className="text-sm">{t('common.home')}</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRightIcon className="mx-2 h-4 w-4 text-gray-400" />
                        {item.href ? (
                            <Link
                                to={item.href}
                                className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className="text-sm font-medium text-gray-800 dark:text-gray-200"
                                aria-current="page"
                            >
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
