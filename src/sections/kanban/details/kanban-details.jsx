/* eslint-disable import/no-unresolved */
import dayjs from 'dayjs';
import { mutate } from 'swr';
import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line perfectionist/sort-imports
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useAuth } from 'src/hooks/useAuth';
import { useTabs } from 'src/hooks/use-tabs';
import { usePusher } from 'src/hooks/usePusher';
import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { KanbanDetailsToolbar } from './kanban-details-toolbar';
import { KanbanInputName } from '../components/kanban-input-name';
import { KanbanDetailsPriority } from './kanban-details-priority';
import { KanbanDetailsCommentList } from './kanban-details-comment-list';
import { KanbanDetailsCommentInput } from './kanban-details-comment-input';
import { KanbanContactsDialog } from '../components/kanban-contacts-dialog';

// ----------------------------------------------------------------------


const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.vars.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

const PRIORITY_MAP = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function KanbanDetails({
  task,
  openDetails,
  onUpdateTask,
  onDeleteTask,
  onCreateSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onCloseDetails,
}) {
  const tabs = useTabs('overview');
  const { userData } = useAuth();
  const isComptable = Array.isArray(userData?.roles)
    ? userData.roles.includes('comptable')
    : userData?.roles === 'comptable';

  const [priority, setPriority] = useState(task.priority ? task.priority.toLowerCase() : 'low');
  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [newSubtask, setNewSubtask] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { subscribe } = usePusher();

  const like = useBoolean();
  const contacts = useBoolean();

  // Due date range logic
  const initialDue = [
    task.created_at ? dayjs(task.created_at) : null,
    task.due_date ? dayjs(task.due_date) : null
  ];
  const [dueRange, setDueRange] = useState(initialDue);

  useEffect(() => {
    setDueRange([
      task.created_at ? dayjs(task.created_at) : null,
      task.due_date ? dayjs(task.due_date) : null
    ]);
  }, [task.created_at, task.due_date]);

  const rangePicker = useDateRangePicker(dueRange[0], dueRange[1]);

  const handleDueDateChange = async (start, end) => {
    // Only update the end date (due date), not the start (created_at)
    setDueRange([dueRange[0], end]);
    if (end && dayjs(end).isValid()) {
      await onUpdateTask({ ...task, due_date: dayjs(end).toISOString() });
    }
  };

  // Get assignees from helper_forms
  const assignees = task.form?.helper_forms?.map(helper => helper.user) || [];

  useEffect(() => {
    setPriority(task.priority ? task.priority.toLowerCase() : 'low');
  }, [task.priority]);

  const handleChangeTaskName = useCallback((event) => {
    setTaskName(event.target.value);
  }, []);

  const handleUpdateTask = useCallback(
    (event) => {
      try {
        if (event.key === 'Enter') {
          if (taskName) {
            onUpdateTask({ ...task, name: taskName });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateTask, task, taskName]
  );

  const handleChangeTaskDescription = useCallback((event) => {
    setTaskDescription(event.target.value);
  }, []);

  const handleChangePriority = useCallback((newValue) => {
    setPriority(newValue);
    onUpdateTask({ ...task, priority: PRIORITY_MAP[newValue] });
  }, [onUpdateTask, task]);

  const handleCreateSubtask = useCallback(
    (event) => {
      if (event.key === 'Enter' && newSubtask.trim()) {
        onCreateSubtask({
          title: newSubtask.trim(),
          task_id: task.id,
          completed: false,
        });
        setNewSubtask('');
      }
    },
    [newSubtask, onCreateSubtask, task.id]
  );

  const handleUpdateSubtask = useCallback(
    (subtaskId, completed) => {
      onUpdateSubtask(subtaskId, { is_completed: completed });
    },
    [onUpdateSubtask]
  );

  const handleDeleteSubtask = useCallback(
    (subtaskId) => {
      onDeleteSubtask(subtaskId);
    },
    [onDeleteSubtask]
  );

  // Load comments when task changes
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tasks/${task.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  }, [task.id]);

  const subscribeToComments = useCallback(() => {
    subscribe(`private-task.${task.id}`, 'NewComment', (data) => {
      setComments((prev) => [data.comment, ...prev]);
    });
  }, [task.id, subscribe]);

  useEffect(() => {
    if (task?.id) {
      loadComments();
      subscribeToComments();
    }
  }, [task?.id, loadComments, subscribeToComments]);

  const handleAddComment = async (commentData) => {
    try {
      const response = await axios.post(`/api/tasks/${task.id}/comments`, {
        content: commentData.content
      });
      setComments((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const renderToolbar = (
    <KanbanDetailsToolbar
      liked={like.value}
      taskName={task.name}
      onLike={like.onToggle}
      onDelete={onDeleteTask}
      taskStatus={task.status}
      onCloseDetails={onCloseDetails}
    />
  );

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      slotProps={{ tab: { px: 0 } }}
    >
      {[
        { value: 'overview', label: 'Overview' },
        { value: 'subTasks', label: `Subtasks (${task.subtasks?.length || 0})` },
        { value: 'comments', label: `Comments (${comments?.length || 0})` },
      ].map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  const renderTabOverview = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Task name */}
      <KanbanInputName
        placeholder="Task name"
        value={taskName}
        onChange={handleChangeTaskName}
        onKeyUp={handleUpdateTask}
        inputProps={{ id: `input-task-${taskName}` }}
      />

      {/* Reporter */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Reporter</StyledLabel>
        <Avatar alt={task.reporter?.name} src={`${import.meta.env.VITE_SERVER}/storage/${task.reporter?.photo}`} />
      </Box>

      {/* Assignee */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Assignee</StyledLabel>

        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
          {assignees.map((user) => (
            <Avatar key={user.id} alt={user.name} src={`${import.meta.env.VITE_SERVER}/storage/${user?.photo}`} />
          ))}

          <Tooltip title="Add assignee">
            <IconButton
              onClick={contacts.onTrue}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Tooltip>

          <KanbanContactsDialog
            assignee={assignees}
            open={contacts.value}
            onClose={contacts.onFalse}
          />
        </Box>
      </Box>

      {/* Due date */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel> Due date </StyledLabel>

        {isComptable ? (
          rangePicker.selected ? (
            <Button size="small" onClick={rangePicker.onOpen}>
              {rangePicker.shortLabel}
            </Button>
          ) : (
            <Tooltip title="Add due date">
              <IconButton
                onClick={rangePicker.onOpen}
                sx={{
                  bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                }}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            </Tooltip>
          )
        ) : (
          <Typography variant="body2" sx={{ ml: 1 }}>
            {rangePicker.shortLabel || 'No due date'}
          </Typography>
        )}

        {isComptable && (
          <CustomDateRangePicker
            variant="calendar"
            title="Choose due date"
            startDate={rangePicker.startDate}
            endDate={rangePicker.endDate}
            onChangeStartDate={() => {}} // Disable changing the start date
            onChangeEndDate={(date) => handleDueDateChange(rangePicker.startDate, date)}
            open={rangePicker.open}
            onClose={rangePicker.onClose}
            selected={rangePicker.selected}
            error={rangePicker.error}
            onApply={() => handleDueDateChange(rangePicker.startDate, rangePicker.endDate)}
          />
        )}
      </Box>

      {/* Priority */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Priority</StyledLabel>
        {isComptable ? (
          <KanbanDetailsPriority priority={priority} onChangePriority={handleChangePriority} />
        ) : (
          <Typography variant="body2" sx={{ ml: 1 }}>
            {PRIORITY_MAP[priority]}
          </Typography>
        )}
      </Box>

      {/* Description */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel> Description </StyledLabel>
        <TextField
          fullWidth
          multiline
          size="small"
          minRows={4}
          value={taskDescription}
          onChange={handleChangeTaskDescription}
          onBlur={() => onUpdateTask({ ...task, description: taskDescription })}
          InputProps={{ sx: { typography: 'body2' }, readOnly: !isComptable }}
        />
      </Box>
    </Box>
  );

  const renderTabSubtasks = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Add new subtask */}
      {isComptable && (
        <TextField
          fullWidth
          size="small"
          placeholder="Add a subtask"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyUp={handleCreateSubtask}
          InputProps={{
            endAdornment: (
              <IconButton
                size="small"
                onClick={() => {
                  if (newSubtask.trim()) {
                    handleCreateSubtask({ key: 'Enter' });
                  }
                }}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            ),
          }}
        />
      )}

      {/* Subtasks list */}
      <FormGroup>
        {task.subtasks?.map((subtask) => (
          <Box
            key={subtask.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={subtask.is_completed}
                  onChange={(e) => handleUpdateSubtask(subtask.id, e.target.checked)}
                />
              }
              label={subtask.title}
              sx={{
                flex: 1,
                textDecoration: subtask.completed ? 'line-through' : 'none',
                color: subtask.completed ? 'text.disabled' : 'text.primary',
              }}
            />

            {isComptable && (
              <IconButton
                size="small"
                onClick={() => handleDeleteSubtask(subtask.id)}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="mingcute:delete-line" />
              </IconButton>
            )}
          </Box>
        ))}
      </FormGroup>

      {/* Progress */}
      {task.subtasks?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {task.subtasks.filter((subtask) => subtask.is_completed).length} of {task.subtasks.length}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(task.subtasks.filter((subtask) => subtask.is_completed).length / task.subtasks.length) * 100}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>
      )}
    </Box>
  );

  const renderTabComments = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <KanbanDetailsCommentList 
        comments={comments} 
        onDeleteComment={handleDeleteComment}
      />

      <KanbanDetailsCommentInput 
        taskId={task.id}
        onAddComment={handleAddComment}
      />
    </Box>
  );

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      PaperProps={{
        sx: {
          width: {
            xs: 1,
            sm: 480,
          },
        },
      }}
    >
      {renderToolbar}

      <Scrollbar sx={{ height: 1 }}>
        {renderTabs}

        <Box sx={{ p: 3 }}>
          {tabs.value === 'overview' && renderTabOverview}

          {tabs.value === 'subTasks' && renderTabSubtasks}

          {tabs.value === 'comments' && renderTabComments}
        </Box>
      </Scrollbar>
    </Drawer>
  );
}
