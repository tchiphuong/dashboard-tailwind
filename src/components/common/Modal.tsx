import {
    Modal as HeroModal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@heroui/react';
import { ReactNode } from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
    scrollBehavior?: 'inside' | 'outside' | 'normal';
    className?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    scrollBehavior = 'inside',
    className,
}: ModalProps) {
    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            scrollBehavior={scrollBehavior}
            backdrop="blur"
            className={className}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                        <ModalBody>{children}</ModalBody>
                        {footer && <ModalFooter>{footer}</ModalFooter>}
                    </>
                )}
            </ModalContent>
        </HeroModal>
    );
}
