const { Draggable, Droppable } = window.ReactBeautifulDnd;
const React = window.React;
const ReactDOM = window.ReactDOM;
const e = React.createElement;

const MoveCandidateHandle = (props) => {
  return e(
    "div",
    {
      className: "candidate-handle draggable",
      title: "Déplacer ce candidat",
      ...props
    },
    e(
      "div",
      {
        className: "candidate-handle__icon"
      },
      //"⋮⋮" // or ✥
    )
  );
}

const Candidate = ({ candidate, index, otherColumns, onSelectDestinationColumn }) => {
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
        className: "candidate",
        ...provided.draggableProps,
        ...provided.dragHandleProps,
        ref: provided.innerRef
      },
      e(
        MoveCandidateHandle,
        {
          //...provided.dragHandleProps
        }
      ),
      e(
        "div",
        {
          className: "candidate-label"
        },
        candidate.content
      ),
      e(
        "select",
        {
          className: "candidate-select-destination",
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
      draggableId: candidate.id,
      index: index,
      children: children
    }
  );
}

const CandidateList = ({innerRef, placeholder, children, ...otherProps}) => {
  return e(
    "div",
    {
      className: "column-candidate-list",
      ref: innerRef,
      ...otherProps
    },
    children,
    placeholder
  );
};

const DeletePreferenceLevelButton = ({onClick}) => {
  return e(
    "span",
    {
      className: "column-actions__delete-column clickable",
      onClick,
      title: "Supprimer ce niveau de préférence" // TODO: i18n
    },
    "🗑"
  );
};


// A Column is a list which has a title (prop label) and which can contain candidates.
// These candidates can be moved to other columns by drag & drop or using the select box next to each candidate.
// The user can delete a Column if it contains no candidates.
// A special kind of Column is when `column.id` is "not-ranked": this Column cannot be deleted.
const Column = ({ column, label, otherColumns, candidates, onClickDeleteButton, onSelectCandidateDestinationColumn
 }) => {
  const rendered_candidates = candidates.map((candidate, index) => {
    return e(
      Candidate,
      {
        key: candidate.id,
        candidate,
        index,
        otherColumns,
        onSelectDestinationColumn: (event) => {
          onSelectCandidateDestinationColumn(candidate.id, index, event.currentTarget.value);
        }
      }
    );
  });
  const columnActions = column.id === "not-ranked" ? null : e(
    "div",
    {
      className: "column-actions"
    },
    e(
      DeletePreferenceLevelButton,
      {
        onClick: onClickDeleteButton
      }
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
            CandidateList,
            {
              innerRef: provided.innerRef,
              ...provided.droppableProps,
              placeholder: provided.placeholder
            },
            ...rendered_candidates,
          );
        }
      }
    )
  );
}

export default Column;

