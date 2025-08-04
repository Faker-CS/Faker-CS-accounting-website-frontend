/* eslint-disable import/no-unresolved */
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager/index'));
const FileManagerPageDetails = lazy(() => import('src/pages/dashboard/file-manager/details'));
// Chat
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/home/index'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageDashboard = lazy(() => import('src/pages/dashboard/home/index'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

const EntreprisesList = lazy(() => import('src/pages/dashboard/users/entreprise/list'));
const EntrepriseCreatePage = lazy(() => import('src/pages/dashboard/users/entreprise/new'));
const EntrepriseEditPage = lazy(() => import('src/pages/dashboard/users/entreprise/edit'));
const EntrepriseShowPage = lazy(() => import('src/pages/dashboard/users/entreprise/show'));

// employee
const EmployeeListView = lazy(() => import('src/pages/dashboard/users/employee/list'));
const EmployeeListViewbyId = lazy(() => import('src/pages/dashboard/users/employee/list'));
const EmployeeShowView = lazy(() => import('src/pages/dashboard/users/employee/show'));
const EmployeeCreateView = lazy(() => import('src/pages/dashboard/users/employee/new'));
const EmployeeEditView = lazy(() => import('src/pages/dashboard/users/employee/edit'));

const AideComptableCreatePage = lazy(() => import('src/pages/dashboard/users/aide-comptable/new'));
const AideComptableListPage = lazy(() => import('src/pages/dashboard/users/aide-comptable/list'));
const AideComptableShowPage = lazy(() => import('src/pages/dashboard/users/aide-comptable/show'));

const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// --------------------------------------------------------------------------------
// company menu
const CompanyMenuPage = lazy(() => import('src/pages/dashboard/CompanyMenu'));
const DepositPage = lazy(() => import('src/pages/dashboard/CompanyMenu/depot'));
const DocumentDemandsPage = lazy(() => import('src/pages/dashboard/CompanyMenu/demande'));
const DepotDropPage = lazy(() => import('src/pages/dashboard/CompanyMenu/depot-drop'));
const DemandsViewPage = lazy(() => import('src/pages/dashboard/demands/index'));
const ViewPage = lazy(() => import('src/pages/dashboard/demands/viewForm'));
// _________________________company incorporation___________________________
const Sarl = lazy(() => import('src/pages/dashboard/CompanyMenu/sarl'));
const SarlS = lazy(() => import('src/pages/dashboard/CompanyMenu/sarl-s'));
const Suarl = lazy(() => import('src/pages/dashboard/CompanyMenu/suarl'));
const Snc = lazy(() => import('src/pages/dashboard/CompanyMenu/snc'));
const Sa = lazy(() => import('src/pages/dashboard/CompanyMenu/sa'));
// ----------------------------------------------------------------------

const UserProfilePage = lazy(() => import('src/auth/view/user-profile-view'));

const FilesPage = lazy(() => import('src/pages/dashboard/files'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'home',
        children: [
          { element: <PageDashboard />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
      {
        path: 'files',
        children: [
          { element: <FilesPage />, index: true },
          { path: 'company/:companyId', element: <FileManagerPageDetails /> },
        ],
      },
      {
        path: 'users',
        children: [
          { element: <EntreprisesList />, index: true },
          { path: 'details/:id', element: <EntrepriseShowPage /> },
          { path: 'new entreprise', element: <EntrepriseCreatePage /> },
          { path: ':id/edit/entreprise', element: <EntrepriseEditPage /> },
          { path: 'aide-comptable', element: <AideComptableListPage /> },
          { path: 'aide-comptable/new', element: <AideComptableCreatePage /> },
          { path: 'aide-comptable/:id', element: <AideComptableShowPage /> },
          { path: 'employee', element: <EmployeeListView /> },
          { path: 'employee/:id/view', element: <EmployeeListViewbyId /> },
          { path: 'employee/new', element: <EmployeeCreateView /> },
          { path: 'employee/:id/edit', element: <EmployeeEditView /> },
          { path: 'employee/:id', element: <EmployeeShowView /> },
        ],
      },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'files/company/:companyId', element: <FileManagerPageDetails /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'chat', element: <ChatPage /> },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'document demands',
        children: [
          { element: <CompanyMenuPage />, index: true },
          { path: 'deposit', element: <DepositPage /> },
          { path: 'newDemande', element: <DocumentDemandsPage /> },
          { path: 'depot/:id', element: <DepotDropPage /> },
          { path: 'sarl', element: <Sarl /> },
          { path: 'sarl-s', element: <SarlS /> },
          { path: 'suarl', element: <Suarl /> },
          { path: 'snc', element: <Snc /> },
          { path: 'sa', element: <Sa /> },
        ],
      },
      { path: 'profile', element: <UserProfilePage /> },
      {
        path: 'demandes',
        children: [
          { element: <DemandsViewPage />, index: true },
          { element: <ViewPage />, path: ':id/demands' },
        ],
      },
    ],
  },
];
