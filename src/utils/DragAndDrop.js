import React from "react";
import {useSpring, animated} from "react-spring";

import "./DragAndDrop.scss"

// Solve the bug
// https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element?page=1&tab=oldest#tab-top
let dragCounter = 0;

function DragAndDrop(props) {
  const [spring, springApi] = useSpring(() => ({
    opacity: 0,
  }))

  return (
    <div
      className="drag-and-drop"
      onDragEnter={(e) => {
        if (e.dataTransfer.types[0] === 'Files') {
          e.preventDefault();
          dragCounter = dragCounter + 1;

          if (dragCounter > 0) {
            springApi.start({opacity: 1})
          }
        }
      }}
      onDragLeave={(e) => {
        if (e.dataTransfer.types[0] === 'Files') {
          e.preventDefault();
          dragCounter = dragCounter - 1;

          if (dragCounter === 0) {
            springApi.start({opacity: 0})
          }
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        if (e.dataTransfer.types[0] === 'Files') {
          e.preventDefault();
          dragCounter = 0;

          springApi.start({opacity: 0})
          props.onFileDropped(e.dataTransfer.files[0]);
        }
      }}
    >
      <div className="drop-content">
        {props.children}
      </div>

      <animated.div
        className="drop-text-background"
        style={{
          opacity: spring.opacity,
        }}
      >
      </animated.div>

      <animated.div
        className="drop-text-content"
        style={{
          opacity: spring.opacity,
        }}
      >
        {props.text}
      </animated.div>
    </div>
  );
}

export default DragAndDrop;