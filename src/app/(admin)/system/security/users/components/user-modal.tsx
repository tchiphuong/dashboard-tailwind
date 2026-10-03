"use client";

import {
    Button,
    Form,
    Label,
    Modal,
    Switch,
    TextField,
    Input,
    FieldError,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { User, UserService } from "@/services/user.service";

// Define Base Schema (without refinements yet)
const baseUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    displayName: z.string().min(1, "Display name is required"),
    // email: z.string().email("Invalid email address"), // Removed
    password: z.string().optional(),
    status: z.boolean().default(false),
});

// Create Schema: Password mandatory
const createUserSchema = baseUserSchema.extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Edit Schema: Password optional (no change if empty)
const editUserSchema = baseUserSchema;

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const isEdit = !!user;
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
        defaultValues: {
            username: "",
            displayName: "",
            // email: "", // Removed
            password: "",
            status: false,
        },
    });

    // Reset form when user changes or modal opens
    useEffect(() => {
        if (isOpen) {
            if (user) {
                reset({
                    username: user.username,
                    displayName: user.displayName,
                    // email: user.email, // Removed
                    password: "",
                    status: user.status === "ACTIVE",
                });
            } else {
                reset({
                    username: "",
                    displayName: "",
                    // email: "", // Removed
                    password: "",
                    status: false,
                });
            }
        }
    }, [isOpen, user, reset]);

    type UserFormData = z.infer<typeof baseUserSchema>;

    const mutation = useMutation({
        mutationFn: async (formData: UserFormData) => {
            const payload: Record<string, unknown> = {
                username: formData.username,
                displayName: formData.displayName,
                status: formData.status ? 1 : 0,
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (isEdit && user) {
                return UserService.update(user.id, payload);
            } else {
                return UserService.create(payload);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            addToast({
                title: "Success",
                description: data.message,
                color: "success",
            });
            onClose();
        },
        onError: (error: unknown) => {
            console.error("Error saving user:", error);
            const msg = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
            addToast({
                title: "Error",
                description: msg,
                color: "danger",
            });
        },
    });

    const onSubmit = (formData: UserFormData) => {
        mutation.mutate(formData);
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
                                    icon="solar:user-bold"
                                    className="size-5"
                                />
                            </Modal.Icon>
                            <Modal.Heading>
                                {isEdit ? "Edit User" : "Create New User"}
                            </Modal.Heading>
                            <p className="text-muted-foreground mt-1.5 text-sm leading-5">
                                {isEdit
                                    ? "Update user information below."
                                    : "Fill in the details to create a new user."}
                            </p>
                        </Modal.Header>
                        <Modal.Body className="p-6">
                            <Form
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            isInvalid={!!errors.username}
                                        >
                                            <Label>Username</Label>
                                            <Input placeholder="Enter username" />
                                            {errors.username && (
                                                <FieldError>
                                                    {errors.username.message}
                                                </FieldError>
                                            )}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="displayName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            isInvalid={!!errors.displayName}
                                        >
                                            <Label>Display Name</Label>
                                            <Input placeholder="Enter display name" />
                                            {errors.displayName && (
                                                <FieldError>
                                                    {errors.displayName.message}
                                                </FieldError>
                                            )}
                                        </TextField>
                                    )}
                                />

                                {/* Email field removed */}

                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            isInvalid={!!errors.password}
                                        >
                                            <Label>
                                                {isEdit
                                                    ? "Password (leave blank to keep current)"
                                                    : "Password"}
                                            </Label>
                                            <Input
                                                type="password"
                                                placeholder="Enter password"
                                            />
                                            {errors.password && (
                                                <FieldError>
                                                    {errors.password.message}
                                                </FieldError>
                                            )}
                                        </TextField>
                                    )}
                                />

                                <Controller
                                    name="status"
                                    control={control}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <Switch
                                            isSelected={!!value}
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
                                isPending={mutation.isPending}
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
