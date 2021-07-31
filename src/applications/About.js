import React, {useRef, useState} from "react";
import {ArrowRight} from "react-feather";

import {SidebarWindow} from "../ui/Windows";
import {ListItem} from "../ui/ListItem";
import {TabPanel, TabPanels, Tab, Tabs} from "../ui/Tabs";

import "./About.scss";
import * as style from "../style";
import JoeyonngIcon from "../media/icons/joeyonng.png";
import BigSurIcon from "../media/icons/big-sur.png";
import GeiselPencilTop from "../media/images/Geisel-pencil-top.png";
import ReactIcon from "../media/icons/react.svg";
import CreateReactAppIcon from "../media/icons/create-react-app.svg";
import ReactSpringIcon from "../media/icons/react-spring.png";
import SassIcon from "../media/icons/sass.svg";
import FigmaIcon from "../media/icons/figma.svg";

function About(props) {
  const [state, setState] = useState({
    selected_index: 0,
  });

  let aboutRef = useRef(null);
  return (
    <SidebarWindow
      ref={aboutRef}
      initial={{x: 100, y: 100, w: 800, h: 600 + style.rmPx(style.toolbarHeight)}}
      zIndex={props.zIndex}
      border={props.border}
      focus={props.focus}
      onFocus={props.onFocus}
      enableResizing={false}
      windowState={props.windowState}
      onWindowStateChange={props.onWindowStateChange}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
      backgroundColor={style.white}
      toolbar={
        <Tabs
          selected_index={state.selected_index}
          onChange={(index) => {
            setState({...state, selected_index: index})
            aboutRef.current.animate({
              w: 800,
              h: [600, 240, 560][index] + style.rmPx(style.toolbarHeight)
            })
          }}
        >
          <Tab>What's Up</Tab>
          <Tab>Who is it</Tab>
          <Tab>Why Big Sur</Tab>
        </Tabs>
      }
    >
      <TabPanels selected_index={state.selected_index}>
        <TabPanel>
          <div className="about-col" style={{justifyContent: "space-between", backgroundColor: style.white}}>
            <div>
              <div style={{margin: "32px 0 0 0", fontWeight: "bold", fontSize: "48px"}}>
                Hi there,
              </div>
              <div style={{fontWeight: "lighter", fontSize: "32px"}}>
                Welcome to my backyard!
              </div>
              <div style={{margin: "0 0 32px 0", color: style.grey2}}>
                (another banal personal website)
              </div>
              <div style={{margin: "16px 0 0 0", fontSize: "24px"}}>
                I made this place to share my <span style={{color: style.blue}}>ideas</span> and <span style={{color: style.red}}>passions</span>.
              </div>
              <div style={{color: style.grey2}}>
                (or just to escape from my daily tedious work)
              </div>
              <div style={{margin: "16px 0 0 0", fontSize: "24px"}}>
                So please explore here <span style={{color: style.green}}>however</span> you want!
              </div>
              <div style={{color: style.grey2}}>
                (as long as you don't break anything)
              </div>
              <div style={{margin: "16px 0 0 0", fontSize: "24px"}}>
                If you have used Mac before, I think you will <span style={{color: style.orange}}>love</span> it.
              </div>
              <div style={{color: style.grey2}}>
                (I don't use Mac, I still love it)
              </div>
            </div>
            <img style={{width: "100%"}} src={GeiselPencilTop} alt=""/>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="about-row" style={{fontSize: 16, backgroundColor: style.white}}>
            <div className="left">
              <img src={JoeyonngIcon} alt=""/>
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
        </TabPanel>

        <TabPanel>
          <div className="about-col" style={{backgroundColor: style.white}}>
            <div className="about-row">
              <div className="left"><img src={BigSurIcon} style={{height: 200, width: 200}} alt=""/></div>
              <div className="right">
                <div style={{margin: "0 0 0 0", color: style.black, fontSize: "20px", fontWeight: "normal"}}>
                  This site is trying to mimic the UI of macOS Big Sur.
                </div>
                <div style={{margin: "0 0 12px 0", color: style.grey2, fontSize: "16px", fontWeight: "lighter"}}>
                  (in case you haven't noticed)
                </div>
                <div style={{margin: "0 0 0 0", color: style.black, fontSize: "20px", fontWeight: "normal"}}>
                  I always appreciate the design of macOS.
                </div>
                <div style={{margin: "0 0 12px 0", color: style.grey2, fontSize: "16px", fontWeight: "lighter"}}>
                  (but I never owned any macOS device)
                </div>
                <div style={{margin: "0 0 0 0", color: style.black, fontSize: "20px", fontWeight: "normal"}}>
                  This site is still in an early development.
                </div>
                <div style={{margin: "0 0 0 0", color: style.grey2, fontSize: "16px", fontWeight: "lighter"}}>
                  (but I already got lots of joys)
                </div>
              </div>
            </div>
            <div
              style={{
                width: "90%",
                height: 480,
                margin: "0 0 24px 0",
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
                    <ArrowRight/>
                  </a>
                }
              />
              <ListItem
                icon={<img src={CreateReactAppIcon} style={{height: 32, width: 32}} alt=""/>}
                primary="Scaffolding:"
                secondary="This project was bootstrapped with Create React App."
                tail={
                  <a href="https://create-react-app.dev/" target="_blank" rel="noreferrer">
                    <ArrowRight/>
                  </a>
                }
              />
              <ListItem
                icon={<img src={ReactSpringIcon} style={{height: 32, width: 32}} alt=""/>}
                primary="Animations:"
                secondary="Most is done using React Spring and others are vanilla CSS animations."
                tail={
                  <a href="https://create-react-app.dev/" target="_blank" rel="noreferrer">
                    <ArrowRight/>
                  </a>
                }
              />
              <ListItem
                icon={<img src={SassIcon} style={{height: 32, width: 32}} alt=""/>}
                primary="Styling:"
                secondary="Static Sass and dynamic inline styles."
                tail={
                  <a href="https://sass-lang.com/" target="_blank" rel="noreferrer">
                    <ArrowRight/>
                  </a>
                }
              />
              <ListItem
                icon={<img src={FigmaIcon} style={{height: 32, width: 32}} alt=""/>}
                primary="Design Reference:"
                secondary="This awesome Figma UI kit and my girlfriend's 2015 Macbook Air."
                tail={
                  <a href="https://products.ls.graphics/macos/" target="_blank" rel="noreferrer">
                    <ArrowRight/>
                  </a>
                }
              />
            </div>
          </div>
        </TabPanel>

      </TabPanels>
    </SidebarWindow>
  );
}

export default About;
