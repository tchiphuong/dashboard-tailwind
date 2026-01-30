import { useTranslation } from 'react-i18next';

export function NotificationsPage() {
    const { t } = useTranslation();
    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('menu.notifications')}
            </h1>
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <p className="text-gray-500 dark:text-gray-400">
                    Notifications Center - Coming Soon...
                </p>
            </div>
        </>
    );
}
