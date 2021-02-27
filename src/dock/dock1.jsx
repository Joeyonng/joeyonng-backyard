import React from "react";
import DockItem from "./dock-item";
import DockBackground from "./dock-background";
import DockOffset from "./dock-offset";

export default function(props) {
  React.Children.forEach(props.children, item => {
    if (item.type !== DockItem) throw new Error("Invalid child type.");
  });

  let style = Object.assign({
    display: "grid",
    gridTemplateColumns: props.itemWidths.map(() => "auto").join(" "),
    position: "relative",
  }, (() => {
    switch (props.magnifyDirection) {
      case "up": return { alignItems: "end", };
      case "down": return { alignItems: "start", };
      case "center": return { alignItems: "center", };
    }
  })());

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto",
      }}
    >
      <DockOffset
        width={props.offsetLeft}
        height={props.height}
        magnifyDirection={props.magnifyDirection}
        debug={props.debug}
      />
      <div style={style}>
        {React.Children.map(props.children, (item, index) => (
          React.cloneElement(item, {size: props.itemWidths[index], debug: props.debug})
        ))}

        <DockBackground
          className={props.backgroundClassName}
          height={props.height}
          magnifyDirection={props.magnifyDirection}
          debug={props.debug}
        />
      </div>
      <DockOffset
        width={props.offsetRight}
        height={props.height}
        magnifyDirection={props.magnifyDirection}
        debug={props.debug}
      />
    </div>
  );
}
