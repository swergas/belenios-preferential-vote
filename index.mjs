import initialData from './initialData.mjs';
import Column from './Column.mjs';

const React = window.React;
const {DragDropContext, Draggable, Droppable } = window.ReactBeautifulDnd;
const ReactDOM = window.ReactDOM;
const e = React.createElement;

const buildColumnLabel = (column, columnOrderIndex) => {
  return column.title ? column.title : `Préférence ${columnOrderIndex+1}`; // TODO: i18n
};

const LevelCreatorButton = ({onClick}) => {
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
        title: "Créer ici un niveau de préférence" // TODO: i18n
      },
      "+ Ajouter ici un niveau de préférence" // TODO: i18n
    )
  );
};
      
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialData;
    this.onDragEnd = this.onDragEnd.bind(this);
    this.moveTask = this.moveTask.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    this.insertColumn = this.insertColumn.bind(this);
    this.render = this.render.bind(this);
  }
  moveTask(taskId, sourceColumnId, destinationColumnId, sourceColumnTaskIndex, destinationColumnTaskIndex) {
    const sourceColumn = this.state.columns[sourceColumnId];
    const newSourceColumnTaskIds = Array.from(sourceColumn.taskIds);
    newSourceColumnTaskIds.splice(sourceColumnTaskIndex, 1);
    if (sourceColumnId === destinationColumnId){
      newSourceColumnTaskIds.splice(destinationColumnTaskIndex, 0, taskId);
    }
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: newSourceColumnTaskIds
    }
    let changedColumns = {};
    changedColumns[newSourceColumn.id] = newSourceColumn;
    if (sourceColumnId != destinationColumnId){
      const destinationColumn = this.state.columns[destinationColumnId];
      const newDestinationColumnTaskIds = Array.from(destinationColumn.taskIds);
      newDestinationColumnTaskIds.splice(destinationColumnTaskIndex, 0, taskId);
      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: newDestinationColumnTaskIds
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
  deleteColumn(columnId) {
    console.log(`deleting level ${columnId}`);
    const index = this.state.columnOrder.findIndex(element => element == columnId);
    if (index === undefined){
      console.log(`/!\\ column id ${columnId} not found in this.state.columnOrder`);
      return;
    }
    console.log(`Column ${columnId} found in this.state.columnOrder at index ${index}`);
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
    console.log("this.state:", this.state);
    console.log("newState:", newState);
    this.setState(newState);
  }
  insertColumn(insertBeforeIndex) {
    console.log("createLevelFunction()");
    const newColumnId = `column-${this.state.columnOrder.length+1}`;
    console.log("createLevelFunction() newColumnId:", newColumnId);
    const newColumnOrder = Array.from(this.state.columnOrder);
    newColumnOrder.splice(insertBeforeIndex, 0, newColumnId);
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumnId]: {
          'id': newColumnId,
          'taskIds': []
        }
      },
      columnOrder: newColumnOrder
    };
    console.log("this.state:", this.state);
    console.log("newState:", newState);
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
    this.moveTask(draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
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
        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
        const otherColumns = Array.from(allColumns);
        otherColumns.splice(index, 1);
        return e(
          "div",
          null,
          e(
            LevelCreatorButton,
            {
              onClick: () => {
                this.insertColumn(index);
              }
            }
          ),
          e(
            Column,
            {
              key: column.id,
              column: column,
              tasks: tasks,
              label: buildColumnLabel(column, index),
              onClickDeleteButton: () => {
                this.deleteColumn(column.id);
              },
              otherColumns: otherColumns,
              onSelectTaskDestinationColumn: (taskId, sourceColumnTaskIndex, destinationColumnId) => {
                console.log("onSelectTaskDestinationColumn() taskId:", taskId);
                console.log("onSelectTaskDestinationColumn() sourceColumnTaskIndex:", sourceColumnTaskIndex);
                console.log("onSelectTaskDestinationColumn() destinationColumnId:", destinationColumnId);
                this.moveTask(taskId, column.id, destinationColumnId, sourceColumnTaskIndex, this.state.columns[destinationColumnId].taskIds.length);
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
