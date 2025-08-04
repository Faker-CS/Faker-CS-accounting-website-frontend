/* eslint-disable import/no-unresolved */
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { useState, useEffect, useCallback } from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { deleteTask, updateTask, createSubtask, updateSubtask, deleteSubtask } from 'src/actions/kanban';

import { toast } from 'src/components/snackbar';
import { imageClasses } from 'src/components/image';

import ItemBase from './item-base';
import { KanbanDetails } from '../details/kanban-details';

// ----------------------------------------------------------------------

export function KanbanTaskItem({ task, disabled, columnId, sx }) {
  const { t } = useTranslation();
  const openDetails = useBoolean();

  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id: task?.id,
  });

  const mounted = useMountStatus();

  const mountedWhileDragging = isDragging && !mounted;

  const handleDeleteTask = useCallback(async () => {
    try {
      await deleteTask(columnId, task.id);
      toast.success(t('deleteSuccess'), { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error(t('deleteFailed'), { position: 'top-center' });
    }
  }, [columnId, task.id, t]);

  const handleUpdateTask = useCallback(
    async (taskData) => {
      try {
        await updateTask(task.id, taskData, { position: 'top-center' });
      } catch (error) {
        console.error(error);
        toast.error(t('updateFailed'), { position: 'top-center' });
      }
    },
    [task.id, t]
  );

  const handleCreateSubtask = useCallback(
    async (subtaskData) => {
      try {
        await createSubtask(task.id, subtaskData);
        toast.success(t('subtaskCreatedSuccess'));
      } catch (error) {
        console.error(error);
        toast.error(t('subtaskCreateFailed'));
      }
    },
    [task.id, t]
  );

  const handleUpdateSubtask = useCallback(
    async (subtaskId, subtaskData) => {
      try {
        await updateSubtask(subtaskId, subtaskData);
        toast.success(t('subtaskUpdatedSuccess'));
      } catch (error) {
        console.error(error);
        toast.error(t('subtaskUpdateFailed'));
      }
    },
    [t]
  );

  const handleDeleteSubtask = useCallback(
    async (subtaskId) => {
      try {
        await deleteSubtask(subtaskId);
        toast.success(t('subtaskDeletedSuccess'));
      } catch (error) {
        console.error(error);
        toast.error(t('subtaskDeleteFailed'));
      }
    },
    [t]
  );

  return (
    <>
      <ItemBase
        ref={disabled ? undefined : setNodeRef}
        task={task}
        onClick={openDetails.onTrue}
        stateProps={{
          transform,
          listeners,
          transition,
          sorting: isSorting,
          dragging: isDragging,
          fadeIn: mountedWhileDragging,
        }}
        sx={{ ...(openDetails.value && { [`& .${imageClasses.root}`]: { opacity: 0.8 } }), ...sx }}
      />

      <KanbanDetails
        task={task}
        openDetails={openDetails.value}
        onCloseDetails={openDetails.onFalse}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onCreateSubtask={handleCreateSubtask}
        onUpdateSubtask={handleUpdateSubtask}
        onDeleteSubtask={handleDeleteSubtask}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
 