import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

interface UseConfirmDeleteProps {
    queryKey: string;
    deleteService: (ids: number[]) => Promise<unknown>;
    onSuccess?: () => void;
}

export function useConfirmDelete({
    queryKey,
    deleteService,
    onSuccess,
}: UseConfirmDeleteProps) {
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            setDeleteId(null);
            setIsDeleteOpen(false);
            onSuccess?.();
        },
        onError: (error) => {
            console.error(`[${queryKey}] Delete failed`, error);
        },
    });

    const handleDeleteClick = useCallback((id: number) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteId) {
            deleteMutation.mutate([deleteId]);
        }
    }, [deleteId, deleteMutation]);

    const closeDelete = useCallback(() => {
        setIsDeleteOpen(false);
        setDeleteId(null);
    }, []);

    return {
        isDeleteOpen,
        deleteIsPending: deleteMutation.isPending,
        handleDeleteClick,
        confirmDelete,
        closeDelete,
    };
}
