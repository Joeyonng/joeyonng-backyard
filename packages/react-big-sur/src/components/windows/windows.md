### `TitleBarWindow` implements the most basic window template, while `ToolbarWindow` improves on TitleBarWindow with customizable toolbar and sidebar.

`TitleBarWindow` contains the title bar, which you can change using `title` prop, while `ToolbarWindow` contains a 
fully customized toolbar, where you can replace with your own component using `toolbar` prop.

```jsx
import {TitleBarWindow, ToolbarWindow} from "react-big-sur";

<div className="row">
  <TitleBarWindow title="Title">
    <div style={{margin: 100}}>
      Windows content here
    </div>
  </TitleBarWindow>

  <ToolbarWindow toolbar={<div>Toolbar Div</div>}>
    <div style={{margin: 100}}>
      Windows content here
    </div>
  </ToolbarWindow>
</div>
```

You can optionally add a sidebar component to `ToolbarWindow` using `sidebar` prop.

```jsx
import {ToolbarWindow} from "react-big-sur";

<div className="row">
  <ToolbarWindow
    toolbar={<div>Toolbar Div</div>}
    sidebar={<div style={{margin: 50}}>Sidebar Div</div>}
  >
    <div style={{margin: 100}}>
      Windows content here
    </div>
  </ToolbarWindow>
</div>
```

`TitleBarWindow` and `ToolbarWindow` are built in with focused and unfocused styles. The title bar, toolbar, sidebar 
and traffic lights will be greyed out if unfocused.

```jsx
import {useState} from "react";
import {ToolbarWindow} from "react-big-sur";

const [focus, setFocus] = useState(false);

<div className="row">
  <ToolbarWindow
    focus={focus}
    toolbar={<div>Toolbar Div</div>}
    sidebar={<div style={{margin: 50}}>Sidebar Div</div>}
  >
    <div
      onClick={() => {setFocus(!focus)}}
      style={{margin: 100}}
    >
      Click here to focus/unfocus
    </div>
  </ToolbarWindow>
</div>
```

You can pass in different callback functions to `TitleBarWindow` and `ToolbarWindow` to interact with built-in UI such
as the traffic lights and title bar/toolbar.

```jsx
import {useState} from "react";
import {TitleBarWindow} from "react-big-sur";

const [message, setMessage] = useState('Windows content here');

<div className="row">
  <TitleBarWindow
    title="Title"
    onCloseClick={() => setMessage('onCloseClick')}
    onMinimizeClick={() => setMessage('onMinimizeClick')}
    onMaximizeClick={() => setMessage('onMaximizeClick')}
    onTitleBarDoubleClick={() => setMessage('onTitleBarDoubleClick')}
  >
    <div style={{margin: 100}}>
      {message}
    </div>
  </TitleBarWindow>
</div>
```

### AnimatedWindow makes the children a desktop application window.

AnimatedWindow is draggable and resizable, which are achieved by [react-rnd][1] under the hood.
All other props not specified will be directly passed to `Rnd` component. Please see [react-rnd][1] if you want
more control of the component. In this example, `cancel` prop is directly passed to `Rnd` so that only title bar can be
used to drag the windows.

[1]: https://github.com/bokuweb/react-rnd/

```jsx
import {useState} from "react";
import {TitleBarWindow, AnimatedWindow} from "react-big-sur";

const [message, setMessage] = useState('I am draggable and resizable!');

<div className="canvas">
  <AnimatedWindow
    initial={{x: 0, y: 0, w: 360, h: 240}}
    cancel=".content"
    onReshapeStart={({x, y, h, w}) => {
      setMessage(`onReshapeStart, x=${x}, y=${y}, h=${h}, w=${w}`)
    }}
    onReshapeStop={({x, y, h, w}) => {
      setMessage(`onReshapeStop, x=${x}, y=${y}, h=${h}, w=${w}`)
    }}
  >
    <TitleBarWindow
      width="100%"
      height="100%"
    >
      <div className="content" style={{width: "100%", height: "100%"}}>
        {message}
      </div>
    </TitleBarWindow>
  </AnimatedWindow>
</div>
```

