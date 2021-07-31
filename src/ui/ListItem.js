import React from "react";

import * as style from "../style";
import './ListItem.scss';

function TextItem(props) {
  return (
    <div className="text-item">
      {props.texts.map((text, index) => (
        <div
          key={index}
          className="text-item-row"
          style={{
            color: text.color ? text.color : style.black,
            fontSize: text.fontSize ? text.fontSize : "initial",
            fontStyle: text.fontStyle ? text.fontStyle : "normal",
            fontWeight: text.fontWeight ? text.fontWeight : "normal",
          }}
        >
          {text.value ? text.value : " "}
        </div>
      ))}
    </div>
  )
}

function ListItem(props) {
  const HEIGHTS = {
    'large': style.height5,
    'medium': style.height6,
    'small': style.height8,
  };
  const SPACES = {
    'large': style.space6,
    'medium': style.space7,
    'small': style.space7,
  }
  const FONTS = {
    'large': style.font4,
    'medium': style.font5,
    'small': style.font6,
  }

  let height = props.secondary ? style.height4 : HEIGHTS[props.size];
  let space = props.secondary ? style.space5 : SPACES[props.size];

  return (
    <div
      className="list-item"
      style={{
        height: height,
        padding: props.noPadding ? "0 0 0 0" : `0 ${style.space4} 0 ${style.space4}`,
        color: (props.highlight === 'secondary' || !props.highlight) ? style.black : style.white,
        backgroundColor: props.highlight ? (props.highlight === 'secondary' ? style.grey3 : style.blue) : style.transparent,
      }}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {!props.icon ? null :
        <div
          className="list-item-icon"
          style={{
            margin: `0 ${space} 0 0`,
          }}
        >
          {props.icon}
        </div>
      }

      <div className="list-item-main">
        <TextItem
          texts={[{
            value: props.primary,
            color: (props.highlight === 'secondary' || !props.highlight) ? style.black : style.white,
            fontSize: props.secondary ? style.font4 : FONTS[props.size],
            fontWeight: style.fontWeight4,
          }, ...(!props.secondary ? [] : [{
            value: props.secondary,
            color: (props.highlight === 'secondary' || !props.highlight) ? style.grey1 : style.white,
            fontSize: style.font6,
            fontWeight: style.fontWeight4,
          }])]}
        />
      </div>

      {!props.tail ? null :
        <div className="list-item-tail">
          {props.tail}
        </div>
      }
    </div>
  )
}

function ListDivider(props) {
  return (
    <div className="list-divider"/>
  )
}


export {TextItem, ListItem, ListDivider};