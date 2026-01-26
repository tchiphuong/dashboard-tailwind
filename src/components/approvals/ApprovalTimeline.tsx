import { User } from '@heroui/react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

export interface TimelineStep {
    id: number;
    title: string;
    actor: {
        name: string;
        email: string;
        avatar: string;
    };
    status: 'completed' | 'current' | 'pending' | 'rejected';
    timestamp?: string;
    comment?: string;
    subSteps?: TimelineStep[];
}

interface ApprovalTimelineProps {
    steps: TimelineStep[];
    isSubStep?: boolean;
}

import { useDateFormatter } from '@/hooks/useDateFormatter';

export function ApprovalTimeline({ steps, isSubStep = false }: ApprovalTimelineProps) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormatter();

    const getIcon = (status: TimelineStep['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="text-success h-6 w-6" />;
            case 'rejected':
                return <XCircleIcon className="text-danger h-6 w-6" />;
            case 'current':
                return <ClockIcon className="text-primary h-6 w-6 animate-pulse" />;
            default:
                return (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800" />
                );
        }
    };

    const getStatusColor = (status: TimelineStep['status']) => {
        switch (status) {
            case 'completed':
                return 'text-success-600 dark:text-success-400';
            case 'rejected':
                return 'text-danger-600 dark:text-danger-400';
            case 'current':
                return 'text-primary-600 dark:text-primary-400';
            default:
                return 'text-gray-400 dark:text-gray-500';
        }
    };

    return (
        <div className={`relative ${isSubStep ? 'mt-4 pl-4' : 'py-4 pl-4'}`}>
            {steps.map((step, index) => (
                <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {/* Connecting Line */}
                    {index !== steps.length - 1 && (
                        <div
                            className={`absolute top-8 left-2.75 -ml-px h-full w-0.5 ${
                                step.status === 'completed'
                                    ? 'bg-success-300 dark:bg-success-700/50'
                                    : 'border-l-2 border-dashed border-gray-200 dark:border-gray-700'
                            }`}
                        />
                    )}

                    {/* Icon/Node */}
                    <div className="relative z-10 flex h-6 w-6 items-center justify-center bg-white dark:bg-gray-800">
                        {getIcon(step.status)}
                    </div>

                    {/* Content */}
                    <div className="-mt-1 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h4 className={`font-semibold ${getStatusColor(step.status)}`}>
                                    {step.title}
                                </h4>
                                <div className="mt-1">
                                    <User
                                        name={step.actor.name}
                                        description={step.actor.email}
                                        avatarProps={{
                                            src: step.actor.avatar,
                                            size: 'sm',
                                        }}
                                        classNames={{
                                            name: 'text-xs text-gray-600 dark:text-gray-300',
                                            description: 'text-[10px] text-gray-400',
                                        }}
                                    />
                                </div>
                            </div>
                            {step.timestamp && (
                                <span className="text-xs whitespace-nowrap text-gray-400 dark:text-gray-500">
                                    {formatDate(step.timestamp)}
                                </span>
                            )}
                        </div>
                        {step.comment && (
                            <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                                <p className="italic">"{step.comment}"</p>
                            </div>
                        )}
                        {/* Render SubSteps Recursively */}
                        {step.subSteps && step.subSteps.length > 0 && (
                            <div className="border-l-2 border-dashed border-gray-200 pl-4 dark:border-gray-700">
                                <ApprovalTimeline steps={step.subSteps} isSubStep={true} />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
