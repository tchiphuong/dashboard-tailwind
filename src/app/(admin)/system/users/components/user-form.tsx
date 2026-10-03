"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button, Input, Modal, useAppToast } from "@/components/common";
import { useApiHandler } from "@/hooks/use-api-handler";
import { apiClient } from "@/lib/api-client";
import { userService } from "@/services/system/user.service";
import {
    CreateUserPayload,
    UpdateUserPayload,
    UserDetailModel,
} from "@/types/system";

interface UserFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    user?: UserDetailModel | null;
    onSuccess: () => void;
}

export function UserForm({
    isOpen,
    onOpenChange,
    user,
    onSuccess,
}: Readonly<UserFormProps>) {
    const t = useTranslations("common");
    const tSys = useTranslations("system.users");
    const toast = useAppToast();
    const { handleResponse, handleError } = useApiHandler();

    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [employeeCode, setEmployeeCode] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("ACTIVE");

    // Combobox state
    const [employees, setEmployees] = useState<
        { value: string; label: string }[]
    >([]);
    const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);

    const isEdit = !!user;

    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoadingEmployees(true);
            try {
                const res = await apiClient.get<any>(
                    "/api/v1/employees/combobox",
                );
                if (res?.data) {
                    setEmployees(
                        res.data.map((x: any) => ({
                            value: x.value || x.code,
                            label: x.label || x.name || x.code,
                        })),
                    );
                }
            } catch (e) {
                console.error("Failed to fetch employees", e);
            } finally {
                setIsLoadingEmployees(false);
            }
        };

        const fetchRoles = async () => {
            setIsLoadingRoles(true);
            try {
                const res = await apiClient.get<any>("/api/v1/roles/combobox");
                if (res?.data) {
                    setRoles(
                        res.data.map((x: any) => ({
                            value: x.value || x.code,
                            label: x.label || x.name || x.code,
                        })),
                    );
                } else {
                    setRoles([
                        { value: "ADMIN", label: "System Administrator" },
                        { value: "USER", label: "Standard User" },
                    ]);
                }
            } catch (e) {
                console.error("Failed to fetch roles", e);
                setRoles([
                    { value: "ADMIN", label: "System Administrator" },
                    { value: "USER", label: "Standard User" },
                ]);
            } finally {
                setIsLoadingRoles(false);
            }
        };

        if (isOpen) {
            fetchEmployees();
            fetchRoles();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setUsername(user.username);
                setEmail(user.email);
                setEmployeeCode(user.employeeCode || "");
                setRole(user.roleCode || "");
                setStatus(user.status || "ACTIVE");
                setPassword("");
            } else {
                setUsername("");
                setEmail("");
                setEmployeeCode("");
                setRole("");
                setStatus("ACTIVE");
                setPassword("");
            }
        }
    }, [isOpen, user]);

    const handleSubmit = async () => {
        if (!email || !status) {
            toast.error(t("msg.fillRequiredFields"));
            return;
        }

        if (!isEdit && (!username || !password || !role)) {
            toast.error(t("msg.fillRequiredFields"));
            return;
        }

        setIsLoading(true);
        try {
            if (isEdit && user) {
                const payload: UpdateUserPayload = {
                    email,
                    employeeCode: employeeCode || undefined,
                    status,
                    rowVersion: user.rowVersion,
                };

                const res = await userService.updateUser(user.uuid, payload);
                handleResponse(res, () => {
                    toast.success(tSys("msg.updateSuccess"));
                    onSuccess();
                    onOpenChange(false);
                });
            } else {
                const payload: CreateUserPayload = {
                    username,
                    email,
                    password,
                    employeeCode: employeeCode || undefined,
                    status,
                    roleCodes: role ? [role] : undefined,
                };

                const res = await userService.createUser(payload);
                handleResponse(res, () => {
                    toast.success(tSys("msg.createSuccess"));
                    onSuccess();
                    onOpenChange(false);
                });
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onOpenChange(false)}
            size="lg"
            title={isEdit ? tSys("btn.edit") : tSys("btn.add")}
            footer={
                <div className="flex w-full justify-end gap-2">
                    <Button variant="ghost" onPress={() => onOpenChange(false)}>
                        {tSys("btn.cancel")}
                    </Button>
                    <Button
                        variant="primary"
                        onPress={handleSubmit}
                        isPending={isLoading}
                    >
                        {tSys("btn.save")}
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="text-sm font-medium">
                        {tSys("fields.username")}
                    </label>
                    <Input
                        id="username"
                        placeholder="e.g. john.doe"
                        value={username}
                        onChange={(e: any) => setUsername(e.target.value)}
                        disabled={isEdit}
                        className={isEdit ? "opacity-70" : ""}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                    />
                </div>

                {!isEdit && (
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium"
                        >
                            {tSys("fields.password")}
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="******"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="employeeCode"
                        className="text-sm font-medium"
                    >
                        {tSys("fields.employeeCode")}
                    </label>
                    <select
                        id="employeeCode"
                        className="border-default-200 placeholder:text-default-400 focus:ring-primary flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={employeeCode}
                        onChange={(e) => setEmployeeCode(e.target.value)}
                        disabled={isLoadingEmployees}
                    >
                        <option value="">
                            {tSys("fields.employeeCode")}...
                        </option>
                        {employees.map((emp) => (
                            <option key={emp.value} value={emp.value}>
                                {emp.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="role" className="text-sm font-medium">
                        {tSys("fields.role")}
                    </label>
                    <select
                        id="role"
                        className="border-default-200 placeholder:text-default-400 focus:ring-primary flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isEdit || isLoadingRoles}
                    >
                        <option value="">Select role...</option>
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="status" className="text-sm font-medium">
                        {tSys("fields.status")}
                    </label>
                    <select
                        id="status"
                        className="border-default-200 placeholder:text-default-400 focus:ring-primary flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="ACTIVE">{t("status.active")}</option>
                        <option value="INACTIVE">{t("status.inactive")}</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
}
