import React, {forwardRef} from "react";

import "./Controls.scss";

const Controls = forwardRef(function Controls(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {...rootProps} = curProps;

  return (
    <div
      {...rootProps}
      ref={ref}
      className="controls"
    >
      {React.Children.toArray(children).filter(Boolean).map((child) =>
        React.cloneElement(child)
      )}
    </div>
  )
});

Controls.propTypes = {

};

Controls.defaultProps = {

};

export default Controls;