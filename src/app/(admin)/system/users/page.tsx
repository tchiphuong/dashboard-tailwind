"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { ConfirmModal, PageHeader } from "@/components/common";
import { useAppToast } from "@/components/common/toast";
import { useApiHandler } from "@/hooks/use-api-handler";
import { useDebounce } from "@/hooks/use-debounce";
import { userService } from "@/services/system/user.service";
import { APP_CONSTANTS } from "@/constants";
import { UserDetailModel, UserModel } from "@/types/system";

import { UserFilters } from "./components/user-filters";
import { UserForm } from "./components/user-form";
import { UserList } from "./components/user-list";

export default function UsersPage() {
    const toast = useAppToast();
    const tSys = useTranslations("system.users");
    const tCommon = useTranslations("common.global.lbl");
    const { handleResponse, handleError } = useApiHandler();

    // Data state
    const [users, setUsers] = useState<UserModel[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Filter state
    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 500);
    const [status, setStatus] = useState("");

    // Form modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDetailModel | null>(
        null,
    );

    // Confirm Delete modal state
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await userService.getUsers({
                pageIndex: page,
                pageSize: APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
                keyword: debouncedKeyword,
                status: status || undefined,
            });

            handleResponse(res, (data) => {
                setUsers(data?.items || []);
                setTotal(data?.paging?.totalItems || 0);
            });
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedKeyword, status, handleResponse, handleError]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAdd = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = async (user: UserModel) => {
        try {
            const res = await userService.getUserById(user.uuid);
            handleResponse(res, (data) => {
                if (data) {
                    setSelectedUser(data);
                    setIsFormOpen(true);
                }
            });
        } catch (error) {
            handleError(error);
        }
    };

    const handleDeleteRequest = (uuid: string) => {
        setUserToDelete(uuid);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const res = await userService.deleteUsers([userToDelete]);
            handleResponse(res, () => {
                toast.success(tCommon("success"), tSys("msg.deleteSuccess"));
                fetchUsers();
            });
        } catch (error) {
            handleError(error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleChangePassword = (user: UserModel) => {
        toast.info(
            tCommon("info"),
            tSys("msg.changePasswordDev", { username: user.username }),
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title={tSys("title")} description={tSys("title")} />

            <div className="bg-content1 rounded-large shadow-small flex w-full flex-1 flex-col p-4">
                <UserFilters
                    keyword={keyword}
                    onKeywordChange={(val) => {
                        setKeyword(val);
                        setPage(1);
                    }}
                    status={status}
                    onStatusChange={(val) => {
                        setStatus(val);
                        setPage(1);
                    }}
                    onAdd={handleAdd}
                />

                <UserList
                    users={users}
                    isLoading={isLoading}
                    page={page}
                    total={total}
                    onPageChange={setPage}
                    onEdit={handleEdit}
                    onDelete={handleDeleteRequest}
                    onChangePassword={handleChangePassword}
                />
            </div>

            <UserForm
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                user={selectedUser}
                onSuccess={fetchUsers}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={tSys("btn.delete")}
                message={tSys("msg.deleteConfirm")}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
                variant="danger"
            />
        </div>
    );
}
