'use client';

import { useEffect, useRef } from 'react';
import type { StatCard as StatCardType } from '@/types';
import {
    ArrowRightIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    ClockIcon,
    CubeIcon,
    CurrencyDollarIcon,
    EyeIcon,
    ShoppingCartIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/common';

interface StatsCardProps {
    stat: StatCardType;
}

// Icon mapping
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    'fa-users': UsersIcon,
    'fa-dollar-sign': CurrencyDollarIcon,
    'fa-shopping-cart': ShoppingCartIcon,
    'fa-box': CubeIcon,
    'fa-eye': EyeIcon,
    'fa-clock': ClockIcon,
    'fa-check-circle': CheckCircleIcon,
    'fa-arrow-right': ArrowRightIcon,
};

// Color mapping for dynamic classes
const colorClasses: Record<
    string,
    { bg: string; text: string; icon: string; border: string; glow: string; bottomBorder: string }
> = {
    blue: {
        bg: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'hover:border-blue-300 dark:hover:border-blue-700/60',
        glow: 'bg-blue-500/5 dark:bg-blue-500/10',
        bottomBorder: 'border-blue-500 dark:border-blue-500',
    },
    green: {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        text: 'text-emerald-600 dark:text-emerald-400',
        icon: 'text-emerald-600 dark:text-emerald-400',
        border: 'hover:border-emerald-300 dark:hover:border-emerald-700/60',
        glow: 'bg-emerald-500/5 dark:bg-emerald-500/10',
        bottomBorder: 'border-emerald-500 dark:border-emerald-500',
    },
    purple: {
        bg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
        text: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'hover:border-purple-300 dark:hover:border-purple-700/60',
        glow: 'bg-purple-500/5 dark:bg-purple-500/10',
        bottomBorder: 'border-purple-500 dark:border-purple-500',
    },
    yellow: {
        bg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
        text: 'text-amber-600 dark:text-amber-400',
        icon: 'text-amber-600 dark:text-amber-400',
        border: 'hover:border-amber-300 dark:hover:border-amber-700/60',
        glow: 'bg-amber-500/5 dark:bg-amber-500/10',
        bottomBorder: 'border-amber-500 dark:border-amber-500',
    },
};

export function StatsCard({ stat }: Readonly<StatsCardProps>) {
    const t = useTranslations();
    const counterRef = useRef<HTMLSpanElement>(null);
    const colors = colorClasses[stat.color] || colorClasses.blue;
    const IconComponent = iconComponents[stat.icon];

    useEffect(() => {
        if (!counterRef.current) return;

        const target = stat.value;
        const duration = 1200;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (counterRef.current) {
                if (target >= 1000) {
                    counterRef.current.textContent = Math.floor(current).toLocaleString('vi-VN');
                } else if (target < 10) {
                    counterRef.current.textContent = current.toFixed(1);
                } else {
                    counterRef.current.textContent = Math.floor(current).toString();
                }
            }
        }, 16);

        return () => clearInterval(timer);
    }, [stat.value]);

    return (
        <Card
            className={`group relative overflow-hidden border border-b-4 ${colors.bottomBorder} bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:bg-zinc-900/90 ${colors.border}`}
        >
            {/* Ambient background glow */}
            <div
                className={`pointer-events-none absolute -top-6 -right-6 size-24 rounded-full blur-2xl transition-opacity group-hover:opacity-100 ${colors.glow}`}
            />

            <div className="relative mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {stat.title}
                </span>
                <div
                    className={`flex size-9 items-center justify-center rounded-xl shadow-xs ${colors.bg}`}
                >
                    {IconComponent && <IconComponent className="size-4.5" />}
                </div>
            </div>

            <div className="relative mb-2">
                <div className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums md:text-3xl dark:text-zinc-50">
                    {stat.prefix && <span className="mr-0.5">{stat.prefix}</span>}
                    <span ref={counterRef} className="tabular-nums">
                        0
                    </span>
                    {stat.suffix && <span className="ml-0.5">{stat.suffix}</span>}
                </div>
            </div>

            <div className="relative flex items-center gap-1.5 text-xs">
                <span
                    className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-bold tabular-nums ${
                        stat.changeType === 'up'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                >
                    {stat.changeType === 'up' ? (
                        <ArrowTrendingUpIcon className="size-3" />
                    ) : (
                        <ArrowTrendingDownIcon className="size-3" />
                    )}
                    {stat.change}%
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {t('dashboard.fromLastMonth', { change: stat.change })}
                </span>
            </div>
        </Card>
    );
}
