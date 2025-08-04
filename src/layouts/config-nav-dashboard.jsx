import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const useDashboardNav = () => {
  const { t } = useTranslation('navbar');
  return [
    /**
     * Overview
     */
    {
      subheader: t('workingOverview'),
      items: [
        { title: t('dashboard'), path: paths.dashboard.group.root, roles:['comptable','aide-comptable'], icon: ICONS.dashboard },
        {
          title: t('menu'),
          path: paths.dashboard.companyMenu.root,
          icon: ICONS.dashboard,
          roles: ['entreprise'],
        },
        { title: t('demands'), path: paths.dashboard.demandes, roles:['comptable','aide-comptable'], icon: ICONS.analytics },
        { title: t('files'), roles: ['entreprise'], path: paths.dashboard.files.root, icon: ICONS.file },
      ],
    },
    /**
     * Management
     */
    {
      subheader: t('management'),
      items: [
        {
          title: t('users'),
          path: paths.dashboard.users.root,
          icon: ICONS.user,
          roles: ['comptable'],
          children: [
            { title: t('entreprises'), path: paths.dashboard.users.root },
            { title: t('accounterHelpers'), path: paths.dashboard.users.aideComptable },
            
          ],
        },
        { title: t('employees'), path: paths.dashboard.users.employee.root, icon: ICONS.user,roles:['entreprise'] },
        { title: t('fileManager'), path: paths.dashboard.fileManager, roles:['comptable','aide-comptable'], icon: ICONS.folder },
        { title: t('services'), path: paths.dashboard.services.root, icon: ICONS.job },
        // { title: t('chat'), path: paths.dashboard.chat, icon: ICONS.chat },
        { title: t('calendar'), path: paths.dashboard.calendar, roles:['comptable','aide-comptable'], icon: ICONS.calendar },
        { title: t('tasks'), path: paths.dashboard.kanban, roles:['comptable','aide-comptable'], icon: ICONS.kanban },
        
      ],
    },
  ];
};
