import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// eslint-disable-next-line import/no-unresolved
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export function CustomDateRangePicker({
  open,
  error,
  endDate,
  onClose,
  startDate,
  PaperProps,
  onChangeEndDate,
  variant = 'input',
  onChangeStartDate,
  title = 'Select date range',
  onApply,
  ...other
}) {
  const mdUp = useResponsive('up', 'md');

  const isCalendarView = variant === 'calendar';

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth={isCalendarView ? false : 'xs'}
      PaperProps={{
        ...PaperProps,
        sx: {
          ...(isCalendarView && { maxWidth: 720 }),
          ...PaperProps?.sx,
        },
      }}
      {...other}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent sx={{ ...(isCalendarView && mdUp && { overflow: 'unset' }) }}>
        <Stack
          justifyContent="center"
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && mdUp ? 'row' : 'column'}
          sx={{ pt: 1 }}
        >
          {isCalendarView ? (
            <>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  borderStyle: 'dashed',
                }}
              >
                <DateCalendar value={startDate} onChange={onChangeStartDate} />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  borderStyle: 'dashed',
                }}
              >
                <DateCalendar value={endDate} onChange={onChangeEndDate} />
              </Paper>
            </>
          ) : (
            <>
              <DatePicker label="Start date" value={startDate} onChange={onChangeStartDate} />

              <DatePicker label="End date" value={endDate} onChange={onChangeEndDate} />
            </>
          )}
        </Stack>

        {error && (
          <FormHelperText error sx={{ px: 2 }}>
            End date must be later than start date
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={error}
          variant="contained"
          onClick={() => {
            if (onApply) onApply();
            onClose();
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
