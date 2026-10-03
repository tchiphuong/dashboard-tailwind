import { useState, useEffect, useCallback, useMemo, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Breadcrumb,
    Card,
    Button,
    Table,
    Chip,
    Input,
    ProgressBar,
    Select,
    SelectItem,
    Alert,
    Skeleton,
    Textarea,
    StatCard,
    SearchField,
    Modal,
    DateRangePicker,
    NumberField,
    notifyFetchSuccess,
    notifyFetchError,
    notifyCreateSuccess,
    notifyCreateError,
    type DateRangeValue,
    type SortDescriptor,
} from '@/components/common';
import {
    FolderIcon,
    PlusIcon,
    ArrowPathIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { ProjectService, UserService } from '@/services';
import type { ProjectItem, ProjectStatusOption } from '@/types';
import { formatCurrency } from '@/lib';

function matchesLeader(p: ProjectItem, leader: string) {
    return leader === 'all' || p.leader.toLowerCase() === leader.toLowerCase();
}

function matchesBudget(p: ProjectItem, min: string, max: string) {
    if (min.trim() !== '' && p.budget < Number(min)) return false;
    if (max.trim() !== '' && p.budget > Number(max)) return false;
    return true;
}

function matchesProgress(progress: number, range: string) {
    switch (range) {
        case '0':
            return progress === 0;
        case '1-49':
            return progress >= 1 && progress < 50;
        case '50-99':
            return progress >= 50 && progress < 100;
        case '100':
            return progress === 100;
        default:
            return true;
    }
}

function matchesDateRange(p: ProjectItem, range: DateRangeValue | null) {
    if (!range) return true;
    if (range.start && p.startDate && p.startDate < range.start.toString()) return false;
    if (range.end && p.endDate && p.endDate > range.end.toString()) return false;
    return true;
}

export function ProjectsList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [statusOptions, setStatusOptions] = useState<ProjectStatusOption[]>([]);
    const [isLoadingStatuses, setIsLoadingStatuses] = useState<boolean>(false);
    const [selectedLeader, setSelectedLeader] = useState<string>('all');
    const [leaderOptions, setLeaderOptions] = useState<{ id: string; name: string }[]>([]);
    const [isLoadingLeaders, setIsLoadingLeaders] = useState<boolean>(false);

    // Load danh mục trạng thái và nhân sự phụ trách từ API Gateway
    useEffect(() => {
        const loadFilterMetadata = async () => {
            setIsLoadingStatuses(true);
            setIsLoadingLeaders(true);
            try {
                const [statusRes, userRes] = await Promise.all([
                    ProjectService.getStatuses(),
                    UserService.list({ pageIndex: 1, pageSize: 50 }),
                ]);

                if (statusRes.data && Array.isArray(statusRes.data)) {
                    setStatusOptions(statusRes.data);
                }

                const users =
                    userRes.data?.items || (Array.isArray(userRes.data) ? userRes.data : []);
                if (users.length > 0) {
                    const mapped = users.map((u) => ({
                        id: String(u.id),
                        name:
                            u.displayName ||
                            `${u.firstName || ''} ${u.lastName || ''}`.trim() ||
                            u.username,
                    }));
                    setLeaderOptions(mapped);
                }
            } catch {
                setStatusOptions([
                    { id: 'all', label: 'Tất cả trạng thái' },
                    { id: 'in_progress', label: 'Đang triển khai' },
                    { id: 'completed', label: 'Đã hoàn thành' },
                    { id: 'planning', label: 'Lập kế hoạch' },
                    { id: 'on_hold', label: 'Tạm dừng' },
                ]);
            } finally {
                setIsLoadingStatuses(false);
                setIsLoadingLeaders(false);
            }
        };
        loadFilterMetadata();
    }, []);

    // Quản lý sắp xếp chuẩn HeroUI v3 Compound như Dashboard Analytics
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'name',
        direction: 'ascending',
    });

    // Quản lý trạng thái phân trang chuẩn
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await ProjectService.getProjects({
                pageIndex: page,
                pageSize,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                search: searchTerm.trim() || undefined,
            });
            if (res.data?.items) {
                setProjects(res.data.items);
                const count = res.data.paging ? res.data.paging.totalItems : res.data.items.length;
                if (res.data.paging) {
                    setTotalItems(res.data.paging.totalItems);
                    setTotalPages(Math.max(1, res.data.paging.totalPages));
                } else {
                    setTotalItems(res.data.items.length);
                    setTotalPages(Math.max(1, Math.ceil(res.data.items.length / pageSize)));
                }
                notifyFetchSuccess('dự án', count);
            } else if (Array.isArray(res.data)) {
                setProjects(res.data);
                setTotalItems(res.data.length);
                setTotalPages(Math.max(1, Math.ceil(res.data.length / pageSize)));
                notifyFetchSuccess('dự án', res.data.length);
            }
        } catch {
            setProjects([]);
            setTotalItems(0);
            setTotalPages(1);
            notifyFetchError('dự án');
        } finally {
            setIsLoading(false);
        }
    }, [page, pageSize, selectedStatus, searchTerm]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Reset về trang 1 khi người dùng thay đổi bộ lọc tìm kiếm
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    };

    const handleStatusChange = (key: unknown) => {
        if (!key) return;
        if (typeof key === 'string' || typeof key === 'number') {
            setSelectedStatus(String(key));
            setPage(1);
        } else if (typeof key === 'object' && Symbol.iterator in (key as object)) {
            const first = Array.from(key as Iterable<unknown>)[0];
            if (typeof first === 'string' || typeof first === 'number') {
                setSelectedStatus(String(first));
                setPage(1);
            }
        }
    };

    const handleLeaderChange = (key: unknown) => {
        if (!key) return;
        if (typeof key === 'string' || typeof key === 'number') {
            setSelectedLeader(String(key));
            setPage(1);
        } else if (typeof key === 'object' && Symbol.iterator in (key as object)) {
            const first = Array.from(key as Iterable<unknown>)[0];
            if (typeof first === 'string' || typeof first === 'number') {
                setSelectedLeader(String(first));
                setPage(1);
            }
        }
    };

    // Trạng thái tìm kiếm nâng cao (Advanced Search Modal)
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [budgetMin, setBudgetMin] = useState<string>('');
    const [budgetMax, setBudgetMax] = useState<string>('');
    const [progressRange, setProgressRange] = useState<string>('all');
    const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

    // Đếm số lượng tiêu chí nâng cao đang được áp dụng
    const activeAdvancedCount = useMemo(() => {
        let count = 0;
        if (budgetMin.trim() !== '' || budgetMax.trim() !== '') count += 1;
        if (progressRange !== 'all') count += 1;
        if (dateRange !== null) count += 1;
        return count;
    }, [budgetMin, budgetMax, progressRange, dateRange]);

    const handleClearAdvancedFilters = () => {
        setBudgetMin('');
        setBudgetMax('');
        setProgressRange('all');
        setDateRange(null);
        setPage(1);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedLeader('all');
        handleClearAdvancedFilters();
    };

    const isFiltered = Boolean(
        searchTerm.trim() !== '' ||
        selectedStatus !== 'all' ||
        selectedLeader !== 'all' ||
        activeAdvancedCount > 0
    );

    // Lọc dữ liệu đa chiều theo toàn bộ tiêu chí cơ bản và nâng cao
    const filteredProjects = useMemo(() => {
        return projects.filter(
            (p) =>
                matchesLeader(p, selectedLeader) &&
                matchesBudget(p, budgetMin, budgetMax) &&
                matchesProgress(p.progress, progressRange) &&
                matchesDateRange(p, dateRange)
        );
    }, [projects, selectedLeader, budgetMin, budgetMax, progressRange, dateRange]);

    // Sắp xếp dữ liệu theo sortDescriptor chuẩn HeroUI v3 như bên Dashboard Analytics
    const sortedProjects = useMemo(() => {
        if (!sortDescriptor.column) return filteredProjects;
        return [...filteredProjects].sort((a, b) => {
            let first: string | number = '';
            let second: string | number = '';
            switch (sortDescriptor.column) {
                case 'name':
                    first = a.name;
                    second = b.name;
                    break;
                case 'leader':
                    first = a.leader;
                    second = b.leader;
                    break;
                case 'budget':
                    first = a.budget;
                    second = b.budget;
                    break;
                case 'progress':
                    first = a.progress;
                    second = b.progress;
                    break;
                case 'dueDate':
                    first = a.endDate || a.startDate || '';
                    second = b.endDate || b.startDate || '';
                    break;
                default:
                    return 0;
            }

            let cmp = 0;
            if (typeof first === 'number' && typeof second === 'number') {
                cmp = first - second;
            } else {
                cmp = String(first).localeCompare(String(second), 'vi');
            }

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [filteredProjects, sortDescriptor]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return { color: 'success' as const, label: 'Hoàn thành' };
            case 'in_progress':
                return { color: 'accent' as const, label: 'Đang chạy' };
            case 'planning':
                return { color: 'warning' as const, label: 'Kế hoạch' };
            case 'on_hold':
                return { color: 'danger' as const, label: 'Tạm dừng' };
            default:
                return { color: 'default' as const, label: status };
        }
    };

    return (
        <div className="space-y-6">
            {/* Thanh điều hướng ngắn gọn kết hợp các nút hành động, không cần header to cồng kềnh */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb items={[{ label: 'Quản lý dự án' }, { label: 'Danh sách' }]} />
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={fetchProjects}
                        isDisabled={isLoading}
                        className="inline-flex items-center gap-1.5"
                    >
                        <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Làm mới dữ liệu</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/projects/new')}
                        className="inline-flex items-center gap-1.5"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Tạo dự án mới</span>
                    </Button>
                </div>
            </div>

            {/* Thống kê nhanh Tầng 2 chuẩn Dashboard: Primary -> Secondary -> Tertiary (Thirdary) -> Quaternary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Tổng số dự án"
                    value={totalItems || projects.length}
                    variant="primary"
                    isLoading={isLoading && projects.length === 0}
                />
                <StatCard
                    label="Đang triển khai"
                    value={projects.filter((p) => p.status === 'in_progress').length}
                    variant="secondary"
                    isLoading={isLoading && projects.length === 0}
                />
                <StatCard
                    label="Đã hoàn thành"
                    value={projects.filter((p) => p.status === 'completed').length}
                    variant="tertiary"
                    isLoading={isLoading && projects.length === 0}
                />
                <StatCard
                    label="Tổng ngân sách"
                    value={formatCurrency(projects.reduce((acc, p) => acc + (p.budget || 0), 0))}
                    variant="quaternary"
                    isLoading={isLoading && projects.length === 0}
                />
            </div>

            {/* Tầng 3: Bộ lọc và tìm kiếm dữ liệu chuẩn chỉ, đầy đủ các chiều thông tin */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Bên trái: SearchField chuẩn HeroUI v3 Compound Component */}
                    <div className="w-full lg:w-80">
                        <SearchField
                            value={searchTerm}
                            onChange={handleSearchChange}
                            aria-label="Tìm kiếm theo tên hoặc mã dự án"
                            variant="secondary"
                            className="w-full"
                        >
                            <SearchField.Group className="w-full">
                                <SearchField.SearchIcon />
                                <SearchField.Input
                                    placeholder="Tìm theo tên dự án, mã dự án..."
                                    className="w-full text-sm"
                                />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                    </div>

                    {/* Bên phải: Cụm dropdown lọc trạng thái, trưởng dự án, nút đặt lại & đếm kết quả */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Lọc Trạng thái */}
                        <div className="flex items-center gap-2">
                            <span className="text-muted shrink-0 text-xs font-medium">
                                Trạng thái:
                            </span>
                            <div className="w-44">
                                <Select
                                    variant="secondary"
                                    placeholder={
                                        isLoadingStatuses ? 'Đang tải...' : 'Chọn trạng thái'
                                    }
                                    selectedKey={selectedStatus}
                                    onSelectionChange={handleStatusChange}
                                >
                                    {statusOptions.map((opt) => (
                                        <SelectItem key={opt.id} id={opt.id} textValue={opt.label}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Lọc Trưởng dự án */}
                        <div className="flex items-center gap-2">
                            <span className="text-muted shrink-0 text-xs font-medium">
                                Phụ trách:
                            </span>
                            <div className="w-48">
                                <Select
                                    variant="secondary"
                                    placeholder={isLoadingLeaders ? 'Đang tải...' : 'Chọn nhân sự'}
                                    selectedKey={selectedLeader}
                                    isDisabled={isLoadingLeaders}
                                    onSelectionChange={handleLeaderChange}
                                >
                                    <SelectItem id="all" textValue="Tất cả trưởng dự án">
                                        Tất cả trưởng dự án
                                    </SelectItem>
                                    {leaderOptions.map((u) => (
                                        <SelectItem key={u.id} id={u.name} textValue={u.name}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Nút mở Modal tìm kiếm nâng cao */}
                        <Button
                            variant={activeAdvancedCount > 0 ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setIsAdvancedOpen(true)}
                            className="inline-flex items-center gap-1.5"
                        >
                            <AdjustmentsHorizontalIcon className="h-4 w-4" />
                            <span>Bộ lọc nâng cao</span>
                            {activeAdvancedCount > 0 && (
                                <Chip size="sm" variant="soft" color="accent">
                                    {activeAdvancedCount}
                                </Chip>
                            )}
                        </Button>

                        {/* Nút đặt lại bộ lọc */}
                        {isFiltered && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleResetFilters}
                                className="inline-flex items-center gap-1.5"
                            >
                                <ArrowPathIcon className="h-3.5 w-3.5" />
                                <span>Đặt lại</span>
                            </Button>
                        )}

                    </div>
                </div>
            </Card>

            {/* Modal Tìm kiếm & Lọc dự án nâng cao chuẩn HeroUI v3 */}
            <Modal
                isOpen={isAdvancedOpen}
                onClose={() => setIsAdvancedOpen(false)}
                title="Bộ lọc dự án nâng cao"
                size="lg"
                footer={
                    <div className="flex w-full items-center justify-between">
                        {activeAdvancedCount > 0 ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearAdvancedFilters}
                            >
                                Xóa bộ lọc ({activeAdvancedCount})
                            </Button>
                        ) : (
                            <div />
                        )}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="danger-soft"
                                size="sm"
                                onClick={() => setIsAdvancedOpen(false)}
                            >
                                Đóng
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsAdvancedOpen(false)}
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-4 py-2">
                    {/* 1. Khoảng thời gian thực hiện bằng DateRangePicker chuẩn HeroUI v3 */}
                    <DateRangePicker
                        label="Khoảng thời gian thực hiện (Từ ngày - Đến ngày)"
                        variant="secondary"
                        value={dateRange}
                        onChange={(val) => {
                            setDateRange(val);
                            setPage(1);
                        }}
                    />

                    {/* 2. Khoảng ngân sách bằng NumberField chuẩn HeroUI v3 */}
                    <NumberField
                        label="Ngân sách tối thiểu (VNĐ)"
                        variant="secondary"
                        minValue={0}
                        step={10000000}
                        formatOptions={{ style: 'currency', currency: 'VND' }}
                        placeholder="Ví dụ: 50.000.000 ₫"
                        value={budgetMin ? Number(budgetMin) : undefined}
                        onChange={(val) => {
                            setBudgetMin(
                                val !== undefined && !Number.isNaN(val) ? String(val) : ''
                            );
                            setPage(1);
                        }}
                    />
                    <NumberField
                        label="Ngân sách tối đa (VNĐ)"
                        variant="secondary"
                        minValue={0}
                        step={10000000}
                        formatOptions={{ style: 'currency', currency: 'VND' }}
                        placeholder="Ví dụ: 500.000.000 ₫"
                        value={budgetMax ? Number(budgetMax) : undefined}
                        onChange={(val) => {
                            setBudgetMax(
                                val !== undefined && !Number.isNaN(val) ? String(val) : ''
                            );
                            setPage(1);
                        }}
                    />

                    {/* 3. Tiến độ thực hiện */}
                    <Select
                        label="Tiến độ thực hiện"
                        variant="secondary"
                        selectedKey={progressRange}
                        onSelectionChange={(key) => {
                            if (key) {
                                const val =
                                    typeof key === 'object' && Symbol.iterator in (key as object)
                                        ? Array.from(key as Iterable<unknown>)[0]
                                        : key;
                                if (typeof val === 'string' || typeof val === 'number') {
                                    setProgressRange(String(val));
                                    setPage(1);
                                }
                            }
                        }}
                    >
                        <SelectItem id="all" textValue="Tất cả tiến độ">
                            Tất cả tiến độ
                        </SelectItem>
                        <SelectItem id="0" textValue="Chưa bắt đầu (0%)">
                            Chưa bắt đầu (0%)
                        </SelectItem>
                        <SelectItem id="1-49" textValue="Đang khởi động (1% - 49%)">
                            Đang khởi động (1% - 49%)
                        </SelectItem>
                        <SelectItem id="50-99" textValue="Sắp hoàn thành (50% - 99%)">
                            Sắp hoàn thành (50% - 99%)
                        </SelectItem>
                        <SelectItem id="100" textValue="Đã hoàn thành (100%)">
                            Đã hoàn thành (100%)
                        </SelectItem>
                    </Select>
                </div>
            </Modal>

            {/* Bảng danh sách dự án chuẩn HeroUI v3 nguyên bản */}
            <Card className="overflow-hidden p-0">
                <Table aria-label="Bảng quản lý dự án">
                    <Table.ScrollContainer>
                        <Table.Content
                            aria-label="Danh sách dữ liệu dự án"
                            sortDescriptor={sortDescriptor}
                            onSortChange={setSortDescriptor}
                        >
                            <Table.Header>
                                <Table.Column
                                    id="name"
                                    isRowHeader
                                    allowsSorting
                                    className="text-left"
                                >
                                    {({ sortDirection }) => (
                                        <Table.SortableColumnHeader sortDirection={sortDirection}>
                                            Dự án & mã số
                                        </Table.SortableColumnHeader>
                                    )}
                                </Table.Column>
                                <Table.Column id="leader" allowsSorting className="text-left">
                                    {({ sortDirection }) => (
                                        <Table.SortableColumnHeader sortDirection={sortDirection}>
                                            Trưởng dự án
                                        </Table.SortableColumnHeader>
                                    )}
                                </Table.Column>
                                <Table.Column id="budget" allowsSorting className="text-right">
                                    {({ sortDirection }) => (
                                        <Table.SortableColumnHeader sortDirection={sortDirection}>
                                            Ngân sách
                                        </Table.SortableColumnHeader>
                                    )}
                                </Table.Column>
                                <Table.Column id="progress" allowsSorting className="text-right">
                                    {({ sortDirection }) => (
                                        <Table.SortableColumnHeader sortDirection={sortDirection}>
                                            Tiến độ thực hiện
                                        </Table.SortableColumnHeader>
                                    )}
                                </Table.Column>
                                <Table.Column id="dueDate" allowsSorting className="text-center">
                                    {({ sortDirection }) => (
                                        <Table.SortableColumnHeader sortDirection={sortDirection}>
                                            Thời hạn
                                        </Table.SortableColumnHeader>
                                    )}
                                </Table.Column>
                                <Table.Column id="status" className="text-center">
                                    Trạng thái
                                </Table.Column>
                            </Table.Header>
                            <Table.Body
                                className={`transition-opacity duration-200 ${isLoading && projects.length > 0 ? 'opacity-60' : 'opacity-100'}`}
                                renderEmptyState={() => (
                                    <Table.EmptyState
                                        icon={FolderIcon}
                                        title="Không tìm thấy dự án nào"
                                        description="Thử điều chỉnh lại từ khóa tìm kiếm hoặc bộ lọc trạng thái xem sao nha anh."
                                    />
                                )}
                            >
                                {isLoading && projects.length === 0
                                    ? Array.from({ length: 5 }).map((_, index) => (
                                          <Table.Row
                                              key={`proj-skel-${index}`}
                                              id={`proj-skel-${index}`}
                                          >
                                              <Table.Cell className="text-left">
                                                  <div className="flex items-center gap-2.5">
                                                      <Skeleton className="h-8 w-8 rounded" />
                                                      <div className="space-y-1">
                                                          <Skeleton className="h-4 w-44" />
                                                          <Skeleton className="h-3 w-20" />
                                                      </div>
                                                  </div>
                                              </Table.Cell>
                                              <Table.Cell className="text-left">
                                                  <Skeleton className="h-4 w-28" />
                                              </Table.Cell>
                                              <Table.Cell className="text-right">
                                                  <Skeleton className="ml-auto h-4 w-24" />
                                              </Table.Cell>
                                              <Table.Cell className="text-right">
                                                  <Skeleton className="ml-auto h-4 w-32" />
                                              </Table.Cell>
                                              <Table.Cell className="text-center">
                                                  <Skeleton className="mx-auto h-4 w-24" />
                                              </Table.Cell>
                                              <Table.Cell className="text-center">
                                                  <Skeleton className="mx-auto h-6 w-16" />
                                              </Table.Cell>
                                          </Table.Row>
                                      ))
                                    : sortedProjects.map((p) => {
                                          const badge = getStatusBadge(p.status);
                                          return (
                                              <Table.Row
                                                  key={String(p.id)}
                                                  id={String(p.id)}
                                                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                              >
                                                  <Table.Cell className="text-left">
                                                      <div className="flex max-w-sm items-start gap-2.5">
                                                          <span className="bg-accent/15 text-accent mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                                                              <FolderIcon className="h-4 w-4" />
                                                          </span>
                                                          <div>
                                                              <p className="text-foreground text-xs font-semibold">
                                                                  {p.name}
                                                              </p>
                                                              <p className="text-muted font-mono text-[0.625rem]">
                                                                  {p.code}
                                                              </p>
                                                          </div>
                                                      </div>
                                                  </Table.Cell>
                                                  <Table.Cell className="text-left">
                                                      <span className="text-foreground/90 text-xs font-medium">
                                                          {p.leader}
                                                      </span>
                                                  </Table.Cell>
                                                  <Table.Cell className="text-right">
                                                      <span className="text-foreground font-mono text-xs font-semibold tabular-nums">
                                                          {formatCurrency(p.budget)}
                                                      </span>
                                                  </Table.Cell>
                                                  <Table.Cell className="text-right">
                                                      <div className="ml-auto w-32 space-y-1">
                                                          <div className="flex justify-between text-[0.6875rem] font-semibold tabular-nums">
                                                              <span className="text-muted">
                                                                  Tiến độ
                                                              </span>
                                                              <span className="text-foreground">
                                                                  {p.progress}%
                                                              </span>
                                                          </div>
                                                          <ProgressBar
                                                              value={p.progress}
                                                              color={
                                                                  p.progress === 100
                                                                      ? 'success'
                                                                      : 'accent'
                                                              }
                                                              size="sm"
                                                          />
                                                      </div>
                                                  </Table.Cell>
                                                  <Table.Cell className="text-center">
                                                      <div className="text-muted font-mono text-xs tabular-nums">
                                                          <p>{p.startDate}</p>
                                                          <p>{p.endDate}</p>
                                                      </div>
                                                  </Table.Cell>
                                                  <Table.Cell className="text-center">
                                                      <Chip
                                                          color={badge.color}
                                                          variant="soft"
                                                          size="sm"
                                                      >
                                                          {badge.label}
                                                      </Chip>
                                                  </Table.Cell>
                                              </Table.Row>
                                          );
                                      })}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>

                    {/* Table.Footer phân trang chuẩn Tầng 5 dùng component Table.PaginationFooter từ common */}
                    <Table.PaginationFooter
                        page={page}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onPageSizeChange={(newSize) => {
                            setPageSize(newSize);
                            setPage(1);
                        }}
                        itemName="dự án"
                    />
                </Table>
            </Card>
        </div>
    );
}

export function ProjectsCreate() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [leader, setLeader] = useState('');
    const [leaders, setLeaders] = useState<{ id: string | number; name: string; role?: string }[]>(
        []
    );
    const [isLoadingLeaders, setIsLoadingLeaders] = useState(false);
    const [budget, setBudget] = useState('200000000');
    const [startDate, setStartDate] = useState('2026-10-01');
    const [endDate, setEndDate] = useState('2026-12-31');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Load danh sách nhân sự phụ trách (Project Leads) động từ API UserService
    useEffect(() => {
        const loadLeaders = async () => {
            setIsLoadingLeaders(true);
            try {
                const res = await UserService.list({ pageIndex: 1, pageSize: 50 });
                const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
                if (items.length > 0) {
                    const mapped = items.map((u) => ({
                        id: u.id,
                        name:
                            u.displayName ||
                            `${u.firstName || ''} ${u.lastName || ''}`.trim() ||
                            u.username,
                        role: u.role || 'Thành viên',
                    }));
                    setLeaders(mapped);
                    if (mapped[0]) {
                        setLeader(mapped[0].name);
                    }
                }
            } catch {
                setLeaders([]);
            } finally {
                setIsLoadingLeaders(false);
            }
        };
        loadLeaders();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            await ProjectService.createProject({
                name,
                code,
                leader,
                budget: Number(budget),
                progress: 0,
                startDate,
                endDate,
                status: 'planning',
                description,
            });
            setIsSuccess(true);
            notifyCreateSuccess('dự án', name);
            setName('');
            setCode('');
            setDescription('');
            setTimeout(() => setIsSuccess(false), 5000);
        } catch {
            setErrorMessage('Không thể khởi tạo dự án. Vui lòng kiểm tra lại thông tin.');
            notifyCreateError('dự án', 'Không thể khởi tạo dự án. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Quản lý dự án' },
                    { label: 'Danh sách', href: '/projects' },
                    { label: 'Tạo mới' },
                ]}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-bold tracking-tight">
                        Khởi tạo Dự án Mới
                    </h1>
                    <p className="text-muted text-sm">
                        Khai báo thông tin tổng thể, ngân sách và phân công nhân sự phụ trách qua
                        ProjectService.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/projects')}
                    className="self-start sm:self-auto"
                >
                    Quay lại danh sách
                </Button>
            </div>

            {isSuccess && (
                <Alert status="accent">
                    <span>
                        Dự án mới đã được khởi tạo và lưu trữ thành công vào hệ thống quản lý!
                    </span>
                </Alert>
            )}

            {errorMessage && (
                <Alert status="danger">
                    <span>{errorMessage}</span>
                </Alert>
            )}

            <Card className="max-w-3xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            id="project-name"
                            label="Tên dự án:"
                            placeholder="Ví dụ: Triển khai Cổng dữ liệu tập trung 2026"
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Input
                                id="project-code"
                                label="Mã dự án:"
                                placeholder="PRJ-2026-05"
                                value={code}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setCode(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <div className="w-full">
                                <Select
                                    id="project-leader"
                                    label="Người phụ trách chính (Project Lead):"
                                    placeholder={
                                        isLoadingLeaders
                                            ? 'Đang tải nhân sự...'
                                            : 'Chọn trưởng dự án'
                                    }
                                    selectedKey={leader}
                                    isDisabled={isLoadingLeaders}
                                    onSelectionChange={(key) => {
                                        if (key) {
                                            const val =
                                                typeof key === 'object' &&
                                                Symbol.iterator in (key as object)
                                                    ? Array.from(key as Iterable<unknown>)[0]
                                                    : key;
                                            if (
                                                typeof val === 'string' ||
                                                typeof val === 'number'
                                            ) {
                                                setLeader(String(val));
                                            }
                                        }
                                    }}
                                >
                                    {leaders.map((u) => (
                                        <SelectItem
                                            key={String(u.id)}
                                            id={u.name}
                                            textValue={`${u.name} (${u.role || 'Thành viên'})`}
                                        >
                                            {u.name} ({u.role || 'Thành viên'})
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <NumberField
                                id="project-budget"
                                label="Ngân sách dự kiến (VND):"
                                minValue={0}
                                step={10000000}
                                formatOptions={{ style: 'currency', currency: 'VND' }}
                                value={budget ? Number(budget) : undefined}
                                onChange={(val) => {
                                    setBudget(
                                        val !== undefined && !Number.isNaN(val) ? String(val) : ''
                                    );
                                }}
                                isRequired
                            />
                        </div>
                        <div>
                            <Input
                                id="project-start-date"
                                label="Ngày bắt đầu:"
                                type="date"
                                value={startDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setStartDate(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <Input
                                id="project-end-date"
                                label="Ngày kết thúc dự kiến:"
                                type="date"
                                value={endDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setEndDate(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Textarea
                            label="Mục tiêu & Mô tả dự án:"
                            rows={4}
                            placeholder="Mô tả phạm vi và các chỉ tiêu KPI của dự án..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <Button variant="secondary" type="button" onClick={() => setName('')}>
                            Làm lại
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            isDisabled={isSubmitting}
                            className="flex items-center gap-1.5"
                        >
                            <PlusIcon className="h-4 w-4" />
                            <span>{isSubmitting ? 'Đang tạo...' : 'Tạo dự án mới'}</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
