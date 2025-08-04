import { t } from 'i18next';

export const statusData =[
    { value: 'none', label: t('noDemand'), color: 'default' },
    { value: 'pending', label: t('done'), color: 'info' },
    { value: 'review', label: t('onHold'), color: 'warning' },
    // { value: 'accepted', label: 'Accepted', color: 'success' },
    { value: 'in_work', label: t('inWork'), color: 'primary' },
    { value: 'rejected', label: t('missingFile'), color: 'error' },
];