import { useTranslation } from 'react-i18next';

export function EmployeesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.employeeList')} subtitle="Employee List" />;
}

export function OrgChartPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.orgChart')} subtitle="Organization Chart" />;
}

export function AttendanceCheckInPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.checkIn')} subtitle="Attendance Check-In" />;
}

export function AttendanceHistoryPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.attendanceHistory')} subtitle="Attendance History" />;
}

export function PayrollSalaryPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.salarySheet')} subtitle="Payroll Salary Sheets" />;
}

export function PayrollAdvancesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.advances')} subtitle="Salary Advances" />;
}

export function LeaveRequestPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.leaveRequest')} subtitle="Leave Requests" />;
}

export function LeaveApprovePage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.leaveApprove')} subtitle="Leave Approval" />;
}

export function RecruitmentJobsPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.jobPostings')} subtitle="Job Postings" />;
}

export function RecruitmentCandidatesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.candidates')} subtitle="Candidates" />;
}

export function TrainingCoursesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.courses')} subtitle="Training Courses" />;
}

export function TrainingMyLearningPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.myLearning')} subtitle="My Learning" />;
}

// Reusable Placeholder Component
function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <p className="text-gray-500 dark:text-gray-400">{subtitle} - Coming Soon...</p>
            </div>
        </>
    );
}
