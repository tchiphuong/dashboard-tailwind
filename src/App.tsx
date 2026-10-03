import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardOverview, DashboardAnalytics } from '@/views/dashboard';
import {
    ProductsPage,
    UsersList,
    UsersRoles,
    ProjectsList,
    ProjectsCreate,
    AssetsList,
    AssetsRequests,
} from '@/views/management';
import { PostsList, CommentsList, QuotesList } from '@/views/content';
import {
    ApprovalsSubmit,
    ApprovalsApprove,
    ApprovalsPending,
    ApprovalsHistory,
    TodosList,
    CalendarPage,
    KanbanPage,
} from '@/views/workflow';
import {
    ChatPage,
    NotificationsPage,
    SurveyListPage,
    SurveyBuilderPage,
    SurveyResultsPage,
    SurveyTemplatesPage,
    SurveyAnalyticsPage,
} from '@/views/apps';
import { FinanceInvoices, FinanceBudgets, AdvancedReportsPage } from '@/views/reports';
import { Settings, AuditLogPage, ProfilePage, HelpCenterPage } from '@/views/system';
import { FilesList, MyFilesList, TemplatesPage, SignaturesPage } from '@/views/documents';
import {
    EmployeesPage,
    OrgChartPage,
    AttendanceCheckInPage,
    AttendanceHistoryPage,
    PayrollSalaryPage,
    PayrollAdvancesPage,
    LeaveRequestPage,
    RecruitmentJobsPage,
    RecruitmentCandidatesPage,
    TrainingCoursesPage,
    TrainingMyLearningPage,
} from '@/views/hr';
import {
    OrdersListPage,
    CreateOrderPage,
    CustomersListPage,
    AddCustomerPage,
    SalesQuotesPage,
} from '@/views/sales';
import {
    StockOverviewPage,
    StockAdjustmentPage,
    WarehousesPage,
    TransfersPage,
} from '@/views/inventory';
import {
    PurchaseOrderListPage,
    CreatePurchaseOrderPage,
    SuppliersPage,
    ReceiptsPage,
} from '@/views/purchase';
import { LeadListPage, AddLeadPage, OpportunitiesPage, ContactsPage } from '@/views/crm';
import {
    CampaignListPage,
    CreateCampaignPage,
    EmailMarketingPage,
    SocialMediaPage,
} from '@/views/marketing';
import {
    ChartOfAccountsPage,
    JournalListPage,
    NewJournalEntryPage,
    GeneralLedgerPage,
} from '@/views/accounting';
import { TicketListPage, NewTicketPage, ITAssetsPage, KnowledgeBasePage } from '@/views/it';
import {
    BOMListPage,
    WorkOrdersPage,
    ProductionPlanningPage,
    ProductionReportsPage,
    QualityInspectionsPage,
    QualityStandardsPage,
    ContractListPage,
    ContractTemplatesPage,
    MaintenanceSchedulePage,
    MaintenanceRequestsPage,
} from '@/views/operations';

