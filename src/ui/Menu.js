import React, {useEffect, useRef, useState} from 'react';

import {AnchorPopover} from "./Popover";
import {MenuItemGroupWithSelectors} from "./MenuItem";

import * as style from "../style";
import './Menu.scss';

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

function MenuButton(props) {
  return (
    <AnchorPopover
      open={props.open}
      anchorStyle={{
        left: props.left ? props.left : 0,
      }}
      anchorDir="y"
      anchor={
        <div
          className="menu-button"
          style={{
            minWidth: props.width,
            backgroundColor: props.open ? style.rgba(style.white, 0.75) : style.rgba(style.white, 0),
            fontWeight: props.fontWeight ? props.fontWeight : "normal",
          }}
          onMouseOver={props.onMouseOver}
          onMouseDown={props.onMouseDown}
        >
          {typeof props.title === "string" ? props.title :
            React.Children.map(props.title, (item) => (
              React.cloneElement(item, {
                className: "menu-button-content",
              })
            ))
          }
        </div>
      }
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
    </AnchorPopover>
  )
}

function MenuButtonGroup(props) {
  const [state, setState] = useState({
    openIndex: -1,
  })
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setState({...state, openIndex: -1});
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  return (
    <div
      ref={ref}
      className="menu-button-group"
      style={{
        flexDirection: props.reverse ? "row-reverse" : "row",
      }}
    >
      {React.Children.map(props.children, (item, index) => (
        React.cloneElement(item, {
          key: index,
          left: (props.reverse ? 8 : -8) * index,
          open: state.openIndex === index,
          onMouseOver: () => {
            if (state.openIndex !== -1) {
              setState({...state, openIndex: index})
            }
          },
          onMouseDown: () => {
            setState({...state, openIndex: index})
          },
          onClose: () => {
            setState({...state, openIndex: -1})
          }
        })
      ))}
    </div>
  )
}

export {Menu, MenuButton, MenuButtonGroup};
