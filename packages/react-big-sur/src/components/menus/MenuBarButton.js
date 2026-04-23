import React, {forwardRef, Fragment, useRef} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {useEnsuredForwardedRef} from "react-use";

import * as style from "../../style";
import "./MenuBarButton.scss";

const MenuBarButton = forwardRef(function MenuBarButton(props, ref) {
  const {index, openIndex, overlap, onOpen, onClose, ...publicProps} = props;
  const {classNames, styles, children, ...curProps} = publicProps;
  const {label, separate, ...rootProps} = curProps;

  const menuBarButtonRef = useEnsuredForwardedRef(ref);
  const menuBarButtonBackgroundRef = useEnsuredForwardedRef(ref);
  return (
    <Fragment>
      <div
        {...rootProps}
        ref={menuBarButtonRef}
        className="menu-button"
        onMouseDown={(event) => {
          if (index !== openIndex) onOpen();
          if (rootProps.onMouseDown) rootProps.onMouseDown(event);
        }}
        onMouseUp={(event) => {
          if (!children) onClose();
          if (rootProps.onMouseUP) rootProps.onMouseUP(event);
        }}
        onMouseOver={(event) => {
          if (!separate && openIndex !== -1 && children) onOpen();
          if (rootProps.onMouseOver) rootProps.onMouseOver(event);
        }}
      >
        <div
          ref={menuBarButtonBackgroundRef}
          className="menu-button-background"
          style={{
            width: `calc(100% + ${overlap ? style.space5 : '0px'})`,
            ...(openIndex === index ? style.glassBackground() : {}),
          }}
        />

        {typeof label === "string" ? label :
          React.Children.toArray(label).filter(Boolean).map((item) =>
            React.cloneElement(item, {
              className: clsx("menu-button-content", item.props.className),
            })
          )}
      </div>

      {React.Children.toArray(children).filter(Boolean).map((child) =>
        React.cloneElement(child, {
          open: index === openIndex,
          anchorEl: menuBarButtonBackgroundRef.current,
          onClickOutside: (event) => {
            if (onClose && !menuBarButtonRef.current.contains(event.target)) onClose();
          },
          onClickInside: () => {
            if (onClose) onClose();
          },
        })
      )}
    </Fragment>
  )
});

MenuBarButton.propTypes = {
  /** The label of the menu to be appeared in MenuBarMenus. */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** If True, the menu won't open when the mouse over it. */
  separate: PropTypes.bool,
}

MenuBarButton.defaultProps = {
  separate: false,
}

export default MenuBarButton;