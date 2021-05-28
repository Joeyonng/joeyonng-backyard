import React from "react";

import './CircularBar.scss';

function CircularBar(props) {
  return (
    <div
      className="circular-bar"
      style={{
        margin: 0.04 * props.size,
      }}
    >
      <div
        className="icon"
        style={{
          width: props.size,
          height: props.size,
        }}
      >
        <svg
          className="circle"
          style={{
            width: props.size,
            height: props.size,
          }}
        >
          <circle
            cx="50%" cy="50%" r={props.size / 2}
            stroke='rgba(204, 204, 204, 0.7)'
            strokeWidth={0.08 * props.size}
          />
          <circle
            cx="50%" cy="50%" r={props.size / 2}
            stroke="green"
            strokeWidth={0.08 * props.size}
            strokeLinecap="round"
            strokeDasharray={`${props.progress * Math.PI * props.size}, ${Math.PI * props.size}`}
          />
        </svg>

        <div className="center">
          <div
            className="svg"
            style={{
              width: 0.5 * props.size,
              height: 0.5 * props.size,
              fontSize: 0.5 * props.size,
            }}
          >
            {props.children}
          </div>
        </div>
      </div>

      <div
        className="title"
        style={{
          marginTop: 0.25 * props.size,
          fontSize: 0.20 * props.size,
        }}
      >
        {props.label}
      </div>
    </div>
  )
}

export {CircularBar}