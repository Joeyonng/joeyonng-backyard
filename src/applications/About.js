import React from "react";
import {ArrowRight} from "react-feather";

import {WindowWithTabs, WindowTab} from "../ui/Windows";
import ListItem from "../ui/ListItem";
import {Button} from "../ui/Buttons";

import "./About.scss";
import * as style from "../style"
import appStore from "../images/app-store.png";
import BigSurIcon from "../images/big-sur.png"
import GeiselPencilTop from "../images/Geisel-pencil-top.png";
import ReactIcon from "../images/react.svg";
import CreateReactAppIcon from "../images/create-react-app.svg";
import ReactSpringIcon from "../images/react-spring.png";
import SassIcon from "../images/sass.svg";
import FigmaIcon from "../images/figma.svg";

// const appId = 0;

function About(props) {
  return (
    <WindowWithTabs
      initial={{x: 140, y: 140}}
      firstTitle={props.name}
      hidden={props.hidden}
      focus={props.focus}
      zIndex={props.zIndex}
      border={props.border}
      onFocus={props.onFocus}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
    >
      <WindowTab
        width={800}
        height={600}
        label={"What's Up"}
      >
        <div className="about-col" style={{justifyContent: "space-between"}}>
          <div>
            <div style={{margin: "32px 0 0 0", fontWeight: "bold", fontSize: "48px"}}>
              Hi there,
            </div>
            <div style={{fontWeight: "lighter", fontSize: "32px"}}>
              Welcome to my backyard!
            </div>
            <div style={{margin: "0 0 32px 0", color: style.grey4}}>
              (another banal personal website)
            </div>
            <div style={{margin: "16px 0 0 0", fontSize: "24px"}}>
              I made this place to share my <span style={{color: style.blue}}>ideas</span> and <span style={{color: style.red}}>passions</span>.
            </div>
            <div style={{color: style.grey4}}>
              (or just to escape from my daily tedious work)
            </div>
            <div style={{margin: "16px 0 0 0", fontSize: "24px"}}>
              So please explore here <span style={{color: style.green}}>however</span> you want!
            </div>
            <div style={{color: style.grey4}}>
              (as long as you don't break anything)
            </div>
            <div style={{margin: "16px 0 0 0", fontSize: "24px"}}>
              If you have used Mac before, I think you will <span style={{color: style.orange}}>love</span> it.
            </div>
            <div style={{color: style.grey4}}>
              (I don't use Mac, I still love it)
            </div>
          </div>
          <img style={{width: "100%"}} src={GeiselPencilTop} alt=""/>
        </div>
      </WindowTab>

      <WindowTab
        width={800}
        height={240}
        label={"Who is it"}
      >
        <div className="about-row" style={{fontSize: 16}}>
          <div className="left">
            <img src={appStore} alt=""/>
          </div>
          <div className="right">
            <div>
              <span style={{fontSize: 28, fontWeight: "bold", margin: "0 16px 0 0"}}>
                Litao Qiao
              </span>
              <span style={{fontSize: 28}}>
                乔 立涛
              </span>
              <div style={{fontWeight: "lighter"}}>@Joeyonng</div>
            </div>
            <ul style={{listStyleType: "none", paddingLeft: 0, lineHeight: "1.8"}}>
              <li>1st year Phd Student in ECE department at UCSD.</li>
              <li>Proud to be advised by Prof. Bill Lin!</li>
              <li>Finished BS/MS program at UCSD in CSE department in June 2020.</li>
            </ul>
          </div>
        </div>
      </WindowTab>
      <WindowTab
        width={800}
        height={560}
        label={"Why Big Sur"}
      >
        <div className="about-col">
          <div className="about-row">
            <div className="left"><img src={BigSurIcon} style={{height: 200, width: 200}} alt=""/></div>
            <div className="right">
              <div style={{margin: "0 0 0 0", color: style.black, fontSize: "20px", fontWeight: "normal"}}>
                This site is trying to mimic the UI of macOS Big Sur.
              </div>
              <div style={{margin: "0 0 12px 0", color: style.grey4, fontSize: "16px", fontWeight: "lighter"}}>
                (in case you haven't noticed)
              </div>
              <div style={{margin: "0 0 0 0", color: style.black, fontSize: "20px", fontWeight: "normal"}}>
                I always appreciate the design of macOS.
              </div>
              <div style={{margin: "0 0 12px 0", color: style.grey4, fontSize: "16px", fontWeight: "lighter"}}>
                (but I never owned any macOS device)
              </div>
              <div style={{margin: "0 0 0 0", color: style.black, fontSize: "20px", fontWeight: "normal"}}>
                This site is still in an early development.
              </div>
              <div style={{margin: "0 0 0 0", color: style.grey4, fontSize: "16px", fontWeight: "lighter"}}>
                (but I already got lots of joys)
              </div>
            </div>
          </div>
          <div
            style={{
              width: "90%",
              height: 480,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <ListItem
              icon={<img src={ReactIcon} style={{height: 32, width: 32}} alt=""/>}
              primary="Framework:"
              secondary="Single-page-application (SPA) developed using React and Redux."
              tail={
                <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
                  <Button><ArrowRight/></Button>
                </a>
              }
            />
            <ListItem
              icon={<img src={CreateReactAppIcon} style={{height: 32, width: 32}} alt=""/>}
              primary="Scaffolding:"
              secondary="This project was bootstrapped with Create React App."
              tail={
                <a href="https://create-react-app.dev/" target="_blank" rel="noreferrer">
                  <Button><ArrowRight/></Button>
                </a>
              }
            />
            <ListItem
              icon={<img src={ReactSpringIcon} style={{height: 32, width: 32}} alt=""/>}
              primary="Animations:"
              secondary="Most is done using React Spring and others are vanilla CSS animations."
              tail={
                <a href="https://create-react-app.dev/" target="_blank" rel="noreferrer">
                  <Button><ArrowRight/></Button>
                </a>
              }
            />
            <ListItem
              icon={<img src={SassIcon} style={{height: 32, width: 32}} alt=""/>}
              primary="Styling:"
              secondary="Static Sass and dynamic inline styles."
              tail={
                <a href="https://sass-lang.com/" target="_blank" rel="noreferrer">
                  <Button><ArrowRight/></Button>
                </a>
              }
            />
            <ListItem
              icon={<img src={FigmaIcon} style={{height: 32, width: 32}} alt=""/>}
              primary="Design Reference:"
              secondary="This awesome Figma UI kit and my girlfriend's 2015 Macbook Air."
              tail={
                <a href="https://www.figma.com/community/file/949158727443209284" target="_blank" rel="noreferrer">
                  <Button><ArrowRight/></Button>
                </a>
              }
            />
          </div>
        </div>
      </WindowTab>
    </WindowWithTabs>
  );
}

export default About;
