import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Layout } from '@/components/layout';
import { DashboardOverview, DashboardAnalytics } from '@/pages/dashboard';
import { ProductsPage } from '@/pages/products';
import { UsersList, UsersRoles } from '@/pages/users/index';
import { PostsList } from '@/pages/posts/index';
import { ProjectsList, ProjectsCreate } from '@/pages/projects/index';
import { AssetsList, AssetsRequests } from '@/pages/assets/index';
import { FinanceInvoices } from '@/pages/finance/index';
import { Settings } from '@/pages/settings/index';
import { TodosList } from '@/pages/todos';
import { CommentsList } from '@/pages/comments';
import { QuotesList } from '@/pages/quotes';
import {
    ApprovalsSubmit,
    ApprovalsApprove,
    ApprovalsPending,
    ApprovalsHistory,
} from '@/pages/approvals';

import { Login } from '@/pages/auth/Login';

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Layout />}>
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
                        <Route path="finance/invoices" element={<FinanceInvoices />} />
                        {/* Approvals */}
                        <Route path="approvals/submit" element={<ApprovalsSubmit />} />
                        <Route path="approvals/approve" element={<ApprovalsApprove />} />
                        <Route path="approvals/pending" element={<ApprovalsPending />} />
                        <Route path="approvals/history" element={<ApprovalsHistory />} />
                        {/* Settings */}
                        <Route path="settings" element={<Settings />} />

                        {/* New API Pages */}
                        <Route path="todos" element={<TodosList />} />
                        <Route path="comments" element={<CommentsList />} />
                        <Route path="quotes" element={<QuotesList />} />
                    </Route>
                </Routes>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default App;