import { Login } from '@/views/auth';
import { NotFoundPage, UnauthorizedPage, ForbiddenPage, ServerErrorPage } from '@/views/errors';
import { Layout } from '@/components/layout';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <Layout>
                        <Outlet />
                    </Layout>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                {/* Dashboard */}
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="dashboard/analytics" element={<DashboardAnalytics />} />
                {/* Products - RESTful */}
                <Route path="products" element={<ProductsPage />} />
                {/* Users */}
                <Route path="users" element={<UsersList />} />
                <Route path="users/roles" element={<UsersRoles />} />
                {/* Posts */}
                <Route path="posts" element={<PostsList />} />
                {/* Projects */}
                <Route path="projects" element={<ProjectsList />} />
                <Route path="projects/new" element={<ProjectsCreate />} />
                {/* Assets */}
                <Route path="assets" element={<AssetsList />} />
                <Route path="assets/requests" element={<AssetsRequests />} />
                {/* Finance */}
                <Route path="finance/budgets" element={<FinanceBudgets />} />
                <Route path="finance/invoices" element={<FinanceInvoices />} />
                {/* Approvals */}
                <Route path="approvals/submit" element={<ApprovalsSubmit />} />
                <Route path="approvals/approve" element={<ApprovalsApprove />} />
                <Route path="approvals/pending" element={<ApprovalsPending />} />
                <Route path="approvals/history" element={<ApprovalsHistory />} />
                {/* Documents */}
                <Route path="documents/files" element={<FilesList />} />
                <Route path="documents/files/my" element={<MyFilesList />} />
                <Route path="documents/templates" element={<TemplatesPage />} />
                <Route path="documents/signatures" element={<SignaturesPage />} />

                {/* HR */}
                <Route path="hr/employees" element={<EmployeesPage />} />
                <Route path="hr/org-chart" element={<OrgChartPage />} />
                <Route path="hr/attendance/check-in" element={<AttendanceCheckInPage />} />
                <Route path="hr/attendance/history" element={<AttendanceHistoryPage />} />
                <Route path="hr/payroll/salary" element={<PayrollSalaryPage />} />
                <Route path="hr/payroll/advances" element={<PayrollAdvancesPage />} />
                <Route path="hr/leave/request" element={<LeaveRequestPage />} />
                <Route
                    path="hr/leave/approve"
                    element={<Navigate to="/approvals/pending" replace />}
                />
                <Route path="hr/recruitment/jobs" element={<RecruitmentJobsPage />} />
                <Route path="hr/recruitment/candidates" element={<RecruitmentCandidatesPage />} />
                <Route path="hr/training/courses" element={<TrainingCoursesPage />} />
                <Route path="hr/training/my-learning" element={<TrainingMyLearningPage />} />

                {/* Sales */}
                <Route path="sales/orders" element={<OrdersListPage />} />
                <Route path="sales/orders/new" element={<CreateOrderPage />} />
                <Route path="sales/customers" element={<CustomersListPage />} />
                <Route path="sales/customers/new" element={<AddCustomerPage />} />
                <Route path="sales/quotes" element={<SalesQuotesPage />} />

                {/* Inventory */}
                <Route path="inventory/stock" element={<StockOverviewPage />} />
                <Route path="inventory/stock/adjustment" element={<StockAdjustmentPage />} />
                <Route path="inventory/warehouses" element={<WarehousesPage />} />
                <Route path="inventory/transfers" element={<TransfersPage />} />

                {/* Purchase */}
                <Route path="purchase/orders" element={<PurchaseOrderListPage />} />
                <Route path="purchase/orders/new" element={<CreatePurchaseOrderPage />} />
                <Route path="purchase/suppliers" element={<SuppliersPage />} />
                <Route path="purchase/receipts" element={<ReceiptsPage />} />

                {/* CRM */}
                <Route path="crm/leads" element={<LeadListPage />} />
                <Route path="crm/leads/new" element={<AddLeadPage />} />
                <Route path="crm/opportunities" element={<OpportunitiesPage />} />
                <Route path="crm/contacts" element={<ContactsPage />} />

                {/* Marketing */}
                <Route path="marketing/campaigns" element={<CampaignListPage />} />
                <Route path="marketing/campaigns/new" element={<CreateCampaignPage />} />
                <Route path="marketing/email" element={<EmailMarketingPage />} />
                <Route path="marketing/social" element={<SocialMediaPage />} />

                {/* Manufacturing */}
                <Route path="manufacturing/bom" element={<BOMListPage />} />
                <Route path="manufacturing/work-orders" element={<WorkOrdersPage />} />
                <Route path="manufacturing/planning" element={<ProductionPlanningPage />} />
                <Route path="manufacturing/reports" element={<ProductionReportsPage />} />

                {/* Quality Control */}
                <Route path="quality/inspections" element={<QualityInspectionsPage />} />
                <Route path="quality/standards" element={<QualityStandardsPage />} />

                {/* Contracts */}
                <Route path="contracts" element={<ContractListPage />} />
                <Route path="contracts/templates" element={<ContractTemplatesPage />} />

                {/* Maintenance */}
                <Route path="maintenance/schedule" element={<MaintenanceSchedulePage />} />
                <Route path="maintenance/requests" element={<MaintenanceRequestsPage />} />

                {/* Accounting */}
                <Route path="accounting/chart" element={<ChartOfAccountsPage />} />
                <Route path="accounting/journal" element={<JournalListPage />} />
                <Route path="accounting/journal/new" element={<NewJournalEntryPage />} />
                <Route path="accounting/ledger" element={<GeneralLedgerPage />} />

                {/* IT */}
                <Route path="it/tickets" element={<TicketListPage />} />
                <Route path="it/tickets/new" element={<NewTicketPage />} />
                <Route path="it/assets" element={<ITAssetsPage />} />
                <Route path="it/knowledge" element={<KnowledgeBasePage />} />

                {/* Settings */}
                <Route path="settings" element={<Settings />} />

                {/* Workflow */}
                <Route path="workflow/calendar" element={<CalendarPage />} />
                <Route path="workflow/kanban" element={<KanbanPage />} />

                {/* Apps */}
                <Route path="apps/chat" element={<ChatPage />} />
                <Route path="apps/notifications" element={<NotificationsPage />} />
                {/* Surveys */}
                <Route path="apps/surveys" element={<SurveyListPage />} />
                <Route path="apps/surveys/create" element={<SurveyBuilderPage />} />
                <Route path="apps/surveys/templates" element={<SurveyTemplatesPage />} />
                <Route path="apps/surveys/analytics" element={<SurveyAnalyticsPage />} />
                <Route path="apps/surveys/:id/edit" element={<SurveyBuilderPage />} />
                <Route path="apps/surveys/:id/results" element={<SurveyResultsPage />} />

                {/* Reports */}
                <Route path="reports/advanced" element={<AdvancedReportsPage />} />

                {/* System */}
                <Route path="system/audit-log" element={<AuditLogPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="help" element={<HelpCenterPage />} />

                {/* New API Pages */}
                <Route path="todos" element={<TodosList />} />
                <Route path="comments" element={<CommentsList />} />
                <Route path="quotes" element={<QuotesList />} />
            </Route>

            {/* Error Pages */}
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
