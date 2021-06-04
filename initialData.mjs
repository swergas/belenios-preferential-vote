const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage all the way to the other side of the city' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
    'task-4': { id: 'task-4', content: 'Cook dinner' },
    'task-5': { id: 'task-5', content: 'Eat stuff' },
    'task-6': { id: 'task-6', content: 'Go to the pub' },
    'task-7': { id: 'task-7', content: 'Practice sport' },
    'task-8': { id: 'task-8', content: 'See friends' },
  },
  columns: {
    'column-0': {
      id: 'column-0',
      taskIds: [],
    },
    'column-1': {
      id: 'column-1',
      taskIds: [],
    },
    'not-ranked': {
      id: 'not-ranked',
      title: 'Non classé',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6', 'task-7', 'task-8'],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-0', 'column-1', 'not-ranked'],
};

export default initialData;
