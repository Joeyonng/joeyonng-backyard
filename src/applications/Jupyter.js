import React, {forwardRef, useRef, useState, Fragment} from "react";
import {useDispatch} from "react-redux";
import {usePrevious} from "react-use";
import JupyterViewer from "react-jupyter-notebook"
import {TitleBarWindow, Spinner, MenuBarButton, Menu, MenuList, MenuItem} from "react-big-sur";

import DragAndDrop from "../utils/DragAndDrop";
import {changeWindowData, pushNotification} from "../redux";

import * as style from "../style";
import "./Jupyter.scss";
import apps from "../apps";

const ERROR_HEADER = 'Error reading file';
const ERROR_CONTENT_PARSE = 'Error parsing the file content to Json format.';
const ERROR_CONTENT_READ = ''

function Jupyter(props, ref) {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    notebook: null,
  })
  const prevProps = usePrevious(props);

  let loading = false;
  if (!prevProps || prevProps.data.input !== props.data.input) {
    const parseJson = (rawIpynb) => {
      try {
        return JSON.parse(rawIpynb);
      } catch (error) {
        dispatch(pushNotification(props.appId, ERROR_HEADER, ERROR_CONTENT_PARSE, false))
        return undefined;
      }
    }

    if (typeof props.data.input === "string") {
      state.notebook = parseJson(props.data.input);
    }
    else if (props.data.input) {
      loading = true

      const reader = new FileReader();
      reader.readAsText(props.data.input, "UTF-8");
      reader.onload = (e) => {
        setState({...state, notebook: parseJson(e.target.result)});
      };
      reader.onerror = () => {
        dispatch(pushNotification(props.appId, ERROR_HEADER, ERROR_CONTENT_READ, false))
      };
    }
  }

  return (
    <TitleBarWindow
      ref={ref}
      width="100%"
      height="100%"
      focus={props.focus}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
      backgroundColor={style.white}
      title={apps[props.appId].name}
    >
      <DragAndDrop
        text="Drop here to open"
        onFileDropped={(file) => {
          dispatch(changeWindowData(props.appId, {input: file}))
        }}
      >

        {loading ? <div className="jupyter-blank"><Spinner/></div> :
          !state.notebook ?
            <div className="jupyter-blank">
              Drag .ipynb file here or use "File" menu to load a notebook
            </div> :
            <JupyterViewer
              rawIpynb={state.notebook}
              mediaAlign={props.settings.mediaAlign}
              displaySource={props.settings.displaySource}
              displayOutput={props.settings.displayOutput}
            />
        }
      </DragAndDrop>
    </TitleBarWindow>
  )
}

function JupyterMenu(props, ref) {
  const {appWindow, windowId, appId, ...rootProps} = props;
  const dispatch = useDispatch();

  const inputRef = useRef(null);
  return (
    <MenuBarButton
      label="File"
      {...rootProps}
    >
      <Menu>
        <MenuList>
          <MenuItem
            primary={"Upload"}
            onClick={() => {
              inputRef.current.click();
            }}
          />
          <input
            ref={inputRef}
            type="file"
            style={{display: "none"}}
            onChange={(event) => {
              dispatch(changeWindowData(windowId, {input: event.target.files[0]}))
            }}
          />
        </MenuList>
      </Menu>
    </MenuBarButton>
  )
}

Jupyter = forwardRef(Jupyter);
JupyterMenu = forwardRef(JupyterMenu);

export {Jupyter, JupyterMenu};