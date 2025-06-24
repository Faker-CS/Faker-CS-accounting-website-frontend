import { useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR, { mutate } from 'swr';

// eslint-disable-next-line import/no-unresolved
import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const KANBAN_ENDPOINT = endpoints.tasks.all;

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR(KANBAN_ENDPOINT, fetcher, swrOptions);

  const memoizedValue = useMemo(() => {
    const tasks = data?.board?.tasks ?? {};
    const columns = data?.board?.columns ?? [];

    return {
      board: { tasks, columns },
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !columns.length,
    };
  }, [data?.board?.columns, data?.board?.tasks, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // add new column in board.columns
      const columns = [...board.columns, columnData];

      // add new task in board.tasks
      const tasks = { ...board.tasks, [columnData.id]: [] };

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId, columnName) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, columnName };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      const columns = board.columns.map((column) =>
        column.id === columnId
          ? {
              // Update data when found
              ...column,
              name: columnName,
            }
          : column
      );

      return { ...currentData, board: { ...board, columns } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveColumn(updateColumns) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      return { ...currentData, board: { ...board, columns: updateColumns } };
    },
    false
  );

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateColumns };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-column' } });
  }
}

// ----------------------------------------------------------------------

export async function clearColumn(columnId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'clear-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // remove all tasks in column
      const tasks = { ...board.tasks, [columnId]: [] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // delete column in board.columns
      const columns = board.columns.filter((column) => column.id !== columnId);

      // delete tasks by column deleted
      const tasks = Object.keys(board.tasks)
        .filter((key) => key !== columnId)
        .reduce((obj, key) => {
          obj[key] = board.tasks[key];
          return obj;
        }, {});

      return { ...currentData, board: { ...board, columns, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createTask(columnId, taskData) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // add task in board.tasks
      const tasks = { ...board.tasks, [columnId]: [taskData, ...board.tasks[columnId]] };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateTask(taskId, taskData) {
  try {
    // Update task on the server
    await axios.put(endpoints.tasks.update(taskId), taskData);

    // Update local state
    mutate(
      KANBAN_ENDPOINT,
      (currentData) => {
        const { board } = currentData;
        const tasks = { ...board.tasks };
        
        // Find and update the task in its current column
        Object.keys(tasks).forEach(columnId => {
          tasks[columnId] = tasks[columnId].map(task => 
            task.id === taskId ? { ...task, ...taskData } : task
          );
          mutate(endpoints.tasks.all);
        });

        return { ...currentData, board: { ...board, tasks } };
      },
      false
    );
  } catch (error) {
    console.error('Error updating task:', error);
    mutate(KANBAN_ENDPOINT);
  }
}

// ----------------------------------------------------------------------

export async function moveTask(updateTasks) {
  try {
    // Update task status on the server
    const taskId = Object.keys(updateTasks).find(key => 
      updateTasks[key].some(task => task.status !== task.originalStatus)
    );
    
    if (taskId) {
      const task = updateTasks[taskId].find(t => t.status !== t.originalStatus);
      await axios.put(endpoints.tasks.update(task.id), { status: task.status });
    }

    // Update local state
    mutate(
      KANBAN_ENDPOINT,
      (currentData) => {
        const { board } = currentData;
        return { ...currentData, board: { ...board, tasks: updateTasks } };
      },
      false
    );
  } catch (error) {
    console.error('Error updating task:', error);
    // Revert the change if the server update fails
    mutate(KANBAN_ENDPOINT);
  }
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId, taskId) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData;

      // delete task in column
      const tasks = {
        ...board.tasks,
        [columnId]: board.tasks[columnId].filter((task) => task.id !== taskId),
      };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createSubtask(taskId, subtaskData) {
  try {
    // Create subtask on the server
    const response = await axios.post(endpoints.tasks.subtasks.create(taskId), subtaskData);
    const newSubtask = response.data;

    // Update local state
    mutate(
      KANBAN_ENDPOINT,
      (currentData) => {
        const { board } = currentData;
        const tasks = { ...board.tasks };
        
        // Find and update the task in its current column
        Object.keys(tasks).forEach(columnId => {
          tasks[columnId] = tasks[columnId].map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), newSubtask]
              };
            }
            return task;
          });
        });

        return { ...currentData, board: { ...board, tasks } };
      },
      false
    );
  } catch (error) {
    console.error('Error creating subtask:', error);
    mutate(KANBAN_ENDPOINT);
  }
}

// ----------------------------------------------------------------------

export async function updateSubtask(subtaskId, subtaskData) {
  try {
    // Update subtask on the server
    await axios.put(endpoints.tasks.subtasks.update(subtaskId), subtaskData);

    // Update local state
    mutate(
      KANBAN_ENDPOINT,
      (currentData) => {
        const { board } = currentData;
        const tasks = { ...board.tasks };
        
        // Find and update the subtask in its parent task
        Object.keys(tasks).forEach(columnId => {
          tasks[columnId] = tasks[columnId].map(task => {
            if (task.subtasks) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask =>
                  subtask.id === subtaskId ? { ...subtask, ...subtaskData } : subtask
                )
              };
            }
            return task;
          });
        });

        return { ...currentData, board: { ...board, tasks } };
      },
      false
    );
  } catch (error) {
    console.error('Error updating subtask:', error);
    mutate(KANBAN_ENDPOINT);
  }
}

// ----------------------------------------------------------------------

export async function deleteSubtask(subtaskId) {
  try {
    // Delete subtask on the server
    await axios.delete(endpoints.tasks.subtasks.delete(subtaskId));

    // Update local state
    mutate(
      KANBAN_ENDPOINT,
      (currentData) => {
        const { board } = currentData;
        const tasks = { ...board.tasks };
        
        // Find and remove the subtask from its parent task
        Object.keys(tasks).forEach(columnId => {
          tasks[columnId] = tasks[columnId].map(task => {
            if (task.subtasks) {
              return {
                ...task,
                subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
              };
            }
            return task;
          });
        });

        return { ...currentData, board: { ...board, tasks } };
      },
      false
    );
  } catch (error) {
    console.error('Error deleting subtask:', error);
    mutate(KANBAN_ENDPOINT);
  }
}
