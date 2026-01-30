import { Button } from '@heroui/react';
import { Modal } from './Modal';
import { useTranslation } from 'react-i18next';
import { InformationCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    type?: 'success' | 'error' | 'info' | 'warning';
}

export function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    buttonText,
    type = 'info',
}: AlertModalProps) {
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

    const getColor = () => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'danger';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'primary';
        }
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
                <Button color={getColor()} onPress={onClose} fullWidth>
                    {buttonText || t('common.ok')}
                </Button>
            }
        >
            <p className="text-center text-gray-600 dark:text-gray-300">{message}</p>
        </Modal>
    );
}
