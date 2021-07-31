import React, {useEffect, useState} from "react";
import {useMeasure} from "react-use";
import {useSpring, animated, config} from "react-spring";
import {ChevronDown, ChevronRight} from "react-feather";

import {Spinner} from "./Spinner";

import * as style from "../style";
import "./DropdownList.scss";

function List(props) {
  return (
    <div>
      {React.Children.map(props.children, item => (
        React.cloneElement(item, {
          height: props.height
        })
      ))}
    </div>
  )
}

function DropdownList(props) {
  const [state, setState] = useState({
    open: true,
    headerHover: false,
    contentHeight: 0,
  });

  const [contentRef, {height}] = useMeasure()

  const spring = useSpring({
    contentHeight: state.open ? state.contentHeight : 0,
    config: config.stiff,
  })

  useEffect(() => {
    setState(state => ({...state, contentHeight: height}));
  }, [height]);

  return (
    <div className="dropdown-list">
      <div
        className="dropdown-header"
        onMouseEnter={() => {
          setState({...state, headerHover: true})
        }}
        onMouseLeave={() => {
          setState({...state, headerHover: false})
        }}
      >
        <div className="dropdown-title">
          {props.title}
        </div>

        <div className="dropdown-tail">
          {props.loading ? <Spinner size={style.icon1}/> :
            <div
              style={{
                visibility: state.headerHover ? 'visible' : 'hidden',
              }}
              onClick={() => {
                setState({...state, open: !state.open})
              }}
            >
              {state.open ? <ChevronDown size={style.icon1}/> : <ChevronRight size={style.icon1}/>}
            </div>
          }
        </div>
      </div>

      <animated.div
        className="dropdown-content-container"
        style={{
          height: spring.contentHeight,
        }}
      >
        <animated.div
          ref={contentRef}
          style={{
            transform: spring.contentHeight.to(x => `translateY(${-(state.contentHeight - x)}px)`),
          }}
        >
          {props.children}
        </animated.div>
      </animated.div>
    </div>
  )
}

export {List, DropdownList};