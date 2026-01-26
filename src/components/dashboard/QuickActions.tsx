import { useTranslation } from 'react-i18next';
import {
    PlusIcon,
    UserPlusIcon,
    CubeIcon,
    ChartBarIcon,
    UsersIcon,
    Cog6ToothIcon,
    BellIcon,
    ArrowUpTrayIcon,
    BoltIcon,
} from '@heroicons/react/24/outline';

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
        bg: 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50',
        border: 'border-blue-200 dark:border-blue-700',
        icon: 'text-blue-600 dark:text-blue-400',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50',
        border: 'border-green-200 dark:border-green-700',
        icon: 'text-green-600 dark:text-green-400',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50',
        border: 'border-purple-200 dark:border-purple-700',
        icon: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50',
        border: 'border-orange-200 dark:border-orange-700',
        icon: 'text-orange-600 dark:text-orange-400',
    },
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
        border: 'border-indigo-200 dark:border-indigo-700',
        icon: 'text-indigo-600 dark:text-indigo-400',
    },
    gray: {
        bg: 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700',
        border: 'border-gray-200 dark:border-gray-600',
        icon: 'text-gray-600 dark:text-gray-400',
    },
    red: {
        bg: 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50',
        border: 'border-red-200 dark:border-red-700',
        icon: 'text-red-600 dark:text-red-400',
    },
    teal: {
        bg: 'bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50',
        border: 'border-teal-200 dark:border-teal-700',
        icon: 'text-teal-600 dark:text-teal-400',
    },
};

export function QuickActions() {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg lg:col-span-2 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <BoltIcon className="mr-2 h-5 w-5 text-yellow-500" />
                {t('dashboard.quickActions')}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {actions.map((action, index) => {
                    const colors = colorClasses[action.color];
                    const Icon = action.icon;
                    return (
                        <button
                            key={index}
                            className={`flex flex-col items-center rounded-xl p-4 ${colors.bg} border transition-all duration-200 ${colors.border} hover:shadow-md`}
                        >
                            <Icon className={`h-6 w-6 ${colors.icon} mb-2`} />
                            <span className="text-center text-sm font-medium text-gray-700 dark:text-gray-200">
                                {t(action.labelKey)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
