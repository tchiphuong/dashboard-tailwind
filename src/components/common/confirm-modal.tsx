"use client";

import { AlertDialog } from "@heroui/react";
import type { ReactNode } from "react";
import { Button } from "./button";

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string | ReactNode;
    confirmLabel?: string;
    confirmText?: string;
    cancelLabel?: string;
    cancelText?: string;
    variant?: "default" | "danger";
    type?: "danger" | "warning" | "info" | "default" | string;
    isLoading?: boolean;
}

/**
 * ConfirmModal Component - Chuẩn HeroUI v3 AlertDialog mặc định, không thêm custom classes
 */
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmLabel,
    confirmText,
    cancelLabel,
    cancelText,
    variant = "default",
    type,
    isLoading = false,
}: Readonly<ConfirmModalProps>) {
    const isDanger = variant === "danger" || type === "danger";
    const finalConfirmLabel = confirmLabel || confirmText || "Confirm";
    const finalCancelLabel = cancelLabel || cancelText || "Cancel";

    const handleConfirm = () => {
        onConfirm();
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <AlertDialog.Backdrop>
                <AlertDialog.Container>
                    <AlertDialog.Dialog>
                        <AlertDialog.CloseTrigger />
                        <AlertDialog.Header>
                            <AlertDialog.Icon status={isDanger ? "danger" : "accent"} />
                            <AlertDialog.Heading>{title}</AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                            {typeof message === "string" ? <p>{message}</p> : message}
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button
                                variant="tertiary"
                                onPress={onClose}
                                isDisabled={isLoading}
                            >
                                {finalCancelLabel}
                            </Button>
                            <Button
                                variant={isDanger ? "danger" : "primary"}
                                onPress={handleConfirm}
                                isPending={isLoading}
                            >
                                {finalConfirmLabel}
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    );
}
