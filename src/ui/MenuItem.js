import React, {useRef, useState} from 'react';
import {Check, ChevronRight} from "react-feather"

import './MenuItem.scss';
import {Popover} from "./Popover";
import {Menu} from "./Menu";

function MenuDivider(props) {
  return (
    <div className="menu-divider"/>
  )
}

function MenuItem(props) {
  return (
    <div
      className="menu-item"
      onMouseEnter={props.onMouseEnter}
      onClick={() => {
        if (props.onClose) props.onClose();
        if (props.onClick) props.onClick();
      }}
    >
      {!props.indented ? null :
        (!props.selected ? <div className="menu-item-icon"/> : <Check className="menu-item-icon"/>)
      }
      <div className="menu-item-primary">
        {props.primary}
      </div>

      {!props.secondary ? null :
        <div className="menu-item-secondary">
          {typeof props.secondary === "string" ? props.secondary :
            React.Children.map(props.secondary, (item) => (
              React.cloneElement(item, {
                className: "menu-item-icon",
              })
            ))
          }
        </div>
      }
    </div>
  )
}

function MenuItemWithSubMenu(props) {
  const [state, setState] = useState({
    open: false,
  })
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      onMouseLeave={() => {
        setState({...state, open: false})
      }}
    >
      <MenuItem
        primary={props.primary}
        secondary={<ChevronRight/>}
        onMouseEnter={() => {
          setState({...state, open: true})
        }}
      />

      <Popover
        open={state.open}
        anchorRef={ref}
        anchorDir="x"
      >
        {props.children === undefined ? null :
          <Menu>
            {React.Children.map(props.children, (item) => (
              React.cloneElement(item, {
                onClose: props.onClose,
              })
            ))}
          </Menu>
        }
      </Popover>
    </div>
  )
}

function MenuItemGroupWithSelectors(props) {
  const [state, setState] = useState({
    selectedValue: props.default,
  })

  return (
    <React.Fragment>
      {Object.entries(props.values).map(([key, value], index) => {
        return (
          key === '/' ? <MenuDivider key={index}/> :
            <MenuItem
              key={index}
              primary={value.primary}
              secondary={value.secondary}
              indented={1}
              selected={state.selectedValue === key}
              onClick={() => {
                setState({...state, selectedValue: key})
                if (props.onChange !== undefined) props.onChange(key, index);
              }}
              onClose={props.onClose}
            />
        )
      })}
    </React.Fragment>
  )
}

export {MenuDivider, MenuItem, MenuItemWithSubMenu, MenuItemGroupWithSelectors};
