/* eslint-disable import/no-unresolved */
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
  const openDetails = useBoolean();

  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id: task?.id,
  });

  const mounted = useMountStatus();

  const mountedWhileDragging = isDragging && !mounted;

  const handleDeleteTask = useCallback(async () => {
    try {
      await deleteTask(columnId, task.id);
      toast.success('Delete success!', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Delete failed!', { position: 'top-center' });
    }
  }, [columnId, task.id]);

  const handleUpdateTask = useCallback(
    async (taskData) => {
      try {
        await updateTask(task.id, taskData, { position: 'top-center' });
      } catch (error) {
        console.error(error);
        toast.error('Update failed!', { position: 'top-center' });
      }
    },
    [task.id]
  );

  const handleCreateSubtask = useCallback(
    async (subtaskData) => {
      try {
        await createSubtask(task.id, subtaskData);
        toast.success('Subtask created successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to create subtask');
      }
    },
    [task.id]
  );

  const handleUpdateSubtask = useCallback(
    async (subtaskId, subtaskData) => {
      try {
        await updateSubtask(subtaskId, subtaskData);
        toast.success('Subtask updated successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to update subtask');
      }
    },
    []
  );

  const handleDeleteSubtask = useCallback(
    async (subtaskId) => {
      try {
        await deleteSubtask(subtaskId);
        toast.success('Subtask deleted successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete subtask');
      }
    },
    []
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
 