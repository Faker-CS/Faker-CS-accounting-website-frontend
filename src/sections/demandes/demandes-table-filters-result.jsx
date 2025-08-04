import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

// import { statusData } from 'src/_mock/_status';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function DemandesTableFiltersResult({ filters, totalResults, onResetPage, sx }) {
  const { t } = useTranslation();
  
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveService = useCallback(
    (inputValue) => {
      const newValue = filters.state.service.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ service: newValue });
    },
    [filters, onResetPage]
  );

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    filters.setState({ startDate: null, endDate: null });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label={`${t('service')}:`} isShow={!!filters.state.service.length}>
        {filters.state.service.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveService(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label={`${t('status')}:`} isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
        //   label={
        //     // statusData.find((status) => status.value === filters.state.status)?.label ||
        //     // filters.state.status
        //   }
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label={`${t('date')}:`}
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label={`${t('keyword')}:`} isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}