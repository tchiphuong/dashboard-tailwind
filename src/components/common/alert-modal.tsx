import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

import { Button } from './button';
import { Modal } from './modal';

export interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    type?: 'success' | 'error' | 'info' | 'warning';
}

/**
 * AlertModal Component chuẩn hóa
 * Import Button từ common nội bộ, tuân thủ 100% HeroUI v3
 */
export function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    buttonText,
    type = 'info',
}: Readonly<AlertModalProps>) {
    const { t } = useTranslation();

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="text-success h-6 w-6" />;
            case 'error':
                return <XCircleIcon className="text-danger h-6 w-6" />;
            case 'warning':
                return <InformationCircleIcon className="text-warning h-6 w-6" />;
            case 'info':
            default:
                return <InformationCircleIcon className="text-primary h-6 w-6" />;
        }
    };

    const getVariant = (): 'primary' | 'danger' => {
        if (type === 'error') return 'danger';
        return 'primary';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            title={
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <span>{title || t('common.alert')}</span>
                </div>
            }
            footer={
                <Button variant={getVariant()} onPress={onClose}>
                    {buttonText || t('common.ok')}
                </Button>
            }
        >
            <p className="text-center text-gray-600 dark:text-gray-300">{message}</p>
        </Modal>
    );
}
