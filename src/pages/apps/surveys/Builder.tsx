import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    ChatBubbleBottomCenterTextIcon,
    ListBulletIcon,
    CheckCircleIcon,
    StarIcon,
    Bars3Icon,
    ChevronUpIcon,
    ChevronDownIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { SelectItem, Textarea, Switch, Divider } from '@heroui/react';

type QuestionType = 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'rating';

interface Question {
    id: string;
    type: QuestionType;
    title: string;
    description?: string;
    required: boolean;
    options?: string[]; // For choice questions
    children?: Question[];
}

export function SurveyBuilderPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [title, setTitle] = useState(isEditMode ? 'Customer Satisfaction Survey 2024' : '');
    const [description, setDescription] = useState(
        isEditMode ? 'Gathering feedback on Q1 product updates.' : ''
    );

    const [questions, setQuestions] = useState<Question[]>([
        {
            id: '1',
            type: 'short_text',
            title: 'What is your name?',
            required: true,
        },
    ]);

    // --- Helpers for Recursive State Management ---

    const updateQuestionRecursive = (
        list: Question[],
        targetId: string,
        updates: Partial<Question>
    ): Question[] => {
        return list.map((q) => {
            if (q.id === targetId) {
                return { ...q, ...updates };
            }
            if (q.children) {
                return {
                    ...q,
                    children: updateQuestionRecursive(q.children, targetId, updates),
                };
            }
            return q;
        });
    };

    const deleteQuestionRecursive = (list: Question[], targetId: string): Question[] => {
        return list
            .filter((q) => q.id !== targetId)
            .map((q) => ({
                ...q,
                children: q.children ? deleteQuestionRecursive(q.children, targetId) : undefined,
            }));
    };

    const addChildQuestionRecursive = (
        list: Question[],
        parentId: string,
        newChild: Question
    ): Question[] => {
        return list.map((q) => {
            if (q.id === parentId) {
                return { ...q, children: [...(q.children || []), newChild] };
            }
            if (q.children) {
                return {
                    ...q,
                    children: addChildQuestionRecursive(q.children, parentId, newChild),
                };
            }
            return q;
        });
    };

    const moveQuestionRecursive = (
        list: Question[],
        targetId: string,
        direction: 'up' | 'down'
    ): Question[] => {
        // Try to find if the question is in the current level
        const index = list.findIndex((q) => q.id === targetId);

        if (index !== -1) {
            // Found in current level, perform swap
            const newList = [...list];
            if (direction === 'up' && index > 0) {
                [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
            } else if (direction === 'down' && index < list.length - 1) {
                [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
            }
            return newList;
        }

        // Not found, look deeper
        return list.map((q) => {
            if (q.children) {
                return {
                    ...q,
                    children: moveQuestionRecursive(q.children, targetId, direction),
                };
            }
            return q;
        });
    };

    // --- Actions ---

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            type: 'short_text',
            title: '',
            required: false,
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleAddSubQuestion = (parentId: string) => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            type: 'short_text',
            title: '',
            required: false,
        };
        setQuestions(addChildQuestionRecursive(questions, parentId, newQuestion));
    };

    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(updateQuestionRecursive(questions, id, updates));
    };

    const handleDeleteQuestion = (id: string) => {
        setQuestions(deleteQuestionRecursive(questions, id));
    };

    const handleMoveQuestion = (id: string, direction: 'up' | 'down') => {
        setQuestions(moveQuestionRecursive(questions, id, direction));
    };

    // --- Option Helpers (simplified, assuming options only on updated question) ---
    // Note: These need to find the specific question to update its options.
    // For simplicity, we reuse updateQuestionRecursive with full options array replacement.

    const handleUpdateOptions = (q: Question, newOptions: string[]) => {
        handleUpdateQuestion(q.id, { options: newOptions });
    };

    const getIconForType = (type: QuestionType) => {
        switch (type) {
            case 'short_text':
                return <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />;
            case 'long_text':
                return <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />;
            case 'single_choice':
                return <CheckCircleIcon className="h-5 w-5" />;
            case 'multiple_choice':
                return <ListBulletIcon className="h-5 w-5" />;
            case 'rating':
                return <StarIcon className="h-5 w-5" />;
            default:
                return null;
        }
    };

    // --- Recursive Render Component ---

    const QuestionItem = ({
        question,
        depth = 0,
        index,
        siblingsCount,
    }: {
        question: Question;
        depth?: number;
        index: number;
        siblingsCount: number;
    }) => {
        const isLast = index === siblingsCount - 1;

        return (
            <div className="relative flex flex-col">
                <div className="flex gap-4">
                    {/* Visual Hierarchy Line (for children) */}
                    {depth > 0 && (
                        <div className="relative w-12 shrink-0">
                            {/* Vertical Spine (only for non-last items to connect to next sibling) */}
                            {!isLast && (
                                <div className="absolute top-0 bottom-0 left-6 -ml-px w-px border-l-2 border-zinc-300 dark:border-zinc-600"></div>
                            )}

                            {/* Curved Connector (The "L" shape) */}
                            <div className="absolute top-0 left-6 -ml-px h-10 w-6 rounded-bl-2xl border-b-2 border-l-2 border-zinc-300 dark:border-zinc-600"></div>
                        </div>
                    )}

                    <Card className={`mb-4 flex-1 ${depth > 0 ? '' : ''}`}>
                        <div className="flex gap-4">
                            <div className="mt-2 flex flex-col gap-1 text-gray-400">
                                <Bars3Icon className="mb-2 h-6 w-6 cursor-move" />
                                <div className="flex flex-col gap-1">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        isDisabled={index === 0}
                                        onPress={() => handleMoveQuestion(question.id, 'up')}
                                    >
                                        <ChevronUpIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        isDisabled={isLast}
                                        onPress={() => handleMoveQuestion(question.id, 'down')}
                                    >
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col gap-4">
                                <div className="flex gap-4">
                                    <Input
                                        label="Question Title"
                                        value={question.title}
                                        onValueChange={(val) =>
                                            handleUpdateQuestion(question.id, { title: val })
                                        }
                                        variant="bordered"
                                        className="flex-1"
                                    />
                                    <Select
                                        label="Question Type"
                                        selectedKeys={[question.type]}
                                        onSelectionChange={(keys) =>
                                            handleUpdateQuestion(question.id, {
                                                type: Array.from(keys)[0] as QuestionType,
                                            })
                                        }
                                        className="w-48"
                                        variant="bordered"
                                        startContent={getIconForType(question.type)}
                                    >
                                        <SelectItem
                                            key="short_text"
                                            startContent={
                                                <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                                            }
                                        >
                                            Short Text
                                        </SelectItem>
                                        <SelectItem
                                            key="long_text"
                                            startContent={
                                                <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                                            }
                                        >
                                            Long Text
                                        </SelectItem>
                                        <SelectItem
                                            key="single_choice"
                                            startContent={<CheckCircleIcon className="h-4 w-4" />}
                                        >
                                            Single Choice
                                        </SelectItem>
                                        <SelectItem
                                            key="multiple_choice"
                                            startContent={<ListBulletIcon className="h-4 w-4" />}
                                        >
                                            Multiple Choice
                                        </SelectItem>
                                        <SelectItem
                                            key="rating"
                                            startContent={<StarIcon className="h-4 w-4" />}
                                        >
                                            Rating
                                        </SelectItem>
                                    </Select>
                                </div>

                                {/* Options Logic */}
                                {(question.type === 'single_choice' ||
                                    question.type === 'multiple_choice') && (
                                    <div className="space-y-2 pl-2">
                                        {question.options?.map((opt, optIndex) => (
                                            <div key={optIndex} className="flex items-center gap-2">
                                                {question.type === 'single_choice' ? (
                                                    <div className="h-4 w-4 rounded-full border border-zinc-300 dark:border-zinc-600" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded border border-zinc-300 dark:border-zinc-600" />
                                                )}
                                                <Input
                                                    size="sm"
                                                    value={opt}
                                                    onValueChange={(val) => {
                                                        const newOptions = [
                                                            ...(question.options || []),
                                                        ];
                                                        newOptions[optIndex] = val;
                                                        handleUpdateOptions(question, newOptions);
                                                    }}
                                                    variant="flat"
                                                    classNames={{
                                                        inputWrapper:
                                                            'bg-transparent shadow-none hover:bg-gray-50 dark:hover:bg-zinc-700/50',
                                                    }}
                                                />
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    onPress={() => {
                                                        const newOptions =
                                                            question.options?.filter(
                                                                (_, i) => i !== optIndex
                                                            ) || [];
                                                        handleUpdateOptions(question, newOptions);
                                                    }}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            size="sm"
                                            variant="light"
                                            color="primary"
                                            startContent={<PlusIcon className="h-4 w-4" />}
                                            onPress={() => {
                                                const newOptions = [
                                                    ...(question.options || []),
                                                    `Option ${(question.options?.length || 0) + 1}`,
                                                ];
                                                handleUpdateOptions(question, newOptions);
                                            }}
                                            className="ml-6"
                                        >
                                            Add Option
                                        </Button>
                                    </div>
                                )}

                                <Divider className="my-2" />

                                <div className="flex items-center justify-between">
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="secondary"
                                        startContent={<ArrowRightIcon className="h-4 w-4" />}
                                        onPress={() => handleAddSubQuestion(question.id)}
                                    >
                                        Add Sub-question
                                    </Button>

                                    <div className="flex items-center gap-4">
                                        <Switch
                                            size="sm"
                                            isSelected={question.required}
                                            onValueChange={(val) =>
                                                handleUpdateQuestion(question.id, {
                                                    required: val,
                                                })
                                            }
                                        >
                                            <span className="text-sm text-gray-500">Required</span>
                                        </Switch>
                                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            color="danger"
                                            onPress={() => handleDeleteQuestion(question.id)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recursive Children Rendering */}
                {question.children && question.children.length > 0 && (
                    <div className="relative flex flex-col">
                        {/* Parent Vertical Spine Extension (for this group) */}
                        {!isLast && depth > 0 && (
                            <div className="absolute top-0 bottom-0 left-6 -mt-4 w-px border-l-2 border-zinc-300 dark:border-zinc-600"></div>
                        )}

                        {question.children.map((child, idx) => (
                            <QuestionItem
                                key={child.id}
                                question={child}
                                depth={depth + 1}
                                index={idx}
                                siblingsCount={question.children!.length}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-4xl pb-20">
            <Button
                variant="light"
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
                onPress={() => navigate('/apps/surveys')}
                className="mb-4 text-gray-500"
            >
                Back to Surveys
            </Button>

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? 'Edit Survey' : 'Create Survey'}
                </h1>
                <div className="flex gap-2">
                    <Button variant="flat" color="default">
                        Preview
                    </Button>
                    <Button color="primary" onPress={() => navigate('/apps/surveys')}>
                        Save Survey
                    </Button>
                </div>
            </div>

            {/* Survey Header */}
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex flex-col gap-4">
                    <Input
                        variant="underlined"
                        placeholder="Survey Title"
                        value={title}
                        onValueChange={setTitle}
                        classNames={{ input: 'text-2xl font-bold' }}
                    />
                    <Textarea
                        variant="underlined"
                        placeholder="Survey Description"
                        value={description}
                        onValueChange={setDescription}
                    />
                </div>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-4">
                {questions.map((q, index) => (
                    <QuestionItem
                        key={q.id}
                        question={q}
                        index={index}
                        siblingsCount={questions.length}
                    />
                ))}
            </div>

            <Button
                color="primary"
                variant="flat"
                className="border-primary/40 bg-primary/5 mt-6 h-14 w-full border-2 border-dashed"
                startContent={<PlusIcon className="h-6 w-6" />}
                onPress={handleAddQuestion}
            >
                Add Question
            </Button>
        </div>
    );
}
