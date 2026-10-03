"use client";

import { Dropdown as HeroDropdown, DropdownProps } from "@heroui/react";

export function Dropdown(props: Readonly<DropdownProps>) {
    return <HeroDropdown {...props} />;
}

Dropdown.Trigger = HeroDropdown.Trigger;
Dropdown.Popover = HeroDropdown.Popover;
Dropdown.Menu = HeroDropdown.Menu;
Dropdown.Item = HeroDropdown.Item;
Dropdown.Section = HeroDropdown.Section;
