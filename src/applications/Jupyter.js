import React, {useEffect, useRef, useState} from "react";
import JupyterViewer from "react-jupyter-notebook"

import {WindowBasic} from "../ui/Windows";
import DropUploader from "../ui/DropUploader";
import Spinner from "../ui/Spinner";

import "./Jupyter.scss";
import {useDispatch} from "react-redux";
import {changeSettings, pushNotification} from "../redux";

const appId = 1;
const ERROR_HEADER = 'Error reading file';
const ERROR_CONTENT_PARSE = 'Error parsing the file content to Json format.';
const ERROR_CONTENT_READ = ''

function Jupyter(props) {
  const dispatch = useDispatch()
  const [state, setState] = useState({})

  const prevPropsRef = useRef();
  useEffect(() => {
    const parseJson = (rawIpynb) => {
      try {
        const notebook = JSON.parse(rawIpynb);
        setState(state => ({...state, notebook: notebook}));
      }
      catch (error) {
        dispatch(pushNotification(props.appId, ERROR_HEADER, ERROR_CONTENT_PARSE, false))
      }
    }

    if (props.settings.input) {
      if (prevPropsRef.current === undefined || prevPropsRef.current.settings.input !== props.settings.input) {

        if (typeof props.settings.input === "string") {
          parseJson(props.settings.input);
          /*
          if (props.settings.notebook === null) {
            fetch(props.url).then(data => data.text()).then(text => {
              dispatch(changeSettings(1, {notebook: text}))
            });
          }
           */
        }
        else if (props.settings.input !== null) {
          setState(state => ({...state, loading: true}));

          const reader = new FileReader();
          reader.readAsText(props.settings.input, "UTF-8");
          reader.onload = (e) => {
            parseJson(e.target.result);
            setState(state => ({...state, loading: false}));
          };
          reader.onerror = () => {
            dispatch(pushNotification(props.appId, ERROR_HEADER, ERROR_CONTENT_READ, false))
          };
        }
        else {
          dispatch(pushNotification(props.appId, ERROR_HEADER, 'Invalid input type', false))
        }
      }
    }

    prevPropsRef.current = props;
  }, [dispatch, props]);

  return (
    <WindowBasic
      initial={{x: 100, y: 100, w: 960, h: 640}}
      firstTitle={props.name}
      enableResizing={true}
      hidden={props.hidden}
      focus={props.focus}
      zIndex={props.zIndex}
      border={props.border}
      onFocus={props.onFocus}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
    >
      <DropUploader
        text="Drop here to open"
        onFileDropped={(file) => {
          dispatch(changeSettings(appId, {input: file}))
        }}
      >

        {state.loading ? <div className="jupyter-blank"><Spinner/></div> :
          state.notebook === undefined ?
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
      </DropUploader>
    </WindowBasic>
  );
}

export default Jupyter;
