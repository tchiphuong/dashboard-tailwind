import {
    Tabs as HeroTabs,
    Tab as HeroTab,
    TabsProps as HeroTabsProps,
    TabItemProps,
} from '@heroui/react';
import { ReactNode } from 'react';

export interface TabsProps extends HeroTabsProps {
    children: ReactNode;
}

export interface TabProps extends TabItemProps {
    children: ReactNode;
}

export function Tabs(props: TabsProps) {
    const { children, classNames, ...rest } = props;

    return (
        <HeroTabs radius="full" {...rest}>
            {children}
        </HeroTabs>
    );
}

// Re-export Tab for convenience and consistency
export const Tab = HeroTab;
