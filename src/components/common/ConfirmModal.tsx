import { Button } from '@heroui/react';
import { Modal } from './Modal';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    type = 'danger',
    isLoading = false,
}: ConfirmModalProps) {
    const { t } = useTranslation();

    const getIcon = () => {
        switch (type) {
            case 'danger':
            case 'warning':
                return <ExclamationTriangleIcon className="text-warning h-6 w-6" />;
            case 'info':
            default:
                return <InformationCircleIcon className="text-primary h-6 w-6" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'danger':
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
            size="md"
            title={
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <span>{title || t('common.confirm')}</span>
                </div>
            }
            footer={
                <>
                    <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                        {cancelText || t('common.cancel')}
                    </Button>
                    <Button color={getColor()} onPress={onConfirm} isLoading={isLoading}>
                        {confirmText || t('common.confirm')}
                    </Button>
                </>
            }
        >
            <p className="text-gray-600 dark:text-zinc-300">{message}</p>
        </Modal>
    );
}
