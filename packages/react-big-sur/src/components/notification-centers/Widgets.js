import React, {forwardRef} from 'react';

import './Widgets.scss';

const Widgets = forwardRef(function Widgets(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {...rootProps} = curProps;

  return(
    <div
      {...rootProps}
      ref={ref}
      className="widgets"
    >
      {children}
    </div>
  )
});

Widgets.propTypes = {
}

Widgets.defaultProps = {
}

export default Widgets;
