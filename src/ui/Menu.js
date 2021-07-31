import React, {useRef, useState} from 'react';
import {Check, ChevronRight} from "react-feather"

import {Popover} from "./Popover";
import {ListDivider, ListItem} from "./ListItem";

import * as style from "../style";
import './Menu.scss';

function MenuDivider(props) {
  return (
    <ListDivider/>
  )
}

function MenuItem(props) {
  const [state, setState] = useState({
    hover: false,
  });

  return (
    <div
      className="menu-item"
      onClick={() => {
        if (props.onClose) props.onClose();
        if (props.onClick) props.onClick();
      }}
      onMouseEnter={() => {
        setState({...state, hover: true})
        if (props.onMouseEnter) props.onMouseEnter();
      }}
      onMouseLeave={() => {
        setState({...state, hover: false})
        if (props.onMouseLeave) props.onMouseLeave();
      }}
    >
      <ListItem
        size="small"
        highlight={state.hover ? 'primary' : null}
        primary={props.primary}
        icon={!props.indented ? null :
          (props.selected ? <Check className="menu-item-icon"/> : <div className="menu-item-icon"/>)
        }
        tail={props.secondary}
      />
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

function Menu(props) {
  let hasMenuItemWithSelector = 0;
  React.Children.forEach(props.children, item => {
    if (item.type === <MenuItemGroupWithSelectors />.type) hasMenuItemWithSelector = 1;
  });

  return (
    <div className="menu">
      {React.Children.map(props.children, (item, index) =>
        React.cloneElement(item, {
          indented: hasMenuItemWithSelector,
        })
      )}
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
        secondary={<ChevronRight size={style.icon1}/>}
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

export {MenuDivider, MenuItem, MenuItemGroupWithSelectors, Menu, MenuItemWithSubMenu};
