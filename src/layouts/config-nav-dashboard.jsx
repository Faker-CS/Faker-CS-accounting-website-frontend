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
      { title: 'Dashboard', path: paths.dashboard.group.root, roles:['comptable'], icon: ICONS.dashboard },
      {
        title: 'Menu',
        path: paths.dashboard.companyMenu.root,
        icon: ICONS.dashboard,
        roles: ['entreprise'],
      },
      { title: 'Demands', path: paths.dashboard.demandes, roles:['comptable','aide-comptable'], icon: ICONS.analytics },
      // {
      //   title: 'Banking',
      //   path: paths.dashboard.banking.root,
      //   icon: ICONS.banking,
      //   roles: ['comptable'],
      // },
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
        title: 'Users',
        path: paths.dashboard.users.root,
        icon: ICONS.user,
        roles: ['comptable'],
        children: [
          { title: 'Entreprises', path: paths.dashboard.users.root },
          { title: 'Accounter Helpers', path: paths.dashboard.users.aideComptable },
        ],
      },
      { title: 'File manager', path: paths.dashboard.fileManager, roles:['comptable','aide-comptable'], icon: ICONS.folder },
      // {
      //   title: 'Invoice',
      //   path: paths.dashboard.invoice.root,
      //   roles:['comptable','aide-comptable'],
      //   icon: ICONS.invoice,
      //   children: [
      //     { title: 'List', path: paths.dashboard.invoice.root },
      //     { title: 'Details', path: paths.dashboard.invoice.demo.details },
      //     { title: 'Create', path: paths.dashboard.invoice.new },
      //     { title: 'Edit', path: paths.dashboard.invoice.demo.edit },
      //   ],
      // },
      { title: 'Chat', path: paths.dashboard.chat, icon: ICONS.chat },
      { title: 'Calendar', path: paths.dashboard.calendar, roles:['comptable','aide-comptable'], icon: ICONS.calendar },
      { title: 'Tasks', path: paths.dashboard.kanban, roles:['comptable','aide-comptable'], icon: ICONS.kanban },
    ],
  },
];
