"use client";

import { Modal as HeroModal } from "@heroui/react";
import { ReactNode } from "react";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | "cover";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
    scroll?: "inside" | "outside";
    backdrop?: "opaque" | "blur" | "transparent";
    className?: string;
    [key: string]: unknown;
}

function resolveModalSize(size?: ModalSize): "xs" | "sm" | "md" | "lg" | "cover" | "full" {
    if (size === "2xl" || size === "3xl" || size === "4xl" || size === "5xl" || size === "xl") return "lg";
    if (size === "full") return "full";
    if (size === "cover") return "cover";
    if (size === "xs") return "xs";
    if (size === "sm") return "sm";
    return "md";
}

/**
 * Modal wrapper chuẩn hóa với default props
 * Default: size="md", scroll="inside", backdrop="blur"
 */
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    scroll = "inside",
    backdrop = "blur",
    className,
}: Readonly<ModalProps>) {
    const resolvedSize = resolveModalSize(size);

    return (
        <HeroModal.Backdrop
            variant={backdrop}
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <HeroModal.Container size={resolvedSize} scroll={scroll}>
                <HeroModal.Dialog className={className}>
                    <HeroModal.CloseTrigger />
                    {title && (
                        <HeroModal.Header>
                            <HeroModal.Heading>{title}</HeroModal.Heading>
                        </HeroModal.Header>
                    )}
                    <HeroModal.Body>{children}</HeroModal.Body>
                    {footer && <HeroModal.Footer>{footer}</HeroModal.Footer>}
                </HeroModal.Dialog>
            </HeroModal.Container>
        </HeroModal.Backdrop>
    );
}

// Re-export sub-components for direct use if needed
export { HeroModal as HeroModalRoot };
export const ModalHeader = HeroModal.Header;
export const ModalBody = HeroModal.Body;
export const ModalFooter = HeroModal.Footer;
export const ModalContent = HeroModal.Container;

