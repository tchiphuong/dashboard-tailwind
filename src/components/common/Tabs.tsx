'use client';

import { Tabs as HeroTabs, type TabsProps as HeroTabsProps } from '@heroui/react';
import React from 'react';

export interface TabProps {
    id?: string;
    key?: string;
    title?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
}

export function Tab(props: TabProps) {
    return <>{props.children}</>;
}

export function Tabs({
    children,
    selectedKey,
    defaultSelectedKey,
    onSelectionChange,
    className = '',
    isVertical,
    orientation,
    ...props
}: HeroTabsProps & { isVertical?: boolean }) {
    const childArray = React.Children.toArray(children);
    const isDeclarative = childArray.some(
        (child) => React.isValidElement(child) && (child.props as TabProps).title !== undefined
    );

    if (!isDeclarative) {
        return (
            <HeroTabs
                selectedKey={selectedKey}
                defaultSelectedKey={defaultSelectedKey}
                onSelectionChange={onSelectionChange}
                orientation={isVertical ? 'vertical' : orientation}
                className={className}
                {...props}
            >
                {children}
            </HeroTabs>
        );
    }

    const extractId = (child: React.ReactNode) => {
        if (!React.isValidElement(child)) return undefined;
        const props = child.props as TabProps;
        if (props.id) return props.id;
        if (child.key) return String(child.key).replace(/^[.$]+/, '');
        return undefined;
    };

    const currentKey = selectedKey ?? defaultSelectedKey ?? extractId(childArray[0]);
    return (
        <HeroTabs
            selectedKey={currentKey}
            onSelectionChange={onSelectionChange}
            orientation={isVertical ? 'vertical' : orientation}
            className={className}
            {...props}
        >
            <HeroTabs.ListContainer>
                <HeroTabs.List aria-label="Tabs">
                    {childArray.map((child) => {
                        if (!React.isValidElement(child)) return null;
                        const props = child.props as TabProps;
                        const id = extractId(child);
                        return (
                            <HeroTabs.Tab key={id} id={id}>
                                {props.title}
                                <HeroTabs.Indicator />
                            </HeroTabs.Tab>
                        );
                    })}
                </HeroTabs.List>
            </HeroTabs.ListContainer>
            {childArray.map((child) => {
                if (!React.isValidElement(child)) return null;
                const props = child.props as TabProps;
                const id = extractId(child);
                return (
                    <HeroTabs.Panel key={id} id={id} className={props.className}>
                        {props.children}
                    </HeroTabs.Panel>
                );
            })}
        </HeroTabs>
    );
}

Tabs.ListContainer = HeroTabs.ListContainer;
Tabs.List = HeroTabs.List;
Tabs.Tab = HeroTabs.Tab;
Tabs.Panel = HeroTabs.Panel;
Tabs.Indicator = HeroTabs.Indicator;
Tabs.Separator = HeroTabs.Separator;

export type { TabsProps } from '@heroui/react';
