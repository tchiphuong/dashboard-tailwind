'use client';

import {
    ArrowUpTrayIcon,
    BellIcon,
    BoltIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    CubeIcon,
    PlusIcon,
    UserPlusIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/common';

const actions = [
    { icon: PlusIcon, labelKey: 'dashboard.newOrder', color: 'blue' },
    { icon: UserPlusIcon, labelKey: 'dashboard.addUser', color: 'green' },
    { icon: CubeIcon, labelKey: 'dashboard.newProduct', color: 'purple' },
    { icon: ChartBarIcon, labelKey: 'dashboard.reports', color: 'orange' },
    { icon: UsersIcon, labelKey: 'dashboard.manageUsers', color: 'indigo' },
    { icon: Cog6ToothIcon, labelKey: 'common.settings', color: 'gray' },
    { icon: BellIcon, labelKey: 'common.notifications', color: 'red' },
    { icon: ArrowUpTrayIcon, labelKey: 'dashboard.uploadFile', color: 'teal' },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
    blue: {
        bg: 'bg-blue-500/5 hover:bg-blue-500/10 dark:bg-blue-500/10 dark:hover:bg-blue-500/20',
        border: 'border-blue-100 hover:border-blue-300 dark:border-blue-900/40 dark:hover:border-blue-700/60',
        icon: 'text-blue-600 dark:text-blue-400',
    },
    green: {
        bg: 'bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20',
        border: 'border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/40 dark:hover:border-emerald-700/60',
        icon: 'text-emerald-600 dark:text-emerald-400',
    },
    purple: {
        bg: 'bg-purple-500/5 hover:bg-purple-500/10 dark:bg-purple-500/10 dark:hover:bg-purple-500/20',
        border: 'border-purple-100 hover:border-purple-300 dark:border-purple-900/40 dark:hover:border-purple-700/60',
        icon: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
        bg: 'bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/10 dark:hover:bg-amber-500/20',
        border: 'border-amber-100 hover:border-amber-300 dark:border-amber-900/40 dark:hover:border-amber-700/60',
        icon: 'text-amber-600 dark:text-amber-400',
    },
    indigo: {
        bg: 'bg-indigo-500/5 hover:bg-indigo-500/10 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20',
        border: 'border-indigo-100 hover:border-indigo-300 dark:border-indigo-900/40 dark:hover:border-indigo-700/60',
        icon: 'text-indigo-600 dark:text-indigo-400',
    },
    gray: {
        bg: 'bg-zinc-500/5 hover:bg-zinc-500/10 dark:bg-zinc-500/10 dark:hover:bg-zinc-500/20',
        border: 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700/40 dark:hover:border-zinc-600/60',
        icon: 'text-zinc-600 dark:text-zinc-400',
    },
    red: {
        bg: 'bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-500/10 dark:hover:bg-rose-500/20',
        border: 'border-rose-100 hover:border-rose-300 dark:border-rose-900/40 dark:hover:border-rose-700/60',
        icon: 'text-rose-600 dark:text-rose-400',
    },
    teal: {
        bg: 'bg-teal-500/5 hover:bg-teal-500/10 dark:bg-teal-500/10 dark:hover:bg-teal-500/20',
        border: 'border-teal-100 hover:border-teal-300 dark:border-teal-900/40 dark:hover:border-teal-700/60',
        icon: 'text-teal-600 dark:text-teal-400',
    },
};

export function QuickActions() {
    const t = useTranslations();

    return (
        <Card className="relative overflow-hidden border border-b-4 border-amber-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-amber-500 dark:bg-zinc-900/90">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                        <BoltIcon className="size-4" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {t('dashboard.quickActions')}
                    </h3>
                </div>
                <span className="text-[11px] text-zinc-400">Phím tắt thao tác nhanh</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {actions.map((action, index) => {
                    const colors = colorClasses[action.color];
                    const Icon = action.icon;
                    return (
                        <button
                            key={index}
                            type="button"
                            className={`group flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 active:scale-95 ${colors.bg} ${colors.border} hover:shadow-sm`}
                        >
                            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-white shadow-2xs transition-transform group-hover:scale-110 dark:bg-zinc-800">
                                <Icon className={`size-4.5 ${colors.icon}`} />
                            </div>
                            <span className="text-center text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                {t(action.labelKey)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}
