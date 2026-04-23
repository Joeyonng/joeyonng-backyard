import React, {forwardRef} from 'react';
import PropTypes from "prop-types";

import List from "../lists/List";
import MenuGroup from "./MenuGroup";
import MenuItem from "./MenuItem";

import './MenuList.scss';

const MenuList = forwardRef(function MenuList(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {size, width, ...rootProps} = curProps;

  return (
    <List
      ref={ref}
      {...rootProps}
      className="menu-list"
      style={{
        width: width,
      }}
    >
      {React.Children.toArray(children).filter(Boolean).map((item) => {
        if (item.type !== MenuItem || item.type !== MenuGroup) return item;

        const newProps = {}
        newProps['size'] = size;
        return React.cloneElement(item, newProps)
      })}
    </List>
  )
});

MenuList.propTypes = {
  /** Size of the menu item */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /** The width of the menu. */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

MenuList.defaultProps = {
  size: "small",
  width: "fit-content",
}

export default MenuList;
