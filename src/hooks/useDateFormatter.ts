import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useDateFormatter = () => {
    const { i18n } = useTranslation();

    const formatDate = useCallback(
        (dateString?: string, options?: Intl.DateTimeFormatOptions) => {
            if (!dateString) return '';

            try {
                const date = new Date(dateString);
                // Check if date is valid
                if (isNaN(date.getTime())) return dateString;

                return new Intl.DateTimeFormat(i18n.language, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    ...options,
                }).format(date);
            } catch (error) {
                console.error('Error formatting date:', error);
                return dateString;
            }
        },
        [i18n.language]
    );

    return { formatDate };
};
