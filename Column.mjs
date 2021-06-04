const {DragDropContext, Draggable, Droppable } = window.ReactBeautifulDnd;
const React = window.React;
const ReactDOM = window.ReactDOM;
const e = React.createElement;

const Handle = (props) => {
  return e(
    "div",
    {
      className: "task-handle draggable",
      title: "Déplacer ce candidat",
      ...props
    },
    e(
      "div",
      {
        className: "task-handle__icon"
      },
      //"⋮⋮" // or ✥
    )
  );
}

const Task = ({ task, index, otherColumns, onSelectDestinationColumn }) => {
  const otherPreferencesSelectOptions = otherColumns.map(column => {
    return e(
      "option",
      {
        value: column.id
      },
      column.label
    );
  });
  otherPreferencesSelectOptions.splice(0, 0, e(
    "option",
    {
      value: "default"
    },
    "Déplacer vers" // TODO: i18n
  ));
  const children = (provided) => {
    return e(
      "div",
      {
        className: "task",
        ...provided.draggableProps,
        ref: provided.innerRef
      },
      e(
        Handle,
        {
          ...provided.dragHandleProps,
        }
      ),
      e(
        "div",
        {
          className: "task-label"
        },
        task.content
      ),
      e(
        "select",
        {
          className: "task-select-destination",
          onChange: onSelectDestinationColumn,
          defaultValue: "default"
        },
        ...otherPreferencesSelectOptions
      )
    );
  };
  return e(
    Draggable,
    {
      draggableId: task.id,
      index: index,
      children: children
    }
  );
}

const TaskList = ({innerRef, placeholder, children, ...otherProps}) => {
  return e(
    "div",
    {
      className: "column-task-list",
      ref: innerRef,
      ...otherProps
    },
    children,
    placeholder
  );
};

const Column = ({ column, label, otherColumns, tasks, onClickDeleteButton, onSelectTaskDestinationColumn }) => {
  const rendered_tasks = tasks.map((task, index) => {
    return e(
      Task,
      {
        key: task.id,
        task,
        index,
        otherColumns,
        onSelectDestinationColumn: (event) => {
          console.log("onSelectDestinationColumn() event:", event);
          console.log("onSelectDestinationColumn() event.currentTarget.value:", event.currentTarget.value);
          onSelectTaskDestinationColumn(task.id, index, event.currentTarget.value);
        }
      }
    );
  });
  const columnActions = column.id === "not-ranked" || tasks.length ? null : e(
    "div",
    {
      className: "column-actions"
    },
    e(
      "span",
      {
        className: "column-actions__delete-column clickable",
        onClick: onClickDeleteButton,
        title: "Supprimer ce niveau de préférence" // TODO: i18n
      },
      "🗑"
    )
  );
  return e(
    "div",
    {
      className: "column-container noselect"
    },
    e(
      "div",
      {
        className: "column-header"
      },
      e(
        "h3",
        {
          className: "column-title"
        },
        label
      ),
      columnActions,
    ),
    e(
      Droppable,
      {
        droppableId: column.id,
        children: (provided) => {
          return e(
            TaskList,
            {
              innerRef: provided.innerRef,
              ...provided.droppableProps,
              placeholder: provided.placeholder
            },
            ...rendered_tasks,
          );
        }
      }
    )
  );
}

export default Column;

