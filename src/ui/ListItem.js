import React from "react";

import './ListItem.scss';

function ListItem(props) {
  return (
    <div className="list-item">
      {props.icon === undefined ? null :
        React.cloneElement(props.icon, {
          className: "list-item-icon"
        })
      }
      <div className="list-item-main">
        <div className="primary">
          {props.primary}
        </div>
        {props.secondary === undefined ? null :
          <div className="secondary">
            {props.secondary}
          </div>
        }
      </div>
      <div className="list-item-tail">
        {props.tail}
      </div>
    </div>
  )
}

export default ListItem;