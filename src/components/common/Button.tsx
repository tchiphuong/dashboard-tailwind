import { Button as HeroButton, ButtonProps as HeroButtonProps } from '@heroui/react';

export interface ButtonProps extends HeroButtonProps {
    isIconOnlyMobile?: boolean;
}

export function Button({
    children,
    radius = 'full',
    className = '',
    isIconOnlyMobile,
    startContent,
    ...props
}: ButtonProps) {
    if (isIconOnlyMobile) {
        return (
            <HeroButton
                radius={radius}
                className={`h-10 w-10 min-w-0 p-0 font-medium sm:h-10 sm:w-auto sm:min-w-20 sm:px-4 ${className}`}
                {...props}
            >
                <div className="flex items-center gap-2">
                    {/* Show icon always, but size might need adjustment if passed manually */}
                    {startContent ? (
                        <span className="flex items-center justify-center">{startContent}</span>
                    ) : null}
                    {/* Hide text on mobile */}
                    <span className="hidden sm:inline">{children}</span>
                </div>
            </HeroButton>
        );
    }

    return (
        <HeroButton
            radius={radius}
            className={`font-medium ${className}`}
            startContent={startContent}
            {...props}
        >
            {children}
        </HeroButton>
    );
}
