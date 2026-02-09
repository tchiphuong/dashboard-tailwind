import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Avatar, SelectItem, Form, Progress, Card, CardBody } from '@heroui/react';
import {
    PlusIcon,
    UserGroupIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import {
    Select,
    PageHeader,
    Modal as CommonModal,
    ConfirmModal,
    Table,
    Input,
    TableColumn,
    TableAction,
    useTableData,
    FetchParams,
    PagedResult,
} from '@/components/common';

// ==================== TYPES ====================

interface Employee {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    avatar: string;
    status: 'active' | 'inactive' | 'onleave';
    hireDate: string;
    salary: number;
    managerId: number | null;
}

interface AttendanceRecord {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'present' | 'absent' | 'late' | 'halfday';
    workHours: number;
}

interface PayrollRecord {
    id: number;
    employeeId: number;
    employeeName: string;
    department: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    month: string;
    status: 'pending' | 'processed' | 'paid';
}

interface AdvanceRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    amount: number;
    reason: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface LeaveRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    leaveType: 'annual' | 'sick' | 'personal' | 'maternity';
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface JobPosting {
    id: number;
    title: string;
    department: string;
    location: string;
    type: 'fulltime' | 'parttime' | 'contract';
    salary: string;
    status: 'open' | 'closed' | 'draft';
    applicants: number;
    postedDate: string;
}

interface Candidate {
    id: number;
    name: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
    appliedDate: string;
    resume: string;
}

interface Course {
    id: number;
    title: string;
    category: string;
    instructor: string;
    duration: string;
    enrolled: number;
    status: 'active' | 'upcoming' | 'completed';
    startDate: string;
}

interface MyLearning {
    id: number;
    courseId: number;
    courseName: string;
    progress: number;
    status: 'inprogress' | 'completed' | 'notstarted';
    startedDate: string;
    completedDate: string | null;
}

// ==================== MOCK DATA ====================

const mockEmployees: Employee[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    employeeCode: `EMP${String(i + 1).padStart(4, '0')}`,
    firstName: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'][i % 8],
    lastName: ['Văn A', 'Thị B', 'Minh C', 'Hồng D', 'Quốc E', 'Anh F', 'Tuấn G', 'Mai H'][i % 8],
    email: `employee${i + 1}@company.com`,
    phone: `0${900000000 + i}`,
    department: ['IT', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations'][i % 6],
    position: ['Developer', 'Manager', 'Analyst', 'Designer', 'Executive', 'Specialist'][i % 6],
    avatar: `https://i.pravatar.cc/150?u=emp${i + 1}`,
    status: ['active', 'active', 'active', 'inactive', 'onleave'][i % 5] as Employee['status'],
    hireDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString().split('T')[0],
    salary: 15000000 + i * 500000,
    managerId: i > 5 ? Math.floor(i / 5) : null,
}));

const mockAttendance: AttendanceRecord[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    employeeId: (i % 10) + 1,
    employeeName: mockEmployees[i % 10].firstName + ' ' + mockEmployees[i % 10].lastName,
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    checkIn: `0${8 + (i % 2)}:${String((i * 7) % 60).padStart(2, '0')}`,
    checkOut: `1${7 + (i % 2)}:${String((i * 11) % 60).padStart(2, '0')}`,
    status: ['present', 'present', 'late', 'present', 'absent'][
        i % 5
    ] as AttendanceRecord['status'],
    workHours: 8 - (i % 3),
}));

const mockPayroll: PayrollRecord[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    employeeId: i + 1,
    employeeName: mockEmployees[i].firstName + ' ' + mockEmployees[i].lastName,
    department: mockEmployees[i].department,
    baseSalary: mockEmployees[i].salary,
    allowances: 2000000 + i * 100000,
    deductions: 1500000 + i * 50000,
    netSalary: mockEmployees[i].salary + 2000000 - 1500000 + i * 50000,
    month: '01/2024',
    status: ['pending', 'processed', 'paid'][i % 3] as PayrollRecord['status'],
}));

