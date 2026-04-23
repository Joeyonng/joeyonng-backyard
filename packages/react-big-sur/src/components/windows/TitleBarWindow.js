import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import TrafficLights from "../traffic-lights/TrafficLights";

import "./TitleBarWindow.scss";
import * as style from "../../style";

const TitleBarWindow = forwardRef(function TitleBarWindow(props, ref) {
  const {classNames, styles, children, ...curProps} = props
  const {width, height, focus, backgroundColor, onCloseClick, onMinimizeClick, onMaximizeClick, onTitleBarDoubleClick,
    title,  ...rootProps} = curProps

  return (
    <div
      {...rootProps}
      ref={ref}
      className={clsx("title-bar-window", classNames['root'])}
      style={{
        width: width,
        height: height,
        boxShadow: focus ? style.shadow1 : "none",
        ...styles['root'],
      }}
    >
      <div
        className="title-bar"
        style={{
          filter: focus ? "none" : style.filterUnFocus,
          ...styles['title-bar']
        }}
        onDoubleClick={() => {
          if (onTitleBarDoubleClick) onTitleBarDoubleClick();
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
        <div>
          {title}
        </div>
      </div>

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

TitleBarWindow.propTypes = {
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
  onTitleBarDoubleClick: PropTypes.func,
  /** The title on the title bar */
  title: PropTypes.string,
}

TitleBarWindow.defaultProps = {
  classNames: {},
  styles: {},
  width: 'fit-content',
  height: 'fit-content',
  focus: true,
  backgroundColor: 'white',
}

export default TitleBarWindow;