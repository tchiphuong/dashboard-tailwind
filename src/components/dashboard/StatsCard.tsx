import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UsersIcon, CurrencyDollarIcon, ShoppingCartIcon, CubeIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { StatCard as StatCardType } from '@/types';

interface StatsCardProps {
    stat: StatCardType;
}

// Icon mapping
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    'fa-users': UsersIcon,
    'fa-dollar-sign': CurrencyDollarIcon,
    'fa-shopping-cart': ShoppingCartIcon,
    'fa-box': CubeIcon,
};

// Color mapping for dynamic classes
const colorClasses: Record<string, { bg: string; text: string; icon: string; bgLight: string }> = {
    blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/50',
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-600 dark:text-blue-400',
        bgLight: 'bg-blue-400',
    },
    green: {
        bg: 'bg-green-100 dark:bg-green-900/50',
        text: 'text-green-600 dark:text-green-400',
        icon: 'text-green-600 dark:text-green-400',
        bgLight: 'bg-green-400',
    },
    purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/50',
        text: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-600 dark:text-purple-400',
        bgLight: 'bg-purple-400',
    },
    yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/50',
        text: 'text-yellow-600 dark:text-yellow-400',
        icon: 'text-yellow-600 dark:text-yellow-400',
        bgLight: 'bg-yellow-400',
    },
};

export function StatsCard({ stat }: StatsCardProps) {
    const { t } = useTranslation();
    const counterRef = useRef<HTMLSpanElement>(null);
    const colors = colorClasses[stat.color] || colorClasses.blue;
    const IconComponent = iconComponents[stat.icon];

    useEffect(() => {
        if (!counterRef.current) return;

        const target = stat.value;
        const duration = 2000;
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
                    counterRef.current.textContent = Math.floor(current).toLocaleString();
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
        <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300">
                    {stat.title}
                </h3>
                <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                    {IconComponent && <IconComponent className={`w-5 h-5 ${colors.icon}`} />}
                </div>
            </div>
            <p className={`text-3xl font-bold mb-2 ${colors.text}`}>
                {stat.prefix && <span>{stat.prefix}</span>}
                <span ref={counterRef} className="counter">0</span>
                {stat.suffix && <span>{stat.suffix}</span>}
            </p>
            <div className={`flex items-center text-sm ${stat.changeType === 'up' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {stat.changeType === 'up' ?
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> :
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                }
                <span>{t('dashboard.fromLastMonth', { change: stat.change })}</span>
            </div>
            {/* Animated background element */}
            <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 dark:opacity-5 ${colors.bgLight}`} />
        </div>
    );
}