const mockAdvances: AdvanceRequest[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    employeeId: (i % 10) + 1,
    employeeName: mockEmployees[i % 10].firstName + ' ' + mockEmployees[i % 10].lastName,
    amount: (i + 1) * 1000000,
    reason: [
        'Khẩn cấp gia đình',
        'Chi phí y tế',
        'Chi phí giáo dục',
        'Sửa chữa nhà',
        'Chi phí cá nhân',
    ][i % 5],
    requestDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    status: ['pending', 'approved', 'rejected'][i % 3] as AdvanceRequest['status'],
}));

const mockLeaveRequests: LeaveRequest[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    employeeId: (i % 10) + 1,
    employeeName: mockEmployees[i % 10].firstName + ' ' + mockEmployees[i % 10].lastName,
    leaveType: ['annual', 'sick', 'personal', 'maternity'][i % 4] as LeaveRequest['leaveType'],
    startDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    endDate: new Date(2024, 0, i + 3).toISOString().split('T')[0],
    days: (i % 5) + 1,
    reason: ['Nghỉ phép năm', 'Khám bệnh', 'Việc gia đình', 'Thai sản'][i % 4],
    status: ['pending', 'approved', 'rejected'][i % 3] as LeaveRequest['status'],
}));

const mockJobPostings: JobPosting[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: [
        'Senior Developer',
        'HR Manager',
        'Sales Executive',
        'Marketing Specialist',
        'Finance Analyst',
    ][i % 5],
    department: ['IT', 'HR', 'Sales', 'Marketing', 'Finance'][i % 5],
    location: ['Hà Nội', 'TP.HCM', 'Đà Nẵng'][i % 3],
    type: ['fulltime', 'parttime', 'contract'][i % 3] as JobPosting['type'],
    salary: ['20-30 triệu', '15-25 triệu', '10-15 triệu'][i % 3],
    status: ['open', 'closed', 'draft'][i % 3] as JobPosting['status'],
    applicants: (i + 1) * 5,
    postedDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
}));