You can use `dragBorder` and `resizeBorder` props to make a bounding box for AnimatedWindow. The example below simulates
how the application window is bounded by the desktop in macOS Big Sur.
1. The `top`, `bottom`, `left` and `right` keys defines the top, bottom, left and right boundaries respectively. No
   boundary on that direction if undefined.
2. In each boundary, `border` key defines boundary as the number of pixels with respect to its parent.
3. By default, the window is bounded by the corresponding edge (The `top` boundary bounds the top edge of the window).
   If `reversed` is `true`, the window is defined by using the opposite edge of the window (The `top` boundary bounds the
   bottom edge of the window).
4. 
```jsx
import {TitleBarWindow, AnimatedWindow} from "react-big-sur";

<div className="canvas">
  <AnimatedWindow
    initial={{x: 0, y: 0, w: 360, h: 240}}
    dragBorder={{top: {border: 0}, bottom: {border: 640, reversed: true}}}
    resizeBorder={{top: {border: 0}, bottom: {border: 640}, left: {border: 0}, right: {border: 800}}}
  >
    <TitleBarWindow
      width="100%"
      height="100%"
    >
      <div style={{width: "100%", height: "100%"}}>
        Try to drag or reisze me to the edges!
      </div>
    </TitleBarWindow>
  </AnimatedWindow>
</div>
```

AnimatedWindow also provides a way to animate between different positions and sizes. If `animateTo` prop is changed,
AnimatedWindow will animate nicely to the position and size provided in `animateTo` object. Use `onAnimateStart` and
`onAnimateStop` callback functions to get the old and new position and size.

```jsx
import {useState} from "react";
import {TitleBarWindow, AnimatedWindow} from "react-big-sur";

const [windownState, setWindowState] = useState('norm');
const [message, setMessage] = useState('Click on traffic lights to see animations!');

let positionSize = {
  'norm': {x: (800 - 360) / 2, y: (640 - 240) / 2, w: 360, h: 240},
  'max': {x: 0, y: 0, w: 800, h: 640},
  'min': {x: (800 - 160) / 2, y: (640 - 120) / 2, w: 160, h: 120},
}[windownState];

<div className="canvas">
  <AnimatedWindow
    initial={positionSize}
    animateTo={positionSize}
    onAnimateStart={({x, y, w, h}) => setMessage(`Animate started from x=${x}, y=${y}, w=${w}, h=${h}`)}
    onAnimateStop={({x, y, w, h}) => setMessage(`Animate stopped on x=${x}, y=${y}, w=${w}, h=${h}`)}
  >
    <TitleBarWindow
      width="100%"
      height="100%"
      onMinimizeClick={() => setWindowState(windownState === 'min' ? 'norm' : 'min')}
      onMaximizeClick={() => setWindowState(windownState === 'max' ? 'norm' : 'max')}
    >
      <div style={{width: "100%", height: "100%"}}>
        {message}
      </div>
    </TitleBarWindow>
  </AnimatedWindow>
</div>
```

AnimatedWindow is usually integrated with ToolbarWindow and TitleBarWindow to create macOS Big Sur desktop with multiple
applications. You can use `zIndex` and `focus` props to arrange their order.

```jsx
import {useState} from "react";
import {TitleBarWindow, ToolbarWindow, AnimatedWindow} from "react-big-sur";

const [zIndex0, setZIndex0] = useState(0);
const [zIndex1, setZIndex1] = useState(1);
const maxZIndex = Math.max(zIndex0, zIndex1);

<div className="canvas">
  <AnimatedWindow
    initial={{x: 100, y: 100, w: 360, h: 240}}
    cancel=".content"
    zIndex={zIndex0}
    onFocus={() => setZIndex0(maxZIndex + 1)}
  >
    <TitleBarWindow
      width="100%"
      height="100%"
      focus={zIndex0 === maxZIndex}
    >
    </TitleBarWindow>
  </AnimatedWindow>

  <AnimatedWindow
    initial={{x: 300, y: 300, w: 360, h: 240}}
    cancel=".content"
    zIndex={zIndex1}
    onFocus={() => setZIndex1(maxZIndex + 1)}
  >
    <ToolbarWindow
      width="100%"
      height="100%"
      toolbar={<div></div>}
      focus={zIndex1 === maxZIndex}
    >
    </ToolbarWindow>
  </AnimatedWindow>
</div>
```