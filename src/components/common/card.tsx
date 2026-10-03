import React, { ReactNode } from 'react';
import { Card as HeroCard } from '@heroui/react';

export interface CardProps extends Omit<
    React.ComponentPropsWithoutRef<typeof HeroCard>,
    'children'
> {
    children?: ReactNode;
    padding?: string;
    onClick?: () => void;
}

export interface CardHeaderProps extends React.ComponentPropsWithoutRef<typeof HeroCard.Header> {
    title?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    iconColor?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'danger'
        | 'accent'
        | 'teal'
        | 'indigo';
    action?: ReactNode;
    badge?: ReactNode;
}

const colorClassMap: Record<string, string> = {
    primary: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
    secondary: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400',
    accent: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400',
    success: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400',
    danger: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400',
    teal: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20 dark:text-teal-400',
    indigo: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400',
};

function SmartCardHeader({
    title,
    description,
    icon,
    iconColor = 'primary',
    action,
    badge,
    children,
    className = '',
    ...props
}: Readonly<CardHeaderProps>) {
    if (title || icon || action || badge || description) {
        return (
            <HeroCard.Header
                className={`mb-4 flex w-full flex-row items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800 ${className}`}
                {...props}
            >
                <div className="flex items-center gap-2">
                    {icon && (
                        <div
                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${colorClassMap[iconColor] || colorClassMap.primary}`}
                        >
                            {icon}
                        </div>
                    )}
                    <div className="flex flex-col text-left">
                        {typeof title === 'string' ? (
                            <HeroCard.Title className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                {title}
                            </HeroCard.Title>
                        ) : (
                            title
                        )}
                        {description && (
                            <HeroCard.Description className="text-xs text-zinc-400">
                                {description}
                            </HeroCard.Description>
                        )}
                    </div>
                </div>

                {(action || badge) && (
                    <div className="flex shrink-0 items-center gap-2">
                        {badge}
                        {action}
                    </div>
                )}
            </HeroCard.Header>
        );
    }

    return (
        <HeroCard.Header className={`w-full ${className}`} {...props}>
            {children}
        </HeroCard.Header>
    );
}

/**
 * Card Component - Dùng trực tiếp Card của HeroUI v3 mặc định, không thêm custom classes
 */
export function Card({ children, className, onClick, ...props }: Readonly<CardProps>) {
    return (
        <HeroCard className={className} onClick={onClick} {...props}>
            {children}
        </HeroCard>
    );
}

Card.Header = SmartCardHeader;
Card.Title = HeroCard.Title;
Card.Description = HeroCard.Description;
Card.Content = HeroCard.Content;
Card.Footer = HeroCard.Footer;

export const CardHeader = SmartCardHeader;
export const CardBody = HeroCard.Content;
export const CardContent = HeroCard.Content;
export const CardFooter = HeroCard.Footer;
export const CardTitle = HeroCard.Title;
export const CardDescription = HeroCard.Description;
