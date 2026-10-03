import { Separator, Skeleton } from '@heroui/react';
import React from 'react';
import { Card } from './card';

export { Skeleton };

export const CardSkeleton = () => {
    return (
        <Card className="w-full space-y-5 rounded-lg p-4">
            <Skeleton className="rounded-lg">
                <div className="bg-default-300 h-32 rounded-lg" />
            </Skeleton>
            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="bg-default-200 h-3 w-3/5 rounded-lg" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="bg-default-200 h-3 w-4/5 rounded-lg" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="bg-default-300 h-3 w-2/5 rounded-lg" />
                </Skeleton>
            </div>
        </Card>
    );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
    return (
        <div className="w-full">
            {/* Toolbar/Header placeholder */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <Skeleton className="h-10 w-1/3 rounded-lg" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
            </div>

            {/* Table wrapper placeholder */}
            <Card className="w-full p-0 shadow-sm">
                <div className="flex w-full flex-col">
                    {/* Header Row */}
                    <div className="bg-default-100 flex h-12 items-center gap-4 px-4">
                        <Skeleton className="h-4 w-1/4 rounded-md" />
                        <Skeleton className="h-4 w-1/4 rounded-md" />
                        <Skeleton className="h-4 w-1/4 rounded-md" />
                        <Skeleton className="h-4 w-1/4 rounded-md" />
                    </div>
                    <Separator />

                    {/* Body Rows */}
                    {Array.from({ length: rows }).map((_, i) => (
                        <React.Fragment key={i}>
                            <div className="hover:bg-default-50 flex h-14 items-center gap-4 px-4">
                                <Skeleton className="h-4 w-1/4 rounded-md" />
                                <Skeleton className="h-4 w-1/4 rounded-md" />
                                <Skeleton className="h-4 w-1/4 rounded-md" />
                                <Skeleton className="h-8 w-1/4 rounded-md" />
                            </div>
                            {i < rows - 1 && <Separator />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Pagination placeholder */}
                <Separator />
                <div className="bg-default-50 flex items-center justify-between p-4">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-8 w-64 rounded-md" />
                </div>
            </Card>
        </div>
    );
};

export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => {
    return (
        <Card className="w-full space-y-6 rounded-lg p-6">
            {/* Form Header */}
            <div className="space-y-2">
                <Skeleton className="w-1/4 rounded-lg">
                    <div className="bg-default-300 h-6 w-1/4 rounded-lg" />
                </Skeleton>
                <Skeleton className="w-2/4 rounded-lg">
                    <div className="bg-default-200 h-4 w-2/4 rounded-lg" />
                </Skeleton>
            </div>
            <Separator />
            {/* Form Fields */}
            <div className="space-y-4">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="w-1/5 rounded-md">
                            <div className="bg-default-200 h-4 w-1/5 rounded-md" />
                        </Skeleton>
                        <Skeleton className="w-full rounded-lg">
                            <div className="bg-default-100 h-10 w-full rounded-lg" />
                        </Skeleton>
                    </div>
                ))}
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
        </Card>
    );
};
