"use client";

import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
    ConfirmModal,
    Table,
    TableColumn,
    TableAction,
    Chip,
    Input,
} from "@/components/common";
import { PageHeader } from "@/components/page-header-i18n";
import { useDebounce } from "@/hooks/use-debounce";
import { User, UserService } from "@/services/user.service";

import { UserModal } from "./components/user-modal";

// Icon components
const EditIcon = (props: { className?: string }) => <Icon icon="solar:pen-bold" {...props} />;
const DeleteIcon = (props: { className?: string }) => (
    <Icon icon="solar:trash-bin-trash-bold" {...props} />
);


export default function UsersPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 500);

    // Modal State
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const onOpen = () => setIsOpen(true);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Confirm Delete State
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["users", pageIndex, pageSize, debouncedKeyword],
        queryFn: () =>
            UserService.list({
                pageIndex,
                pageSize,
                keyword: debouncedKeyword,
            }),
    });

    const deleteMutation = useMutation({
        mutationFn: UserService.delete,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            addToast({
                title: "Success",
                description: data?.message,
                color: "success",
            });
            setDeleteId(null);
            setIsDeleteOpen(false);
        },
        onError: (error) => {
            console.error("Delete failed", error);
            addToast({
                title: "Error",
                description: "Failed to delete user",
                color: "danger",
            });
        },
    });

    const handleCreate = () => {
        setSelectedUser(null);
        onOpen();
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        onOpen();
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate([deleteId]);
        }
    };

    const columns: TableColumn<User>[] = [
        {
            key: "username",
            label: "Username",
        },
        {
            key: "displayName",
            label: "Display Name",
        },
        {
            key: "status",
            label: "Status",
            render: (user: User) => (
                <Chip
                    className="capitalize"
                    color={user.status === "Active" ? "success" : "danger"}
                    size="sm"
                    variant="soft"
                >
                    {user.status === "Active" ? "Active" : "Inactive"}
                </Chip>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (user: User) =>
                user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "-",
        },
    ];

    const actions: TableAction<User>[] = [
        {
            key: "edit",
            label: "Edit",
            icon: <EditIcon className="size-4" />,
            onClick: (user) => handleEdit(user),
        },
        {
            key: "delete",
            label: "Delete",
            icon: <DeleteIcon className="size-4" />,
            color: "danger",
            onClick: (user) => handleDeleteClick(user.id),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Users Management"
                description="Manage users in the system"
                action={{
                    label: "Add User",
                    onClick: handleCreate,
                }}
            />

            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row">
                    <Input
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search users..."
                        value={keyword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    items={data?.data?.items || []}
                    getRowKey={(item) => item.id}
                    isLoading={isLoading}
                    pagination={{
                        page: pageIndex,
                        pageSize: pageSize,
                        total: data?.data?.paging?.totalItems || 0,
                        onPageChange: setPageIndex,
                        onPageSizeChange: setPageSize,
                    }}
                    actions={actions}
                />
            </div>

            <UserModal isOpen={isOpen} onClose={onClose} user={selectedUser} />

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this user?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isLoading={deleteMutation.isPending}
                variant="danger"
            />
        </div>
    );
}
