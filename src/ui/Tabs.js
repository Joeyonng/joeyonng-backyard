import React from "react";

import "./Tabs.scss"

function TabPanel(props) {
  return (
    <div className="tab-panel">
      {props.children}
    </div>
  )
}

function TabPanels(props) {
  return (
    <div
      className="tab-panels"
      style={{
        width: props.fitContent ? "fit-content" : "100%",
        height: props.fitContent ? "fit-content" : "100%",
      }}
    >
      {React.cloneElement(props.children[props.selected_index], {
        style: {
          width: props.fitContent ? "fit-content" : "100%",
          height: props.fitContent ? "fit-content" : "100%",
        }
      })}
    </div>
  )
}

function Tab(props) {
  return (
    <div
      className={props.selected ? "tab selected" : "tab"}
      onClick={() => {
        if (props.onChange) props.onChange();
        if (props.onClick) props.onClick();
      }}
    >
      {props.children}
    </div>
  )
}

function Tabs(props) {
  const noDivider = (index) => (
    !Array.isArray(props.children) || index === props.children.length - 1
    || index === props.selected_index - 1 || index === props.selected_index
  );

  return (
    <div className="tabs">
      {React.Children.map(props.children, (item, index) => (
        <React.Fragment>
          {
            React.cloneElement(item, {
              selected: (index === props.selected_index),
              onChange: () => {
                props.onChange(index)
              },
            })
          }

          {noDivider(index) ? null : <div className="tab-divider"/>}
        </React.Fragment>
      ))}
    </div>
  )
}

export {TabPanel, TabPanels, Tab, Tabs};
