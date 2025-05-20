import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// Chat
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

const EntreprisesList = lazy(() => import('src/pages/dashboard/users/entreprise/list'));
const EntrepriseCreatePage = lazy(() => import('src/pages/dashboard/users/entreprise/new'));
const EntrepriseEditPage = lazy(() => import('src/pages/dashboard/users/entreprise/edit'));

const AideComptableCreatePage = lazy(() => import('src/pages/dashboard/users/aide-comptable/new'));
const AideComptableListPage = lazy(() => import('src/pages/dashboard/users/aide-comptable/list'));

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
// ----------------------------------------------------------------------

const UserProfilePage = lazy(() => import('src/auth/view/user-profile-view'));

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
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
      {
        path: 'users',
        children: [
          { element: <EntreprisesList />, index: true },
          { path: 'new entreprise', element: <EntrepriseCreatePage /> },
          { path: ':id/edit/entreprise', element: <EntrepriseEditPage /> },
          { path: 'aide-comptable', element: <AideComptableListPage /> },
          { path: 'aide-comptable/new', element: <AideComptableCreatePage /> },
        ],
      },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'file-manager', element: <FileManagerPage /> },
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
