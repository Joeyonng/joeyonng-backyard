import React, {forwardRef} from "react";
import PropTypes from "prop-types";

import * as style from "../../style";
import './ListItem.scss';

const SIZES = {
  'large': {
    height: style.length5,
    space: style.space6,
    font: style.font4,
    iconSize: style.length7,
  },
  'medium': {
    height: style.length6,
    space: style.space7,
    font: style.font5,
    iconSize: style.length11,
  },
  'small': {
    height: style.length9,
    space: style.space7,
    font: style.font6,
    iconSize: style.length11,
  }
}

const VARIANTS = {
  'primary': {
    color: style.white,
    primaryColor: style.white,
    secondaryColor: style.white,
    backgroundColor: style.blue,
  },
  'secondary': {
    color: undefined,
    primaryColor: style.black,
    secondaryColor: style.grey1,
    backgroundColor: style.grey2,
  },
  'subdued': {
    color: undefined,
    primaryColor: style.black,
    secondaryColor: style.grey1,
    backgroundColor: style.grey3,
  },
  'normal': {
    color: undefined,
    primaryColor: style.black,
    secondaryColor: style.grey1,
    backgroundColor: style.transparent,
  },
  'disabled': {
    color: undefined,
    primaryColor: style.grey1,
    secondaryColor: style.grey1,
    backgroundColor: style.transparent,
  },
}

const ListItem = forwardRef(function ListItem(props, ref) {
  const {classNames, styles, children, ...curProps} = props;
  const {size, variant, noPadding, primary, secondary, icon, tail, primaryWeight, disabled, ...rootProps} = curProps;

  return (
    <div
      {...rootProps}
      ref={ref}
      className="list-item"
      style={{
        height: secondary ? style.length4 : SIZES[size].height,
        padding: noPadding ? "0 0 0 0" : `0 ${style.space4} 0 ${style.space4}`,
        color: VARIANTS[variant].color,
        backgroundColor: VARIANTS[variant].backgroundColor,
        pointerEvents: disabled ? "none" : "initial",
      }}
    >
      {!icon ? null :
        <div
          className="list-item-icon"
          style={{
            margin: `0 ${secondary ? style.space5 : SIZES[size].space} 0 0`,
            pointerEvents: disabled ? "none" : "initial",
          }}
        >
          {React.Children.toArray(icon).filter(Boolean).map((item) =>
            React.cloneElement(item, {
              style: {
                width: secondary ? style.length7 : SIZES[size].iconSize,
                height: secondary ? style.length7 : SIZES[size].iconSize,
              }
            })
          )}
        </div>
      }

      <div
        className="list-item-main"
        style={{
          pointerEvents: disabled ? "none" : "initial",
        }}
      >
        <div
          className="text-item-row"
          style={{
            color: VARIANTS[variant].primaryColor,
            fontSize: secondary ? style.font4 : SIZES[size].font,
            fontWeight: {bold: style.fontWeight1, normal: style.fontWeight2, thin: style.fontWeight3}[primaryWeight],
          }}
        >
          {primary}
        </div>

        {!secondary ? null :
          <div
            className="text-item-row"
            style={{
              color: VARIANTS[variant].secondaryColor,
              fontSize: style.font6,
            }}
          >
            {secondary}
          </div>
        }
      </div>

      {!tail ? null :
        <div
          className="list-item-tail"
          style={{
            pointerEvents: disabled ? "none" : "initial",
          }}
        >
          {tail}
        </div>
      }
    </div>
  )
});

ListItem.propTypes = {
  /** The size of the list item. */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  /** The variant of the list item style. */
  variant: PropTypes.oneOf(['primary', 'secondary', 'subdued', 'normal', 'disabled']),
  /** Whether add side paddings to this list item */
  noPadding: PropTypes.bool,
  /** Primary text of the list item. */
  primary: PropTypes.string,
  /** Secondary text of the list item. */
  secondary: PropTypes.string,
  /** Front icon of the list item. */
  icon: PropTypes.node,
  /** Tail of the list item */
  tail: PropTypes.node,
  /** The font weight of the primary text. */
  primaryWeight: PropTypes.oneOf(['bold', 'normal', 'thin']),
  /** If True, the listItem is disabled. */
  disabled: PropTypes.bool,
}

ListItem.defaultProps = {
  size: 'medium',
  variant: 'normal',
  noPadding: false,
  primaryWeight: 'normal',
  disabled: false,
}

export default ListItem;