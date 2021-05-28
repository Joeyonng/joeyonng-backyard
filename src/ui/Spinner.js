// https://codepen.io/jmak/pen/LsCet

import React from "react";
import "./Spinner.scss"

function Spinner(props) {
  return (
    <div className="overlay">
      <div
        className="spinner"
        style={{
          fontSize: props.size,
        }}
      >
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
        <div className="spinner-blade"/>
      </div>
    </div>
  )
}

export default Spinner