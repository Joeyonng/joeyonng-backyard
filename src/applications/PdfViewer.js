import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Page} from 'react-pdf';
import {Document} from 'react-pdf/dist/esm/entry.webpack';

import {changeAppData} from "../redux";
import {WindowBasic} from "../ui/Windows";
import DragAndDrop from "../ui/DragAndDrop";

const appId = 2;

function PdfViewer (props) {
  const [state, setState] = useState({numPages: null, pageNumber: 1});
  const reduxState = useSelector(state => state);
  const dispatch = useDispatch();

  return (
    <WindowBasic
      initial={{x: 100, y: 100, w: 960, h: 640}}
      firstTitle={props.name}
      enableResizing={true}
      hidden={props.hidden}
      focus={props.focus}
      zIndex={props.zIndex}
      onFocus={props.onFocus}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
    >
      <DragAndDrop
        text="Drop here to open"
        onFileDropped={(file) => {
          dispatch(changeAppData(appId, {input: file}))
        }}
      >
        <Document
          file={reduxState.settings[appId].input}
          onLoadSuccess={(numPages) => {
            setState({...state, numPages})
          }}
        >
          <Page
            pageNumber={state.pageNumber}
            onGetAnnotationsSuccess={(annotations) => {
              console.log(annotations)
            }}
          />
        </Document>
      </DragAndDrop>
    </WindowBasic>
  )
}

export default PdfViewer;