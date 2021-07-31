import React, {useState} from "react";
import {usePrevious} from "react-use";
import JupyterViewer from "react-jupyter-notebook"

import {TitleBarWindow} from "../ui/Windows";
import DragAndDrop from "../ui/DragAndDrop";
import {Spinner} from "../ui/Spinner";
import {useDispatch} from "react-redux";
import {changeAppData, changeSettings, pushNotification} from "../redux";

import * as style from "../style";
import "./Jupyter.scss";

const ERROR_HEADER = 'Error reading file';
const ERROR_CONTENT_PARSE = 'Error parsing the file content to Json format.';
const ERROR_CONTENT_READ = ''

function Jupyter(props) {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    notebook: null,
  })
  const prevProps = usePrevious(props);

  console.log(props.data)
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
      initial={{x: 100, y: 100, w: 960, h: 640}}
      zIndex={props.zIndex}
      border={props.border}
      focus={props.focus}
      onFocus={props.onFocus}
      enableResizing={true}
      windowState={props.windowState}
      onWindowStateChange={props.onWindowStateChange}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
      backgroundColor={style.white}
      title={props.name}
    >
      <DragAndDrop
        text="Drop here to open"
        onFileDropped={(file) => {
          dispatch(changeAppData(props.appId, {input: file}))
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
  );
}

export default Jupyter;
