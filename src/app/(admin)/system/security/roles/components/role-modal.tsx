"use client";

import {
    Button,
    Form,
    Modal,
    Switch,
    TextArea,
    TextField,
    Label,
    Input,
    FieldError,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Role, RoleService } from "@/services/role.service";

const roleSchema = z.object({
    roleCode: z
        .string()
        .min(2, "Role code must be at least 2 characters")
        .max(50, "Role code must not exceed 50 characters")
        .regex(
            /^\w+$/,
            "Role code must be alphanumeric (underscores allowed)",
        ),
    roleName: z
        .string()
        .min(2, "Role name must be at least 2 characters")
        .max(200, "Role name must not exceed 200 characters"),
    description: z
        .string()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
    isActive: z.boolean(),
});

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    role?: Role | null;
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
    const isEdit = !!role;
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fullRoleData, setFullRoleData] = useState<Role | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            roleCode: "",
            roleName: "",
            description: "",
            isActive: true,
        },
    });

    // Reset form or fetch details when modal opens
    useEffect(() => {
        setErrorMessage(null);
        if (isOpen) {
            if (role) {
                // Initial fill from list data
                reset({
                    roleCode: role.roleCode,
                    roleName: role.roleName,
                    description: role.description || "",
                    isActive: role.isActive === 1,
                });

                // Fetch full details to get DataRowVersion
                setIsLoadingDetails(true);
                RoleService.getByCode(role.roleCode)
                    .then((res) => {
                        if (res.data) {
                            setFullRoleData(res.data);
                            // Update form with fresh data if needed
                            setValue("roleName", res.data.roleName);
                            setValue("description", res.data.description || "");
                            setValue("isActive", res.data.isActive === 1);
                        }
                    })
                    .catch((err) => {
                        console.error("Failed to fetch role details", err);
                        setErrorMessage("Failed to load latest role data");
                    })
                    .finally(() => setIsLoadingDetails(false));
            } else {
                setFullRoleData(null);
                reset({
                    roleCode: "",
                    roleName: "",
                    description: "",
                    isActive: true,
                });
            }
        }
    }, [isOpen, role, reset, setValue]);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                ...data,
                isActive: data.isActive ? 1 : 0,
            };

            if (isEdit && role) {
                // Must have DataRowVersion for update
                if (!fullRoleData?.dataRowVersion) {
                    throw new Error(
                        "Missing concurrency token. Please reopen the form.",
                    );
                }
                return RoleService.update(role.roleCode, {
                    ...payload,
                    dataRowVersion: fullRoleData.dataRowVersion,
                });
            } else {
                return RoleService.create(payload);
            }
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            addToast({
                title: "Success",
                description:
                    data.message ||
                    (isEdit
                        ? "Role updated successfully"
                        : "Role created successfully"),
                color: "success",
            });
            onClose();
        },
        onError: (error: any) => {
            console.error("Error saving role:", error);
            const msg = error?.message; // No fallback as requested
            setErrorMessage(msg);
            addToast({
                title: "Error",
                description: msg,
                color: "danger",
            });
        },
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
            <Modal.Backdrop>
                <Modal.Container placement="auto">
                    <Modal.Dialog className="sm:max-w-xl">
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                                <Icon
                                    icon="solar:shield-keyhole-bold"
                                    className="size-5"
                                />
                            </Modal.Icon>
                            <Modal.Heading>
                                {isEdit ? "Edit Role" : "Create New Role"}
                            </Modal.Heading>
                            <p className="text-muted-foreground mt-1.5 text-sm leading-5">
                                {isEdit
                                    ? "Update role permissions and details."
                                    : "Define a new role for the system."}
                            </p>
                        </Modal.Header>
                        <Modal.Body className="p-6">
                            {errorMessage && (
                                <div className="bg-danger-50 text-danger mb-4 rounded-md p-3 text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <Form
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <Controller
                                    name="roleCode"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            isInvalid={!!errors.roleCode}
                                            isDisabled={isEdit}
                                        >
                                            <Label>Role Code</Label>
                                            <Input placeholder="e.g. ADMIN_SYS" />
                                            {errors.roleCode && (
                                                <FieldError>
                                                    {errors.roleCode.message}
                                                </FieldError>
                                            )}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="roleName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            isInvalid={!!errors.roleName}
                                        >
                                            <Label>Role Name</Label>
                                            <Input placeholder="e.g. System Administrator" />
                                            {errors.roleName && (
                                                <FieldError>
                                                    {errors.roleName.message}
                                                </FieldError>
                                            )}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            isInvalid={!!errors.description}
                                        >
                                            <Label>Description</Label>
                                            <TextArea placeholder="Enter role description" />
                                            {errors.description && (
                                                <FieldError>
                                                    {errors.description.message}
                                                </FieldError>
                                            )}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <Switch
                                            isSelected={value}
                                            onChange={onChange}
                                        >
                                            <Switch.Content>
                                                <Switch.Control>
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                                Active Status
                                            </Switch.Content>
                                        </Switch>
                                    )}
                                />
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onPress={onClose}
                                isDisabled={mutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onPress={() => handleSubmit(onSubmit)()}
                                isPending={
                                    mutation.isPending || isLoadingDetails
                                }
                                isDisabled={isEdit && !fullRoleData} // Prevent save if details fetch failed
                            >
                                {isEdit ? "Update" : "Create"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
