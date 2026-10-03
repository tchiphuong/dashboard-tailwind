"use client";

import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Button, Input, ListBox, Select } from "@/components/common";

interface UserFiltersProps {
    keyword: string;
    onKeywordChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    onAdd: () => void;
}

export function UserFilters({
    keyword,
    onKeywordChange,
    status,
    onStatusChange,
    onAdd,
}: Readonly<UserFiltersProps>) {
    const t = useTranslations("common");
    const tSys = useTranslations("system.users");

    return (
        <div className="mb-6 flex flex-col items-end justify-between gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                <div className="relative w-full sm:max-w-75">
                    <MagnifyingGlassIcon className="text-default-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        className="w-full pl-10"
                        placeholder={t("global.lbl.search")}
                        value={keyword}
                        onChange={(e: any) => onKeywordChange(e.target.value)}
                    />
                </div>

                <Select
                    className="w-full sm:max-w-50"
                    placeholder={tSys("fields.status")}
                    selectedKey={status}
                    onSelectionChange={(key: any) => {
                        onStatusChange(key ? String(key) : "");
                    }}
                >
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id="">Tất cả</ListBox.Item>
                            <ListBox.Item id="ACTIVE">
                                {tSys("fields.status")} - Active
                            </ListBox.Item>
                            <ListBox.Item id="INACTIVE">
                                {tSys("fields.status")} - Inactive
                            </ListBox.Item>
                        </ListBox>
                    </Select.Popover>
                </Select>
            </div>

            <Button variant="primary" onPress={onAdd}>
                <PlusIcon className="mr-2 h-5 w-5" />
                {tSys("btn.add")}
            </Button>
        </div>
    );
}
