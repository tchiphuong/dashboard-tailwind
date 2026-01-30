import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ChartBarIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import {
    Button,
    Input,
    Select,
    SelectItem,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Pagination,
} from '@heroui/react';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface Survey {
    id: number;
    title: string;
    description: string;
    status: 'draft' | 'active' | 'closed';
    responses: number;
    createdAt: string;
    updatedAt: string;
}

const MOCK_SURVEYS: Survey[] = [
    {
        id: 1,
        title: 'Customer Satisfaction Survey 2024',
        description: 'Gathering feedback on Q1 product updates.',
        status: 'active',
        responses: 1250,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
    },
    {
        id: 2,
        title: 'Employee Engagement Feedback',
        description: 'Quarterly check-in with the team.',
        status: 'closed',
        responses: 45,
        createdAt: '2023-11-01T09:00:00Z',
        updatedAt: '2023-12-01T17:00:00Z',
    },
    {
        id: 3,
        title: 'Product Beta Testing',
        description: 'Feedback for the new mobile app beta.',
        status: 'draft',
        responses: 0,
        createdAt: '2024-02-10T11:00:00Z',
        updatedAt: '2024-02-10T11:00:00Z',
    },
];

export function SurveyListPage() {
    const navigate = useNavigate();
    const [surveys, setSurveys] = useState<Survey[]>(MOCK_SURVEYS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const rowsPerPage = 10;

    const filteredSurveys = surveys.filter((survey) => {
        const matchesSearch = survey.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredSurveys.length / rowsPerPage);
    const paginatedSurveys = filteredSurveys.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleDelete = () => {
        if (deleteId) {
            setSurveys(surveys.filter((s) => s.id !== deleteId));
            setDeleteId(null);
        }
    };

    const getStatusColor = (status: Survey['status']) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'closed':
                return 'default';
            case 'draft':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <>
            <PageHeader
                title="Surveys"
                breadcrumbs={[{ label: 'Apps' }, { label: 'Surveys' }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => navigate('/apps/surveys/create')}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Create Survey
                    </Button>
                }
            />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <Input
                    isClearable
                    className="w-full sm:max-w-xs"
                    placeholder="Search surveys..."
                    startContent={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                    value={search}
                    onClear={() => setSearch('')}
                    onValueChange={setSearch}
                    variant="bordered"
                    radius="full"
                />
                <Select
                    className="w-full sm:max-w-[150px]"
                    selectedKeys={[statusFilter]}
                    onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                    variant="bordered"
                    radius="full"
                >
                    <SelectItem key="all">All Status</SelectItem>
                    <SelectItem key="active">Active</SelectItem>
                    <SelectItem key="draft">Draft</SelectItem>
                    <SelectItem key="closed">Closed</SelectItem>
                </Select>
            </div>

            <Table
                aria-label="Surveys table"
                isStriped
                classNames={{
                    wrapper:
                        'rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800',
                    th: 'bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-300 font-medium',
                }}
                bottomContent={
                    totalPages > 0 && (
                        <div className="flex items-center justify-center py-4">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={totalPages}
                                onChange={setPage}
                                radius="full"
                            />
                        </div>
                    )
                }
            >
                <TableHeader>
                    <TableColumn>TITLE</TableColumn>
                    <TableColumn width={120}>STATUS</TableColumn>
                    <TableColumn width={120}>RESPONSES</TableColumn>
                    <TableColumn width={150}>LAST UPDATED</TableColumn>
                    <TableColumn width={80} align="end">
                        ACTIONS
                    </TableColumn>
                </TableHeader>
                <TableBody items={paginatedSurveys} emptyContent="No surveys found">
                    {(survey) => (
                        <TableRow
                            key={survey.id}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700/30"
                        >
                            <TableCell>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {survey.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {survey.description}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    className="capitalize"
                                    color={getStatusColor(survey.status)}
                                    size="sm"
                                    variant="flat"
                                >
                                    {survey.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <ChartBarIcon className="h-4 w-4" />
                                    <span>{survey.responses}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(survey.updatedAt).toLocaleDateString()}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => navigate(`/apps/surveys/${survey.id}/edit`)}
                                    >
                                        <PencilSquareIcon className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly size="sm" variant="light">
                                                <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Survey actions">
                                            <DropdownItem
                                                key="results"
                                                startContent={<ChartBarIcon className="h-4 w-4" />}
                                                onPress={() =>
                                                    navigate(`/apps/surveys/${survey.id}/results`)
                                                }
                                            >
                                                View Results
                                            </DropdownItem>
                                            <DropdownItem
                                                key="delete"
                                                className="text-danger"
                                                color="danger"
                                                startContent={<TrashIcon className="h-4 w-4" />}
                                                onPress={() => setDeleteId(survey.id)}
                                            >
                                                Delete
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Survey"
                message="Are you sure you want to delete this survey? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </>
    );
}
