// eslint-disable-next-line import/no-extraneous-dependencies
import { DragOverlay as DndDragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';

import Portal from '@mui/material/Portal';

import ItemBase from '../item/item-base';
import ColumnBase from '../column/column-base';
import { KanbanColumnToolBar } from '../column/kanban-column-toolbar';

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
};

// ----------------------------------------------------------------------

export function KanbanDragOverlay({ columns, tasks, activeId, sx }) {
  const safeColumns = Array.isArray(columns) ? columns.filter(Boolean) : [];
  const columnIds = safeColumns.map((column) => column.id);

  const activeColumn = safeColumns.find((column) => column && column.id === activeId);

  const allTasks = tasks ? Object.values(tasks).flat().filter(Boolean) : [];

  const activeTask = allTasks.find((task) => task && task.id === activeId);

  return (
    <Portal>
      <DndDragOverlay adjustScale={false} dropAnimation={dropAnimation}>
        {activeId ? (
          <>
            {columnIds.includes(activeId) ? (
              activeColumn ? (
                <ColumnOverlay column={activeColumn} tasks={tasks && tasks[activeId] ? tasks[activeId].filter(Boolean) : []} sx={sx} />
              ) : null
            ) : (
              activeTask ? <TaskItemOverlay task={activeTask} sx={sx} /> : null
            )}
          </>
        ) : null}
      </DndDragOverlay>
    </Portal>
  );
}

// ----------------------------------------------------------------------

export function ColumnOverlay({ column, tasks, sx }) {
  const safeTasks = Array.isArray(tasks) ? tasks.filter(Boolean) : [];
  return (
    <ColumnBase
      slots={{
        header: <KanbanColumnToolBar columnName={column?.name} totalTasks={safeTasks.length} />,
        main: safeTasks.map((task) => <ItemBase key={task.id} task={task} />),
      }}
      stateProps={{ dragOverlay: true }}
      sx={sx}
    />
  );
}

// ----------------------------------------------------------------------

export function TaskItemOverlay({ task, sx }) {
  return <ItemBase task={task} sx={sx} stateProps={{ dragOverlay: true }} />;
}
