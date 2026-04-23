import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import clsx from 'clsx';

import TrafficLights from "../traffic-lights/TrafficLights";

import "./ToolbarWindow.scss";
import * as style from "../../style";

const ToolbarWindow = forwardRef(function ToolbarWindow(props, ref) {
  const {classNames, styles, children, ...curProps} = props
  const {width, height, focus, backgroundColor, onCloseClick, onMinimizeClick, onMaximizeClick, onToolbarDoubleClick,
    toolbar, sidebar, ...rootProps} = curProps

  return (
    <div
      {...rootProps}
      ref={ref}
      className={clsx("toolbar-window", classNames['root'])}
      style={{
        width: width,
        height: height,
        boxShadow: focus ? style.shadow1 : "none",
        ...styles['root'],
      }}
    >
      {!sidebar ? null :
        <div
          className="left-toolbar"
          style={focus ? {} : {
            backgroundColor: style.white,
            filter: style.filterUnFocus,
          }}
          onDoubleClick={() => {
            if (onToolbarDoubleClick) onToolbarDoubleClick();
          }}
        >
          <div className="lights">
            <TrafficLights
              focus={focus}
              onCloseClick={onCloseClick}
              onMinimizeClick={onMinimizeClick}
              onMaximizeClick={onMaximizeClick}
            />
          </div>
        </div>
      }

      <div
        className="right-toolbar"
        style={{
          filter: focus ? "none" : style.filterUnFocus,
        }}
        onDoubleClick={() => {
          if (onToolbarDoubleClick) onToolbarDoubleClick();
        }}
      >
        {sidebar ? null :
          <div className="lights">
            <TrafficLights
              focus={focus}
              onCloseClick={onCloseClick}
              onMinimizeClick={onMinimizeClick}
              onMaximizeClick={onMaximizeClick}
            />
          </div>
        }

        {toolbar}
      </div>

      {!sidebar ? null :
        <div
          className="sidebar"
          style={focus ? {} : {
            backgroundColor: style.white,
            filter: style.filterUnFocus,
          }}
        >
          {sidebar}
        </div>
      }

      <div
        className="window-content"
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        {children}
      </div>
    </div>
  )
});

ToolbarWindow.propTypes = {
  /** The width of the window. Directly passed to "width" property of the root element. */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** The height of the window. Directly passed to "height" property of the root element. */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Whether the window is focused. */
  focus: PropTypes.bool,
  /** The background color. Use 'none' for transparent background. */
  backgroundColor: PropTypes.string,
  /** Callback function fired when the close button is clicked. */
  onCloseClick: PropTypes.func,
  /** Callback function fired when the minimize button is clicked. */
  onMinimizeClick: PropTypes.func,
  /** Callback function fired when the maximize button is clicked. */
  onMaximizeClick: PropTypes.func,
  /** Callback function fired when the title bar is double clicked. */
  onToolbarDoubleClick: PropTypes.func,
  /** The main part of the toolbar. */
  toolbar: PropTypes.element,
  /** The sidebar component. */
  sidebar: PropTypes.element,
}

ToolbarWindow.defaultProps = {
  classNames: {},
  styles: {},
  width: 'fit-content',
  height: 'fit-content',
  focus: true,
  backgroundColor: 'white',
}

export default ToolbarWindow;