import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import ListItem from "./ListItem";

import "./List.scss";

const List = forwardRef(function List(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {width, size, variant, noPadding, ...rootProps} = curProps;

  return (
    <div
      {...rootProps}
      ref={ref}
      className="list"
      style={{
        width: width,
        ...rootProps.style,
      }}
    >
      {React.Children.toArray(children).filter(Boolean).map((item) => {
        if (item.type !== ListItem) return item;

        let newProps = Object.assign({}, item.props);
        if (size) newProps['size'] = size;
        if (variant) newProps['variant'] = variant;
        if (noPadding) newProps['noPadding'] = noPadding;

        return React.cloneElement(item, newProps)
      })}
    </div>
  )
});

List.propTypes = {
  /** The width of the list. */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The size of the list items in the list. */
  size: PropTypes.oneOf(['large', 'medium', 'small', undefined]),
  /** Different variance of the list items highlight style in the list. */
  variant: PropTypes.oneOf(['primary', 'secondary', 'subdued', 'normal', 'disabled', undefined]),
  /** Whether add side paddings to list items in the list */
  noPadding: PropTypes.bool,
}

List.defaultProps = {
  width: "100%",
}

export default List;