import React, {forwardRef, Fragment, useRef, useState} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import * as style from "../../style";
import "./MenuBarMenus.scss";

const MenuBarMenus = forwardRef(function MenuBarMenus(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {labels, separate, overlap, onChange, ...rootProps} = curProps;
  const menus = React.Children.toArray(children);

  const [state, setState] = useState({
    openIndex: -1,
    activeIndex: -1,
  })

  const buttonsRef = useRef([]);
  const buttonBackgroundsRef = useRef([]);
  return (
    <div
      {...rootProps}
      ref={ref}
      className="menu-bar-menus"
    >
      {React.Children.toArray(labels).filter(Boolean).map((label, index) => (
        <Fragment key={index}>
          <div
            ref={(node) => {buttonsRef.current[index] = node}}
            className="menu-button"
            onMouseDown={() => {
              setState({...state, openIndex: index});
              if (onChange) onChange(index);
            }}
            onMouseUp={() => {
              if (!menus[index] || menus[index].type === React.Fragment) setState({...state, openIndex: -1});
            }}
            onMouseOver={() => {
              if (!separate && menus[index] && menus[index].type !== React.Fragment && state.openIndex !== -1) {
                setState({...state, openIndex: index});
                if (onChange) onChange(index);
              }
            }}
          >
            <div
              ref={(node) => {buttonBackgroundsRef.current[index] = node}}
              className="menu-button-background"
              style={{
                width: `calc(100% + ${overlap ? style.space5 : '0px'})`,
                ...(state.openIndex === index ? style.glassBackground() : {}),
              }}
            />

            {typeof label === "string" ? label :
              React.Children.toArray(label).filter(Boolean).map((item) => (
                React.cloneElement(item, {
                  className: clsx("menu-button-content", item.props.className),
                })
              ))
            }
          </div>

          {!menus[index] ? null : React.cloneElement(menus[index], {
            open: state.openIndex === index,
            anchorEl: buttonBackgroundsRef.current[index],
            onClickOutside: (event) => {
              if (!buttonsRef.current[index].contains(event.target)) {
                setState({...state, openIndex: -1})
                if (onChange) onChange(-1);
              }
            },
            onClickInside: () => {
              setState({...state, openIndex: -1})
              if (onChange) onChange(-1);
            },
          })}
        </Fragment>
      ))}
    </div>
  )
});

MenuBarMenus.propTypes = {
}

MenuBarMenus.defaultProps = {
  separate: false,
  overlap: true,
}

export default MenuBarMenus;