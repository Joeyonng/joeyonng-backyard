import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dock, DockDivider, DockItem } from 'react-big-sur';

import apps from '../apps';
import { startWindow, switchWindow, updateWindow } from '../redux';
import appNotesIcon from '../media/icons/app-notes.png';
import type { AppRegistry } from '../types/app';

const DockComponent = Dock as any;
const DockDividerComponent = DockDivider as any;
const DockItemComponent = DockItem as any;

type WindowNode = {
  appId: string;
  snapshot?: string;
  node?: { getBoundingClientRect: () => DOMRect };
};

function BottomDock() {
  const dispatch = useDispatch();
  const windows = useSelector((state: any) => state.windows as Record<string, WindowNode>);
  const appRegistry = apps as AppRegistry;

  return (
    <DockComponent>
      {Object.entries(appRegistry).map(([appId, app]) =>
        appId === '0' ? null : (
          <DockItemComponent
            key={appId}
            id={`app-${appId}`}
            src={app.icon}
            label={app.name}
            running={Object.values(windows).map((windowNode) => windowNode.appId).includes(appId)}
            onClick={() => {
              dispatch(startWindow(app.appId));
            }}
          />
        ),
      )}
      <DockDividerComponent id="divider" />
      {Object.entries(windows).map(([windowId, windowNode]) =>
        !windowNode.snapshot ? null : (
          <DockItemComponent
            key={windowId}
            id={`window-${windowId}`}
            src={windowNode.snapshot}
            subSrc={appRegistry[windowNode.appId].icon}
            label={appRegistry[windowNode.appId].name}
            onClick={() => {
              dispatch(updateWindow(windowId, { snapshot: undefined }));
            }}
            animateDOMRect={windowNode.node ? windowNode.node.getBoundingClientRect() : undefined}
            onAnimateStop={(type: string, value: number) => {
              if (type === 'inOut' && value === 0) {
                dispatch(switchWindow(windowId));
              }
            }}
          />
        ),
      )}

      <DockItemComponent
        id="notes"
        src={appNotesIcon}
        label="Joeyonng's Notebook"
        animateOpen={false}
        onClick={() => {
          window.open('https://joeyonng.github.io/joeyonng-notebook/root.html');
        }}
      />
    </DockComponent>
  );
}

export default BottomDock;
