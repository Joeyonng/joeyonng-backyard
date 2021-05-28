import React, {useState} from "react";

import "./Tabs.scss"

function Tab(props) {
  return (
    <div
      className={props.selected ? "tab selected" : "tab"}
      onClick={() => props.onClick()}
    >
      {props.label}
    </div>
  )
}

function Tabs(props) {
  const [state, setState] = useState({
    selected_index: 0,
  });

  return (
    <div
      className="tabs"
    >
      {React.Children.map(props.children, (item, index) =>
        React.cloneElement(item, {
          selected: (index === state.selected_index),
          onClick: () => {
            setState({...state, selected_index: index})
            props.onSelect(item.props.label, index)
          },
          focus: props.focus,
        })
      )}
    </div>
  )
}

export {Tab};
export default Tabs;
