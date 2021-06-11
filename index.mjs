import initialData from './initialData.mjs';
import Column from './Column.mjs';

const React = window.React;
const { DragDropContext } = window.ReactBeautifulDnd;
const ReactDOM = window.ReactDOM;
const e = React.createElement;

const buildColumnLabel = (column, columnOrderIndex) => {
  return column.title ? column.title : `Préférence ${columnOrderIndex+1}`; // TODO: i18n
};

const PreferenceLevelCreatorButton = ({onClick}) => {
  return e(
    "div",
    {
      className: "level-creator noselect",
    },
    e(
      "span",
      {
        className: "level-creator__add-icon clickable",
        onClick: onClick,
        title: "+ Ajouter ici un niveau de préférence" // TODO: i18n
      },
      "+ Ajouter ici un niveau de préférence" // TODO: i18n
    )
  );
};
      
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialData,
      createdColumnsCounter: initialData.columnOrder.length
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.moveCandidate = this.moveCandidate.bind(this);
    this.deletePreferenceLevel = this.deletePreferenceLevel.bind(this);
    this.insertPreferenceLevel = this.insertPreferenceLevel.bind(this);
    this.render = this.render.bind(this);
  }
  moveCandidate(candidateId, sourceColumnId, destinationColumnId, sourceColumnCandidateIndex, destinationColumnCandidateIndex) {
    const sourceColumn = this.state.columns[sourceColumnId];
    const newSourceColumnCandidateIds = Array.from(sourceColumn.candidatesIds);
    newSourceColumnCandidateIds.splice(sourceColumnCandidateIndex, 1);
    if (sourceColumnId === destinationColumnId){
      newSourceColumnCandidateIds.splice(destinationColumnCandidateIndex, 0, candidateId);
    }
    const newSourceColumn = {
      ...sourceColumn,
      candidatesIds: newSourceColumnCandidateIds
    }
    let changedColumns = {};
    changedColumns[newSourceColumn.id] = newSourceColumn;
    if (sourceColumnId != destinationColumnId){
      const destinationColumn = this.state.columns[destinationColumnId];
      const newDestinationColumnCandidateIds = Array.from(destinationColumn.candidatesIds);
      newDestinationColumnCandidateIds.splice(destinationColumnCandidateIndex, 0, candidateId);
      const newDestinationColumn = {
        ...destinationColumn,
        candidatesIds: newDestinationColumnCandidateIds
      };
      changedColumns[newDestinationColumn.id] = newDestinationColumn;
    }
    
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        ...changedColumns
      }
    };
    this.setState(newState);
  }
  deletePreferenceLevel(columnId) {
    const index = this.state.columnOrder.findIndex(element => element == columnId);
    if (index === undefined){
      console.log(`/!\\ column id ${columnId} not found in this.state.columnOrder`);
      return;
    }
    const newColumnOrder = Array.from(this.state.columnOrder);
    const newColumns = JSON.parse(JSON.stringify(this.state.columns));
    newColumnOrder.splice(index, 1);
    if (newColumns.hasOwnProperty(columnId)){
      delete newColumns[columnId];
    }
    else {
      console.log(`/!\\ could not remove ${columnId} because it was absent from newColumns`);
    }
    const newState = {
      ...this.state,
      columns: newColumns,
      columnOrder: newColumnOrder
    };
    this.setState(newState);
  }
  insertPreferenceLevel(insertBeforeIndex) {
    const newColumnId = `column-${this.state.createdColumnsCounter}`;
    const newColumnOrder = Array.from(this.state.columnOrder);
    newColumnOrder.splice(insertBeforeIndex, 0, newColumnId);
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumnId]: {
          'id': newColumnId,
          'candidatesIds': []
        }
      },
      columnOrder: newColumnOrder,
      createdColumnsCounter: this.state.createdColumnsCounter+1
    };
    this.setState(newState);
  }
  onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination){
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index){
      return;
    }
    this.moveCandidate(draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
  }
  render() {
    const allColumns = this.state.columnOrder.map((columnId, index) => { return {id: columnId, label: buildColumnLabel(this.state.columns[columnId], index)}; });
    const children = this.state.columnOrder.map(
      (columnId, index) => {
        if(!this.state.columns.hasOwnProperty(columnId)){
          console.log(`/!\\ Column ${columnId} is present at index ${index} in this.state.columnOrder, but is absent from this.state.columns`);
          return e("div");
        }
        const column = this.state.columns[columnId];
        const candidates = column.candidatesIds.map(candidateId => this.state.candidates[candidateId]);
        const otherColumns = Array.from(allColumns);
        otherColumns.splice(index, 1);
        return e(
          "div",
          null,
          e(
            PreferenceLevelCreatorButton,
            {
              onClick: () => {
                this.insertPreferenceLevel(index);
              }
            }
          ),
          e(
            Column,
            {
              key: column.id,
              column: column,
              candidates: candidates,
              label: buildColumnLabel(column, index),
              onClickDeleteButton: () => {
                const canDeleteColumn = candidates.length == 0;
                if (canDeleteColumn){
                  this.deletePreferenceLevel(column.id);
                }
                else {
                  alert("You can delete a level of preference only if it is empty. Please first move the candidates it contains to other preference levels."); // TODO: i18n
                }
              },
              otherColumns: otherColumns,
              onSelectCandidateDestinationColumn: (candidateId, sourceColumnCandidateIndex, destinationColumnId) => {
                this.moveCandidate(candidateId, column.id, destinationColumnId, sourceColumnCandidateIndex, this.state.columns[destinationColumnId].candidatesIds.length);
              }
            }
          )
        );
      }
    );
    return e(
      "div",
      {
        className: "preferential-vote-ordering-ui"
      },
      e(
        DragDropContext,
        {
          onDragEnd: this.onDragEnd
        },
        ...children
      )
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('app'));
