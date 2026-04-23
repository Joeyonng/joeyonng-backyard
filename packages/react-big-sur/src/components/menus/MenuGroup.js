import React, {forwardRef, useState} from 'react';
import PropTypes from "prop-types";
import {Check} from "react-feather";

import MenuItem from "./MenuItem";

import './MenuGroup.scss';

const MenuGroup = forwardRef(function MenuGroup(props, ref) {
  const {size, ...publicProps} = props;
  const {classNames, styles, children, ...curProps} = publicProps;
  const {variant, checkIcon, defaultIndices, ...rootProps} = curProps;

  const hasIcon = React.Children.toArray(children).filter(child => child.props.icon !== undefined).length > 0;
  const [state, setState] = useState({
    selectedIndices: defaultIndices ? defaultIndices : [],
  })

  return (
    <div
      {...rootProps}
      ref={ref}
    >
      {React.Children.toArray(children).filter(Boolean).map((item, index) => {
        if (item.type !== MenuItem) return item;

        let newProps = Object.assign({}, item.props);
        newProps['size'] = size;
        if (variant === 'select' || variant === 'check') {
          newProps['icon'] = !state.selectedIndices.includes(index) ? <div/> : checkIcon;
        }
        else if (item.props.icon === undefined) {
          if (variant === 'indent' || (variant === 'auto' && hasIcon)) newProps['icon'] = <div/>;
        }

        return (
          <div
            key={index}
            onClick={() => {
              let newSelectedIndices = [...state.selectedIndices];
              if (variant === 'indent') newSelectedIndices = [];
              else if (variant === 'select') newSelectedIndices = [index];
              else {
                const contain = newSelectedIndices.indexOf(index);
                if (contain !== -1) newSelectedIndices.splice(contain, 1);
                else newSelectedIndices.push(index);
              }
              setState({...state, selectedIndices: newSelectedIndices});
            }}
          >
            {React.cloneElement(item, newProps)}
          </div>
        )
      })}
    </div>
  );
});

MenuGroup.propTypes = {
  /** The variant of how menu item is selected */
  variant: PropTypes.oneOf(['auto', 'indent', 'select', 'check']),
  /** The icon of the checkmark of the menu items */
  checkIcon: PropTypes.node,
  /** Default selected indices of the menu items */
  defaultIndices: PropTypes.arrayOf(PropTypes.number),
}

MenuGroup.defaultProps = {
  variant: 'auto',
  checkIcon: <Check/>
}

export default MenuGroup;