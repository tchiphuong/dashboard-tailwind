import { Button as HeroButton, ButtonProps as HeroButtonProps } from '@heroui/react';
import React from 'react';

export type LegacyButtonVariant = 'light' | 'flat' | 'bordered' | 'solid';

export interface ButtonProps extends Omit<HeroButtonProps, 'children' | 'variant'> {
    isIconOnlyMobile?: boolean;
    startContent?: React.ReactNode;
    children?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'danger' | 'default' | 'success' | 'warning' | string;
    variant?: HeroButtonProps['variant'] | LegacyButtonVariant;
    isLoading?: boolean;
}

function resolveButtonVariant(
    variant?: ButtonProps['variant'],
    color?: string
): HeroButtonProps['variant'] {
    if (color === 'danger') return 'danger';
    if (variant === 'light') return 'ghost';
    if (variant === 'flat') return 'tertiary';
    if (variant === 'bordered') return 'outline';
    if (variant === 'solid') return color === 'secondary' ? 'secondary' : 'primary';
    if (variant) return variant as HeroButtonProps['variant'];
    if (color === 'secondary') return 'secondary';
    if (color === 'primary') return 'primary';
    return undefined;
}

/**
 * Button Component chuẩn hóa HeroUI v3
 * Type-safe tuyệt đối, xóa sạch toàn bộ kiểu any lỏng lẻo
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            isIconOnlyMobile,
            startContent,
            color,
            variant,
            isLoading,
            ...props
        },
        ref
    ) => {
        const resolvedVariant = resolveButtonVariant(variant, color);
        const isPending = isLoading ?? props.isPending;

        if (isIconOnlyMobile) {
            return (
                <HeroButton
                    ref={ref}
                    variant={resolvedVariant}
                    isPending={isPending}
                    className={className}
                    {...props}
                >
                    {startContent && <span>{startContent}</span>}
                    <span className="hidden sm:inline">{children}</span>
                </HeroButton>
            );
        }

        return (
            <HeroButton
                ref={ref}
                variant={resolvedVariant}
                isPending={isPending}
                className={className}
                {...props}
            >
                {startContent}
                {children}
            </HeroButton>
        );
    }
);

Button.displayName = 'Button';
export type { HeroButtonProps };
