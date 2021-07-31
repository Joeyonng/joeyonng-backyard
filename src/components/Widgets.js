import React, {useEffect, useRef, useState} from 'react';
import {useSpring, animated, useTransition} from "react-spring";
import {Coffee, Smile} from "react-feather";
import {Javascript, CssThree, ReactJs,NodeDotJs, Java, Cplusplus, Android, Python, Pytorch, Numpy, ScikitLearn} from "@icons-pack/react-simple-icons"

import apps from "../apps";
import Clock from "../ui/Clock";
import Notification from "../ui/Notification";
import {Button} from "../ui/Buttons";
import {CircularBar} from "../ui/CircularBar";
import {ListItem} from "../ui/ListItem";

import * as style from "../style";
import './Widgets.scss';
import geiselSun from "../media/images/Geisel-sun.jpg";
import geiselCloud from "../media/images/Geisel-cloud.jpg";

const SIZES = {
  large: "345px",
  medium: "155px",
};

function TitleWidget(props) {
  return (
    <div className="widget title-widget">
      {props.children}
    </div>
  )
}

function ImageWidget(props) {
  return (
    <div
      className="widget image-widget"
      style={{
        height: SIZES[props.size],
        backgroundImage: `url(${props.image})`,
      }}
    >
      <div
        className="widget-title"
        style={{
          top: props.position.vertical === 'top' ? style.space3 : "auto",
          bottom: props.position.vertical === 'bottom' ? style.space3 : "auto",
          left: props.position.horizontal === 'left' ? style.space5 : "auto",
          right: props.position.horizontal === 'right' ? style.space5 : "auto",
          textAlign: props.position.horizontal,
        }}
      >
        {props.children}
      </div>
    </div>
  )
}

function GridWidget(props) {
  return (
    <div
      className="widget grid-widget"
      style={{
        height: props.size === undefined ? "initial" : SIZES[props.size],
      }}
    >
      <div className="widget-title">
        {props.title}
      </div>

      <div className="widget-content">
        {React.Children.map(props.children, (item) => (
          item
        ))}
      </div>
    </div>
  )
}

