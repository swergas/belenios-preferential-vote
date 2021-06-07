const initialData = {
  candidates: {
    'candidate-1': { id: 'candidate-1', content: 'Take out the garbage all the way to the other side of the city' },
    'candidate-2': { id: 'candidate-2', content: 'Watch my favorite show' },
    'candidate-3': { id: 'candidate-3', content: 'Charge my phone' },
    'candidate-4': { id: 'candidate-4', content: 'Cook dinner' },
    'candidate-5': { id: 'candidate-5', content: 'Eat stuff' },
    'candidate-6': { id: 'candidate-6', content: 'Go to the pub' },
    'candidate-7': { id: 'candidate-7', content: 'Practice sport' },
    'candidate-8': { id: 'candidate-8', content: 'See friends' },
  },
  columns: {
    'column-0': {
      id: 'column-0',
      candidatesIds: [],
    },
    'column-1': {
      id: 'column-1',
      candidatesIds: [],
    },
    'not-ranked': {
      id: 'not-ranked',
      title: 'Non classé',
      candidatesIds: ['candidate-1', 'candidate-2', 'candidate-3', 'candidate-4', 'candidate-5', 'candidate-6', 'candidate-7', 'candidate-8'],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-0', 'column-1', 'not-ranked'],
};

export default initialData;