const mockCandidates: Candidate[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Ứng viên ${i + 1}`,
    email: `candidate${i + 1}@email.com`,
    phone: `0${900000000 + i}`,
    position: mockJobPostings[i % 5].title,
    experience: `${(i % 10) + 1} năm`,
    status: ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'][
        i % 6
    ] as Candidate['status'],
    appliedDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    resume: `resume_${i + 1}.pdf`,
}));

const mockCourses: Course[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: [
        'React Advanced',
        'Leadership',
        'Excel Mastery',
        'Communication',
        'Project Management',
        'Sales Techniques',
    ][i % 6],
    category: ['Technical', 'Soft Skills', 'Tools', 'Management'][i % 4],
    instructor: `Giảng viên ${i + 1}`,
    duration: `${(i % 5) + 1} tuần`,
    enrolled: (i + 1) * 10,
    status: ['active', 'upcoming', 'completed'][i % 3] as Course['status'],
    startDate: new Date(2024, i % 12, 1).toISOString().split('T')[0],
}));

const mockMyLearning: MyLearning[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    courseId: i + 1,
    courseName: mockCourses[i].title,
    progress: (i + 1) * 12,
    status: ['inprogress', 'completed', 'notstarted'][i % 3] as MyLearning['status'],
    startedDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    completedDate: i % 3 === 1 ? new Date(2024, 1, i + 1).toISOString().split('T')[0] : null,
}));

// ==================== FETCH FUNCTIONS ====================

const createFetchFn =
    <T,>(data: T[]) =>
    async (params: FetchParams): Promise<PagedResult<T>> => {
        await new Promise((r) => setTimeout(r, 300));
        let filtered = [...data];
        if (params.search) {
            const search = params.search.toLowerCase();
            filtered = filtered.filter((item) =>
                JSON.stringify(item).toLowerCase().includes(search)
            );
        }
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        return {
            items,
            paging: {
                pageIndex: params.page,
                pageSize: params.pageSize,
                totalItems: filtered.length,
                totalPages: Math.ceil(filtered.length / params.pageSize),
            },
        };
    };

// ==================== EMPLOYEES PAGE ====================

export function EmployeesPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        sortDescriptor,
        setPage,
        setPageSize,
        setSearch,
        setSortDescriptor,
        refresh,
    } = useTableData<Employee>({ fetchFn: createFetchFn(mockEmployees), initialPageSize: 10 });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Employee | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'danger';
            case 'onleave':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<Employee>[] = useMemo(
        () => [
            { key: 'employeeCode', label: 'Mã NV', width: 100 },
            {
                key: 'name',
                label: 'Nhân viên',
                render: (emp) => (
                    <div className="flex items-center gap-3">
                        <Avatar src={emp.avatar} size="sm" />
                        <div>
                            <p className="font-medium">
                                {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                    </div>
                ),
            },
            { key: 'department', label: 'Phòng ban' },
            { key: 'position', label: 'Vị trí' },
            { key: 'phone', label: 'Điện thoại' },
            {
                key: 'status',
                label: 'Trạng thái',
                width: 120,
                render: (emp) => (
                    <Chip size="sm" color={getStatusColor(emp.status)} variant="flat">
                        {emp.status === 'active'
                            ? 'Đang làm'
                            : emp.status === 'inactive'
                              ? 'Nghỉ việc'
                              : 'Nghỉ phép'}
                    </Chip>
                ),
            },
            { key: 'hireDate', label: 'Ngày vào' },
        ],
        []
    );

    const actions: TableAction<Employee>[] = useMemo(
        () => [
            {
                key: 'edit',
                label: t('common.edit'),
                onClick: (item) => {
                    setSelectedItem(item);
                    setModalMode('edit');
                    setIsModalOpen(true);
                },
            },
            {
                key: 'delete',
                label: t('common.delete'),
                onClick: (item) => {
                    setSelectedItem(item);
                    setIsDeleteOpen(true);
                },
            },
        ],
        [t]
    );

    return (
        <>
            <PageHeader
                title={t('menu.employeeList')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.employees') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => {
                            setModalMode('create');
                            setIsModalOpen(true);
                        }}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm nhân viên
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(e) => e.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm nhân viên..."
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                isHeaderSticky
                maxHeight="500px"
            />
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? 'Thêm nhân viên' : 'Sửa nhân viên'}
            >
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Họ" placeholder="Nguyễn" variant="bordered" radius="lg" />
                        <Input label="Tên" placeholder="Văn A" variant="bordered" radius="lg" />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="email@company.com"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Điện thoại"
                        placeholder="0901234567"
                        variant="bordered"
                        radius="lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Phòng ban" variant="bordered" radius="lg">
                            <SelectItem key="IT">IT</SelectItem>
                            <SelectItem key="HR">HR</SelectItem>
                            <SelectItem key="Finance">Finance</SelectItem>
                            <SelectItem key="Sales">Sales</SelectItem>
                        </Select>
                        <Select label="Vị trí" variant="bordered" radius="lg">
                            <SelectItem key="Developer">Developer</SelectItem>
                            <SelectItem key="Manager">Manager</SelectItem>
                            <SelectItem key="Analyst">Analyst</SelectItem>
                        </Select>
                    </div>
                </div>
            </CommonModal>
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => {
                    setIsDeleteOpen(false);
                    refresh();
                }}
                title="Xóa nhân viên"
                message="Bạn có chắc muốn xóa nhân viên này?"
            />
        </>
    );
}

// ==================== ORG CHART PAGE ====================

export function OrgChartPage() {
    const { t } = useTranslation();
    const orgData = [
        { id: 1, name: 'Nguyễn CEO', position: 'CEO', level: 0, children: [2, 3, 4] },
        { id: 2, name: 'Trần CTO', position: 'CTO', level: 1, parent: 1, children: [5, 6] },
        { id: 3, name: 'Lê CFO', position: 'CFO', level: 1, parent: 1, children: [7] },
        { id: 4, name: 'Phạm COO', position: 'COO', level: 1, parent: 1, children: [8] },
        { id: 5, name: 'Hoàng Dev Lead', position: 'Dev Lead', level: 2, parent: 2 },
        { id: 6, name: 'Vũ QA Lead', position: 'QA Lead', level: 2, parent: 2 },
        { id: 7, name: 'Đặng Accountant', position: 'Accountant', level: 2, parent: 3 },
        { id: 8, name: 'Bùi HR Manager', position: 'HR Manager', level: 2, parent: 4 },
    ];

    return (
        <>
            <PageHeader
                title={t('menu.orgChart')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.orgChart') }]}
            />
            <div className="flex flex-col items-center gap-8 p-8">
                {/* CEO */}
                <div className="flex flex-col items-center">
                    <Card className="w-48 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <CardBody className="p-4 text-center">
                            <Avatar
                                src="https://i.pravatar.cc/150?u=ceo"
                                className="mx-auto mb-2"
                                size="lg"
                            />
                            <p className="font-bold">{orgData[0].name}</p>
                            <p className="text-sm opacity-80">{orgData[0].position}</p>
                        </CardBody>
                    </Card>
                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                </div>
                {/* Level 1 */}
                <div className="flex gap-8">
                    {orgData
                        .filter((o) => o.level === 1)
                        .map((person) => (
                            <div key={person.id} className="flex flex-col items-center">
                                <Card className="w-40 border-2 border-blue-200 dark:border-blue-800">
                                    <CardBody className="p-3 text-center">
                                        <Avatar
                                            src={`https://i.pravatar.cc/150?u=${person.id}`}
                                            className="mx-auto mb-2"
                                        />
                                        <p className="text-sm font-semibold">{person.name}</p>
                                        <p className="text-xs text-gray-500">{person.position}</p>
                                    </CardBody>
                                </Card>
                                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                                {/* Level 2 */}
                                <div className="flex gap-2">
                                    {orgData
                                        .filter((o) => o.parent === person.id)
                                        .map((child) => (
                                            <Card
                                                key={child.id}
                                                className="w-32 bg-gray-50 dark:bg-zinc-800"
                                            >
                                                <CardBody className="p-2 text-center">
                                                    <Avatar
                                                        src={`https://i.pravatar.cc/150?u=${child.id}`}
                                                        size="sm"
                                                        className="mx-auto mb-1"
                                                    />
                                                    <p className="text-xs font-medium">
                                                        {child.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">
                                                        {child.position}
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

// ==================== ATTENDANCE CHECK-IN PAGE ====================

export function AttendanceCheckInPage() {
    const { t } = useTranslation();
    const [checkedIn, setCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);

    const handleCheckIn = () => {
        setCheckInTime(new Date().toLocaleTimeString('vi-VN'));
        setCheckedIn(true);
    };

    const handleCheckOut = () => {
        setCheckedIn(false);
    };

    return (
        <>
            <PageHeader
                title={t('menu.checkIn')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.attendance') }]}
            />
            <div className="mx-auto mt-8 max-w-md">
                <Card className="shadow-xl">
                    <CardBody className="p-8 text-center">
                        <div className="mb-4 text-6xl font-bold text-gray-800 dark:text-white">
                            {new Date().toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                        <p className="mb-8 text-gray-500">
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>

                        {checkedIn ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 text-green-500">
                                    <CheckCircleIcon className="h-6 w-6" />
                                    <span>Đã Check-in lúc {checkInTime}</span>
                                </div>
                                <Button
                                    color="danger"
                                    size="lg"
                                    radius="full"
                                    className="w-full"
                                    onPress={handleCheckOut}
                                >
                                    <ClockIcon className="mr-2 h-5 w-5" />
                                    Check-out
                                </Button>
                            </div>
                        ) : (
                            <Button
                                color="primary"
                                size="lg"
                                radius="full"
                                className="w-full"
                                onPress={handleCheckIn}
                            >
                                <ClockIcon className="mr-2 h-5 w-5" />
                                Check-in ngay
                            </Button>
                        )}
                    </CardBody>
                </Card>
            </div>
        </>
    );
}

// ==================== ATTENDANCE HISTORY PAGE ====================

export function AttendanceHistoryPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<AttendanceRecord>({
        fetchFn: createFetchFn(mockAttendance),
        initialPageSize: 10,
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present':
                return 'success';
            case 'absent':
                return 'danger';
            case 'late':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<AttendanceRecord>[] = useMemo(
        () => [
            { key: 'date', label: 'Ngày' },
            { key: 'employeeName', label: 'Nhân viên' },
            { key: 'checkIn', label: 'Giờ vào' },
            { key: 'checkOut', label: 'Giờ ra' },
            { key: 'workHours', label: 'Số giờ', render: (r) => `${r.workHours}h` },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (r) => (
                    <Chip size="sm" color={getStatusColor(r.status)} variant="flat">
                        {r.status === 'present' ? 'Có mặt' : r.status === 'absent' ? 'Vắng' : 'Trễ'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.attendanceHistory')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.attendance') }]}
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(r) => r.id}
                isLoading={isLoading}
                showSearch
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
        </>
    );
}

// ==================== PAYROLL SALARY PAGE ====================

export function PayrollSalaryPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<PayrollRecord>({ fetchFn: createFetchFn(mockPayroll), initialPageSize: 10 });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const columns: TableColumn<PayrollRecord>[] = useMemo(
        () => [
            { key: 'employeeName', label: 'Nhân viên' },
            { key: 'department', label: 'Phòng ban' },
            {
                key: 'baseSalary',
                label: 'Lương cơ bản',
                render: (r) => formatCurrency(r.baseSalary),
            },
            { key: 'allowances', label: 'Phụ cấp', render: (r) => formatCurrency(r.allowances) },
            {
                key: 'deductions',
                label: 'Khấu trừ',
                render: (r) => (
                    <span className="text-red-500">-{formatCurrency(r.deductions)}</span>
                ),
            },
            {
                key: 'netSalary',
                label: 'Thực lĩnh',
                render: (r) => (
                    <span className="font-bold text-green-600">{formatCurrency(r.netSalary)}</span>
                ),
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (r) => (
                    <Chip
                        size="sm"
                        color={
                            r.status === 'paid'
                                ? 'success'
                                : r.status === 'processed'
                                  ? 'primary'
                                  : 'warning'
                        }
                        variant="flat"
                    >
                        {r.status === 'paid'
                            ? 'Đã trả'
                            : r.status === 'processed'
                              ? 'Đã xử lý'
                              : 'Chờ xử lý'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.salarySheet')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.payroll') }]}
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(r) => r.id}
                isLoading={isLoading}
                showSearch
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
        </>
    );
}

// ==================== PAYROLL ADVANCES PAGE ====================

export function PayrollAdvancesPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<AdvanceRequest>({ fetchFn: createFetchFn(mockAdvances), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const columns: TableColumn<AdvanceRequest>[] = useMemo(
        () => [
            { key: 'employeeName', label: 'Nhân viên' },
            { key: 'amount', label: 'Số tiền', render: (r) => formatCurrency(r.amount) },
            { key: 'reason', label: 'Lý do' },
            { key: 'requestDate', label: 'Ngày yêu cầu' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (r) => (
                    <Chip
                        size="sm"
                        color={
                            r.status === 'approved'
                                ? 'success'
                                : r.status === 'rejected'
                                  ? 'danger'
                                  : 'warning'
                        }
                        variant="flat"
                    >
                        {r.status === 'approved'
                            ? 'Đã duyệt'
                            : r.status === 'rejected'
                              ? 'Từ chối'
                              : 'Chờ duyệt'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.advances')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.payroll') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Yêu cầu tạm ứng
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(r) => r.id}
                isLoading={isLoading}
                showSearch
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Yêu cầu tạm ứng"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        type="number"
                        label="Số tiền (VNĐ)"
                        placeholder="5000000"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Lý do"
                        placeholder="Nhập lý do tạm ứng..."
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}

// ==================== LEAVE REQUEST PAGE ====================

export function LeaveRequestPage() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { items, isLoading, total, page, pageSize, setPage, setPageSize, refresh } =
        useTableData<LeaveRequest>({
            fetchFn: createFetchFn(mockLeaveRequests.filter((r) => r.status === 'pending')),
            initialPageSize: 10,
        });

    const columns: TableColumn<LeaveRequest>[] = useMemo(
        () => [
            {
                key: 'leaveType',
                label: 'Loại nghỉ',
                render: (r) =>
                    r.leaveType === 'annual'
                        ? 'Phép năm'
                        : r.leaveType === 'sick'
                          ? 'Ốm đau'
                          : r.leaveType === 'personal'
                            ? 'Việc riêng'
                            : 'Thai sản',
            },
            { key: 'startDate', label: 'Từ ngày' },
            { key: 'endDate', label: 'Đến ngày' },
            { key: 'days', label: 'Số ngày' },
            { key: 'reason', label: 'Lý do' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: () => (
                    <Chip size="sm" color="warning" variant="flat">
                        Chờ duyệt
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.leaveRequest')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.leave') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Xin nghỉ phép
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(r) => r.id}
                isLoading={isLoading}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Xin nghỉ phép"
            >
                <div className="flex flex-col gap-4">
                    <Select label="Loại nghỉ phép" variant="bordered" radius="lg">
                        <SelectItem key="annual">Phép năm</SelectItem>
                        <SelectItem key="sick">Ốm đau</SelectItem>
                        <SelectItem key="personal">Việc riêng</SelectItem>
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" label="Từ ngày" variant="bordered" radius="lg" />
                        <Input type="date" label="Đến ngày" variant="bordered" radius="lg" />
                    </div>
                    <Input
                        label="Lý do"
                        placeholder="Nhập lý do nghỉ phép..."
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}

// ==================== LEAVE APPROVE PAGE ====================

export function LeaveApprovePage() {
    const { t } = useTranslation();
    const { items, isLoading, total, page, pageSize, setPage, setPageSize, refresh } =
        useTableData<LeaveRequest>({
            fetchFn: createFetchFn(mockLeaveRequests),
            initialPageSize: 10,
        });

    const columns: TableColumn<LeaveRequest>[] = useMemo(
        () => [
            { key: 'employeeName', label: 'Nhân viên' },
            {
                key: 'leaveType',
                label: 'Loại',
                render: (r) =>
                    r.leaveType === 'annual'
                        ? 'Phép năm'
                        : r.leaveType === 'sick'
                          ? 'Ốm đau'
                          : 'Việc riêng',
            },
            { key: 'startDate', label: 'Từ ngày' },
            { key: 'endDate', label: 'Đến ngày' },
            { key: 'days', label: 'Số ngày' },
            { key: 'reason', label: 'Lý do' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (r) => (
                    <Chip
                        size="sm"
                        color={
                            r.status === 'approved'
                                ? 'success'
                                : r.status === 'rejected'
                                  ? 'danger'
                                  : 'warning'
                        }
                        variant="flat"
                    >
                        {r.status === 'approved'
                            ? 'Đã duyệt'
                            : r.status === 'rejected'
                              ? 'Từ chối'
                              : 'Chờ duyệt'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<LeaveRequest>[] = useMemo(
        () => [
            {
                key: 'approve',
                label: 'Duyệt',
                onClick: () => refresh(),
                isVisible: (r) => r.status === 'pending',
            },
            {
                key: 'reject',
                label: 'Từ chối',
                onClick: () => refresh(),
                isVisible: (r) => r.status === 'pending',
            },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.leaveApprove')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.leave') }]}
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(r) => r.id}
                actions={actions}
                isLoading={isLoading}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
        </>
    );
}

// ==================== RECRUITMENT JOBS PAGE ====================

export function RecruitmentJobsPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<JobPosting>({ fetchFn: createFetchFn(mockJobPostings), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: TableColumn<JobPosting>[] = useMemo(
        () => [
            { key: 'title', label: 'Vị trí' },
            { key: 'department', label: 'Phòng ban' },
            { key: 'location', label: 'Địa điểm' },
            {
                key: 'type',
                label: 'Loại',
                render: (j) =>
                    j.type === 'fulltime'
                        ? 'Toàn thời gian'
                        : j.type === 'parttime'
                          ? 'Bán thời gian'
                          : 'Hợp đồng',
            },
            { key: 'salary', label: 'Lương' },
            {
                key: 'applicants',
                label: 'Ứng viên',
                render: (j) => (
                    <Chip size="sm" variant="flat">
                        {j.applicants}
                    </Chip>
                ),
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (j) => (
                    <Chip
                        size="sm"
                        color={
                            j.status === 'open'
                                ? 'success'
                                : j.status === 'closed'
                                  ? 'danger'
                                  : 'default'
                        }
                        variant="flat"
                    >
                        {j.status === 'open'
                            ? 'Đang tuyển'
                            : j.status === 'closed'
                              ? 'Đã đóng'
                              : 'Nháp'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.jobPostings')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.recruitment') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Đăng tuyển
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(j) => j.id}
                isLoading={isLoading}
                showSearch
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Đăng tin tuyển dụng"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Vị trí tuyển dụng"
                        placeholder="Senior Developer"
                        variant="bordered"
                        radius="lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Phòng ban" variant="bordered" radius="lg">
                            <SelectItem key="IT">IT</SelectItem>
                            <SelectItem key="HR">HR</SelectItem>
                            <SelectItem key="Sales">Sales</SelectItem>
                        </Select>
                        <Select label="Loại hình" variant="bordered" radius="lg">
                            <SelectItem key="fulltime">Toàn thời gian</SelectItem>
                            <SelectItem key="parttime">Bán thời gian</SelectItem>
                            <SelectItem key="contract">Hợp đồng</SelectItem>
                        </Select>
                    </div>
                    <Input
                        label="Mức lương"
                        placeholder="20-30 triệu"
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}

// ==================== RECRUITMENT CANDIDATES PAGE ====================

export function RecruitmentCandidatesPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<Candidate>({ fetchFn: createFetchFn(mockCandidates), initialPageSize: 10 });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hired':
                return 'success';
            case 'rejected':
                return 'danger';
            case 'offer':
                return 'primary';
            case 'interview':
                return 'secondary';
            default:
                return 'warning';
        }
    };

    const columns: TableColumn<Candidate>[] = useMemo(
        () => [
            { key: 'name', label: 'Ứng viên' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Điện thoại' },
            { key: 'position', label: 'Vị trí ứng tuyển' },
            { key: 'experience', label: 'Kinh nghiệm' },
            { key: 'appliedDate', label: 'Ngày ứng tuyển' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (c) => (
                    <Chip size="sm" color={getStatusColor(c.status)} variant="flat">
                        {c.status === 'new'
                            ? 'Mới'
                            : c.status === 'screening'
                              ? 'Sàng lọc'
                              : c.status === 'interview'
                                ? 'Phỏng vấn'
                                : c.status === 'offer'
                                  ? 'Offer'
                                  : c.status === 'hired'
                                    ? 'Đã tuyển'
                                    : 'Từ chối'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<Candidate>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem CV', onClick: () => {} },
            { key: 'interview', label: 'Phỏng vấn', onClick: () => refresh() },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.candidates')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.recruitment') }]}
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(c) => c.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
        </>
    );
}

// ==================== TRAINING COURSES PAGE ====================

export function TrainingCoursesPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<Course>({ fetchFn: createFetchFn(mockCourses), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: TableColumn<Course>[] = useMemo(
        () => [
            { key: 'title', label: 'Khóa học' },
            { key: 'category', label: 'Danh mục' },
            { key: 'instructor', label: 'Giảng viên' },
            { key: 'duration', label: 'Thời lượng' },
            { key: 'enrolled', label: 'Đã đăng ký' },
            { key: 'startDate', label: 'Ngày bắt đầu' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (c) => (
                    <Chip
                        size="sm"
                        color={
                            c.status === 'active'
                                ? 'success'
                                : c.status === 'upcoming'
                                  ? 'primary'
                                  : 'default'
                        }
                        variant="flat"
                    >
                        {c.status === 'active'
                            ? 'Đang mở'
                            : c.status === 'upcoming'
                              ? 'Sắp mở'
                              : 'Đã kết thúc'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.courses')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.training') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm khóa học
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(c) => c.id}
                isLoading={isLoading}
                showSearch
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm khóa học"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Tên khóa học"
                        placeholder="React Advanced"
                        variant="bordered"
                        radius="lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Danh mục" variant="bordered" radius="lg">
                            <SelectItem key="Technical">Technical</SelectItem>
                            <SelectItem key="Soft Skills">Soft Skills</SelectItem>
                            <SelectItem key="Management">Management</SelectItem>
                        </Select>
                        <Input
                            label="Thời lượng"
                            placeholder="2 tuần"
                            variant="bordered"
                            radius="lg"
                        />
                    </div>
                    <Input
                        label="Giảng viên"
                        placeholder="Tên giảng viên"
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}

// ==================== TRAINING MY LEARNING PAGE ====================

export function TrainingMyLearningPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('menu.myLearning')}
                breadcrumbs={[{ label: t('menu.group.hr') }, { label: t('menu.training') }]}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockMyLearning.map((learning) => (
                    <Card key={learning.id} className="shadow-lg">
                        <CardBody className="p-6">
                            <h3 className="mb-2 text-lg font-bold">{learning.courseName}</h3>
                            <div className="mb-4 flex items-center justify-between">
                                <Chip
                                    size="sm"
                                    color={
                                        learning.status === 'completed'
                                            ? 'success'
                                            : learning.status === 'inprogress'
                                              ? 'primary'
                                              : 'default'
                                    }
                                    variant="flat"
                                >
                                    {learning.status === 'completed'
                                        ? 'Hoàn thành'
                                        : learning.status === 'inprogress'
                                          ? 'Đang học'
                                          : 'Chưa bắt đầu'}
                                </Chip>
                                <span className="text-sm text-gray-500">{learning.progress}%</span>
                            </div>
                            <Progress
                                value={learning.progress}
                                color={learning.status === 'completed' ? 'success' : 'primary'}
                                className="mb-4"
                            />
                            <div className="text-sm text-gray-500">
                                <p>Bắt đầu: {learning.startedDate}</p>
                                {learning.completedDate && (
                                    <p>Hoàn thành: {learning.completedDate}</p>
                                )}
                            </div>
                            {learning.status !== 'completed' && (
                                <Button
                                    color="primary"
                                    variant="flat"
                                    className="mt-4 w-full"
                                    radius="full"
                                >
                                    Tiếp tục học
                                </Button>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>
        </>
    );
}