function ListWidget(props) {
  return (
    <div
      className="widget list-widget"
      style={{
        height: props.size === undefined ? "initial" : SIZES[props.size],
      }}
    >
      <div className="widget-title">
        {props.title}
      </div>

      <div className="widget-content">
        {React.Children.map(props.children, (item, index) => (
          <React.Fragment>
            {item}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function Widgets(props) {
  const [state, setState] = useState({
    open: false,
    animatedOpen: false,
  })

  const ref = useRef(null);
  const widgetsRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!props.widgetsLock && ref.current && !ref.current.contains(e.target)) {
        setState({...state, open: false})
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  const spring = useSpring({
    translateX: state.open ? "0px" : style.widgetsWidth,
    onRest: {
      translateX: () => {
        setState({...state, animatedOpen: state.open})
        if (!state.open && widgetsRef.current) {
          widgetsRef.current.scrollTop = 0;
        }
      },
    }
  });
  const notificationsMap = new WeakMap();
  const transitions = useTransition(Object.values(props.notifications), {
    key: (item) => item.notificationId,
    from: {x: style.widgetsWidth, y: "0px"},
    enter: item => async (next) => {
      const ref = notificationsMap.get(item);
      await next({x: "0px", y: `${ref.offsetHeight}px`})
    },
    leave: () => {
      return {x: style.widgetsWidth, y: "0px"};
    },
  });

  return(
    <div ref={ref}>
      <Button
        size="medium"
        onClick={() => {
          setState({...state, open: !state.open})
        }}
      >
        <Clock/>
      </Button>

      <animated.div
        className="widgets-background"
        style={{
          transform: spring.translateX.to(x => `translateX(${x})`)
        }}
      />

      <div
        ref={widgetsRef}
        className="widgets-container"
        style={{
          overflow: state.animatedOpen ? "scroll" : "visible",
          pointerEvents: state.animatedOpen ? "auto" : "none",
        }}
      >
        {transitions((spring, item) => (
          <animated.div
            className="notifications"
            style={{
              height: spring.y,
              transform: spring.x.to(x => `translateX(${x})`),
            }}
          >
            <div ref={(ref) => ref && notificationsMap.set(item, ref)}>
              <div className="notification-margin"/>
              <Notification
                headerIcon={apps[item.appId].icon}
                header={apps[item.appId].name}
                primary={item.header}
                secondary={item.content}
                persistent={item.persistent}
                notificationId={item.notificationId}
              />
            </div>
          </animated.div>
        ))}

        <animated.div
          className="widgets"
          style={{
            transform: spring.translateX.to(x => `translateX(${x})`),
          }}
        >
          <TitleWidget>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Smile/><div>Me</div><Coffee/>
            </div>
          </TitleWidget>

          <TitleWidget>Education</TitleWidget>
          <ImageWidget
            size="medium"
            image={geiselSun}
            position={{vertical: 'top', horizontal: 'left'}}
          >
            <div>BS/MS in Computer Science</div>
            <div>UCSD, 2015-2020</div>
          </ImageWidget>
          <ImageWidget
            size="medium"
            image={geiselCloud}
            position={{vertical: 'bottom', horizontal: 'left'}}
          >
            <div>PhD in Computer Engineering</div>
            <div>UCSD, 2020-current</div>
          </ImageWidget>

          <TitleWidget>Skills</TitleWidget>
          <GridWidget size="medium" title="Machine Learning">
            <CircularBar
              label="Python"
              size={style.rmPx(style.height3)}
              progress={0.9}
            >
              <Python/>
            </CircularBar>
            <CircularBar
              label="PyTorch"
              size={style.rmPx(style.height3)}
              progress={0.75}
            >
              <Pytorch/>
            </CircularBar>
            <CircularBar
              label="Numpy"
              size={style.rmPx(style.height3)}
              progress={0.8}
            >
              <Numpy/>
            </CircularBar>
            <CircularBar
              label="Scikit-learn"
              size={style.rmPx(style.height3)}
              progress={0.85}
            >
              <ScikitLearn/>
            </CircularBar>
          </GridWidget>
          <GridWidget
            size="medium"
            title="Web Development"
          >
            <CircularBar
              label="Javascript"
              size={style.rmPx(style.height3)}
              progress={0.9}
            >
              <Javascript/>
            </CircularBar>
            <CircularBar
              label="CSS3"
              size={style.rmPx(style.height3)}
              progress={0.9}
            >
              <CssThree/>
            </CircularBar>
            <CircularBar
              label="React"
              size={style.rmPx(style.height3)}
              progress={0.9}
            >
              <ReactJs/>
            </CircularBar>
            <CircularBar
              label="NodeJs"
              size={style.rmPx(style.height3)}
              progress={0.7}
            >
              <NodeDotJs/>
            </CircularBar>
          </GridWidget>
          <GridWidget
            size="medium"
            title="Software Development"
          >
            <CircularBar
              label="Java"
              size={style.rmPx(style.height3)}
              progress={0.7}
            >
              <Java/>
            </CircularBar>

            <CircularBar
              label="C++"
              size={style.rmPx(style.height3)}
              progress={0.3}
            >
              <Cplusplus/>
            </CircularBar>
            <CircularBar
              label="Android"
              size={style.rmPx(style.height3)}
              progress={0.4}
            >
              <Android/>
            </CircularBar>
          </GridWidget>

          <TitleWidget>Experiences</TitleWidget>
          <ListWidget title="Professional Experiences">
            <ListItem
              primary="Data Analyst"
              secondary="David Kleinfeld Laboratory"
              tail="12/2020"
            />
            <ListItem
              primary="IT Student Worker"
              secondary="ECE, UCSD"
              tail="03/2020"
            />
            <ListItem
              primary="Software Engineering Intern"
              secondary="Inspur International"
              tail="09/2017"
            />
          </ListWidget>
          <ListWidget title="Academic Experiences">
            <ListItem
              primary="Graduate Student Researcher"
              secondary="ECE, UCSD"
              tail="Present"
            />
            <ListItem
              primary="Teaching Assistant"
              secondary="CSE, UCSD"
              tail="03/2020"
            />
            <ListItem
              primary="Research Assistant"
              secondary="ECE, UCSD"
              tail="03/2019"
            />
          </ListWidget>
        </animated.div>
      </div>
    </div>
  )
}

export default Widgets;
