import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import * as style from "../../style";
import './ListDivider.scss';

const ListDivider = forwardRef(function ListDivider(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {narrow} = curProps;

  return (
    <div
      ref={ref}
      className="list-divider"
      style={{
        margin: `${narrow ? 0 : style.space7} ${style.space4} ${narrow ? 0 : style.space7} ${style.space4}`,
      }}
    />
  )
});

ListDivider.propTypes = {
  /** Whether to remove the top and bottom margin of the divider. */
  narrow: PropTypes.bool,
}

ListDivider.defaultProps = {
  narrow: false,
}

export default ListDivider;

