"use client";

import {
    KeyIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Chip, Table, TableAction, TableColumn } from "@/components/common";
import { UserModel } from "@/types/system";

interface UserListProps {
    users: UserModel[];
    isLoading: boolean;
    page: number;
    total: number;
    onPageChange: (page: number) => void;
    onEdit: (user: UserModel) => void;
    onDelete: (uuid: string) => void;
    onChangePassword: (user: UserModel) => void;
}

export function UserList({
    users,
    isLoading,
    page,
    total,
    onPageChange,
    onEdit,
    onDelete,
    onChangePassword,
}: Readonly<UserListProps>) {
    const t = useTranslations("common");
    const tSys = useTranslations("system.users");

    const columns: TableColumn<UserModel>[] = [
        { key: "username", label: tSys("fields.username") },
        {
            key: "employeeCode",
            label: tSys("fields.employeeCode"),
            render: (item) => item.employeeCode || "-",
        },
        {
            key: "roleCode",
            label: tSys("fields.role"),
            render: (item) => item.roleCode || "-",
        },
        {
            key: "createdAt",
            label: tSys("fields.createdAt"),
            render: (item) => {
                try {
                    return new Date(item.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                } catch {
                    return item.createdAt;
                }
            },
        },
        {
            key: "status",
            label: tSys("fields.status"),
            align: "center",
            render: (item) => (
                <Chip
                    size="sm"
                    variant="soft"
                    color={item.status === "ACTIVE" ? "success" : "default"}
                >
                    {item.status === "ACTIVE"
                        ? t("status.active")
                        : t("status.inactive")}
                </Chip>
            ),
        },
    ];

    const actions: TableAction<UserModel>[] = [
        {
            key: "edit",
            label: tSys("btn.edit"),
            icon: <PencilSquareIcon className="h-4 w-4" />,
            onClick: onEdit,
        },
        {
            key: "change-password",
            label: tSys("btn.changePassword"),
            icon: <KeyIcon className="h-4 w-4" />,
            onClick: onChangePassword,
        },
        {
            key: "delete",
            label: tSys("btn.delete"),
            icon: <TrashIcon className="h-4 w-4" />,
            color: "danger",
            onClick: (item) => onDelete(item.uuid),
        },
    ];

    return (
        <Table<UserModel>
            aria-label={tSys("title")}
            items={users}
            columns={columns}
            getRowKey={(item) => item.uuid}
            isLoading={isLoading}
            emptyContent={t("msg.noData")}
            pagination={{
                page,
                pageSize: 20,
                total,
                onPageChange,
            }}
            actions={actions}
        />
    );
}
