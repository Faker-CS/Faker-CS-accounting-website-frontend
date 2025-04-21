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

export const navData = [
   /**
   * Overview
   */
   {
    subheader: 'Working Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.group.root, icon: ICONS.dashboard },
      { title: 'Analytics', path: paths.dashboard.group.five, icon: ICONS.analytics },
      { title: 'Banking', path: paths.dashboard.banking.root, icon: ICONS.banking },
      { title: 'Files', path: paths.dashboard.group.five, icon: ICONS.file },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Employees',
        path: paths.dashboard.employees.root,
        icon: ICONS.user,
        children: [
          { title: 'Entreprises', path: paths.dashboard.employees.root },
          { title: 'Effectifs', path: paths.dashboard.group.five },
        ],
      },
      { title: 'File manager', path: paths.dashboard.group.root, icon: ICONS.folder },
      {
        title: 'Invoice',
        path: paths.dashboard.group.root,
        icon: ICONS.invoice,
        children: [
          { title: 'List', path: paths.dashboard.group.root },
          { title: 'Details', path: paths.dashboard.group.five },
          { title: 'Create', path: paths.dashboard.group.six },
          { title: 'Edit', path: paths.dashboard.group.five },
        ],
      },
      { title: 'Chat', path: paths.dashboard.group.root, icon: ICONS.chat },
      { title: 'Calendar', path: paths.dashboard.calendar, icon: ICONS.calendar },
      { title: 'Kanban', path: paths.dashboard.group.five, icon: ICONS.kanban },
    ],
  },
];
