import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardHome } from '../pages/DashboardHome';
import { CampaignsPage } from '../features/campaigns/pages/CampaignsPage';
import { ProspectsPage } from '../features/prospects/pages/ProspectsPage';
import { TemplatesPage } from '../features/templates/pages/TemplatesPage';
import { SendersPage } from '../features/senders/pages/SendersPage';
import { DocumentsPage } from '../features/documents/pages/DocumentsPage';
import { EmailSendsPage } from '../features/emailSends/pages/EmailSendsPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { UsersPage } from '../features/users/pages/UsersPage';
import { paths } from './paths';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path={paths.LOGIN} element={<LoginPage />} />
            </Route>

            <Route element={<DashboardLayout />}>
                <Route path={paths.DASHBOARD} element={<DashboardHome />} />
                <Route path={paths.CAMPAIGNS} element={<CampaignsPage />} />
                <Route path={paths.PROSPECTS} element={<ProspectsPage />} />
                <Route path={paths.TEMPLATES} element={<TemplatesPage />} />
                <Route path={paths.SENDERS} element={<SendersPage />} />
                <Route path={paths.DOCUMENTS} element={<DocumentsPage />} />
                <Route path={paths.EMAIL_SENDS} element={<EmailSendsPage />} />
                <Route path={paths.ANALYTICS} element={<AnalyticsPage />} />
                <Route path={paths.USERS} element={<UsersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
