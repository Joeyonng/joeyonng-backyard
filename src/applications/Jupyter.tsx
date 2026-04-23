import React, { forwardRef, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePrevious } from 'react-use';
import JupyterViewer from 'react-jupyter-notebook';
import { Menu, MenuBarButton, MenuItem, MenuList, Spinner, TitleBarWindow } from 'react-big-sur';

import apps from '../apps';
import { changeWindowData, pushNotification } from '../redux';
import * as style from '../style';
import DragAndDrop from '../utils/DragAndDrop';
import './Jupyter.scss';

const ERROR_HEADER = 'Error reading file';
const ERROR_CONTENT_PARSE = 'Error parsing the file content to Json format.';
const ERROR_CONTENT_READ = '';

const TitleBarWindowComponent = TitleBarWindow as any;
const SpinnerComponent = Spinner as any;
const MenuBarButtonComponent = MenuBarButton as any;
const MenuComponent = Menu as any;
const MenuListComponent = MenuList as any;
const MenuItemComponent = MenuItem as any;

type JupyterData = {
  input?: string | File;
};

type JupyterSettings = {
  mediaAlign: string;
  displaySource: string;
  displayOutput: string;
};

type JupyterProps = {
  appId: string;
  data: JupyterData;
  settings: JupyterSettings;
  focus: boolean;
  onCloseClick: () => void;
  onMinimizeClick: () => void;
  onMaximizeClick: () => void;
};

const Jupyter = forwardRef<any, JupyterProps>(function Jupyter(props, ref) {
  const dispatch = useDispatch();
  const [state, setState] = useState<{ notebook: unknown | null }>({
    notebook: null,
  });
  const prevProps = usePrevious(props);

  let loading = false;
  if (!prevProps || prevProps.data.input !== props.data.input) {
    const parseJson = (rawIpynb: string) => {
      try {
        return JSON.parse(rawIpynb);
      } catch (error) {
        dispatch(pushNotification(props.appId, ERROR_HEADER, ERROR_CONTENT_PARSE, false));
        return undefined;
      }
    };

    if (typeof props.data.input === 'string') {
      state.notebook = parseJson(props.data.input);
    } else if (props.data.input) {
      loading = true;

      const reader = new FileReader();
      reader.readAsText(props.data.input, 'UTF-8');
      reader.onload = (e) => {
        setState({ ...state, notebook: parseJson(String(e.target?.result ?? '')) });
      };
      reader.onerror = () => {
        dispatch(pushNotification(props.appId, ERROR_HEADER, ERROR_CONTENT_READ, false));
      };
    }
  }

  const appRegistry = apps as Record<string, { name: string }>;

  return (
    <TitleBarWindowComponent
      ref={ref}
      width="100%"
      height="100%"
      focus={props.focus}
      onCloseClick={props.onCloseClick}
      onMinimizeClick={props.onMinimizeClick}
      onMaximizeClick={props.onMaximizeClick}
      backgroundColor={style.white}
      title={appRegistry[props.appId].name}
    >
      <DragAndDrop
        text="Drop here to open"
        onFileDropped={(file) => {
          dispatch(changeWindowData(props.appId, { input: file }));
        }}
      >
        {loading ? (
          <div className="jupyter-blank">
            <SpinnerComponent />
          </div>
        ) : !state.notebook ? (
          <div className="jupyter-blank">Drag .ipynb file here or use "File" menu to load a notebook</div>
        ) : (
          <JupyterViewer
            rawIpynb={state.notebook}
            mediaAlign={props.settings.mediaAlign}
            displaySource={props.settings.displaySource}
            displayOutput={props.settings.displayOutput}
          />
        )}
      </DragAndDrop>
    </TitleBarWindowComponent>
  );
});

type JupyterMenuProps = {
  windowId: string;
  appId: string;
  appWindow?: unknown;
  [key: string]: unknown;
};

const JupyterMenu = forwardRef<any, JupyterMenuProps>(function JupyterMenu(props, ref) {
  const { appWindow, windowId, appId, ...rootProps } = props;
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <MenuBarButtonComponent label="File" ref={ref} {...rootProps}>
      <MenuComponent>
        <MenuListComponent>
          <MenuItemComponent
            primary="Upload"
            onClick={() => {
              if (inputRef.current) inputRef.current.click();
            }}
          />
          <input
            ref={inputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) dispatch(changeWindowData(windowId, { input: file }));
            }}
          />
        </MenuListComponent>
      </MenuComponent>
    </MenuBarButtonComponent>
  );
});

export { Jupyter, JupyterMenu };
