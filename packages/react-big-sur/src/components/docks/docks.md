### `Dock` implements the basic [Dock][1].
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/system-capabilities/dock/

`Dock` is composed of `DockItem` and `DockDivider`. Both `DockItme` and `DockDivider` must be provided unique IDs using 
the `id` prop. You can also provide the image source using `src` prop (which will directly passed to `<img/>` used 
internally) as the dock icon and the label of the icon using `label` prop.

```jsx
import {Dock, DockItem, DockDivider} from "react-big-sur"
import {bigSurIcons} from "icons";

const allApps = Object.entries(bigSurIcons);

<div className="canvas background">
  <Dock>
    <DockItem
      id={allApps[0][0]}
      src={allApps[0][1]}
    />
    <DockItem
      id={allApps[1][0]}
      src={allApps[1][1]}
      label={allApps[1][0]}
    />
    <DockDivider
      id="divider"
    />
    <DockItem
      id={allApps[2][0]}
      src={allApps[2][1]}
      label={allApps[2][0]}
    />
  </Dock>
</div>
```

You can customize the appearance of the dock using `baseSize`, `largeSize` and `Position` props. Also, you can add some 
other settings to `DockItem` to add a running indicator or a sub-icon, and disable the opening animation. 

```jsx
import {useState} from "react";
import {Dock, DockContainer, DockItem, DockDivider} from "react-big-sur"
import {bigSurIcons} from "icons";

const allApps = Object.entries(bigSurIcons);

const [choices, setChoices] = useState([0, 1, 2]);

<div className="canvas background">
  {['top', 'bottom', 'left', 'right'].map((position, index) =>
    <Dock
      key={position}
      baseSize={32 * (index + 1)}
      largeSize={128}
      position={position}
    >
      {choices.map((choice, index) =>
        <DockItem
          key={allApps[choice][0]}
          id={allApps[choice][0]}
          src={allApps[choice][1]}
          label={allApps[choice][0]}
        />
      )}
      <DockDivider
        id="divider"
      />
      <DockItem
        id={allApps[10][0]}
        src={allApps[10][1]}
        subSrc={allApps[10][1]}
        label={allApps[10][0]}
        running={true}
        animateOpen={false}
      />
    </Dock>
  )}
</div>
```

`DockItem` by default supports the animation when it is added to or removed from the `Dock`. You can switch it to 
be the scaling animation using `animateDomRect` prop. 

```jsx
import {useRef, useState} from "react";
import {toPng} from "html-to-image";
import {Dock, DockContainer, DockItem, DockDivider, PushButton, AnimatedWindow, TitleBarWindow} from "react-big-sur"
import {bigSurIcons} from "icons";

const allApps = Object.entries(bigSurIcons);

const [choices, setChoices] = useState([0, 1, 2, 3]);
const [image, setImage] = useState(null);

const windowRef = useRef(null);
<div
  className="canvas background"
>
  <AnimatedWindow
    initial={{x: 100, y: 100, w: 360, h: 240}}
    cancel=".content"
    hidden={image !== null}
  >
    <TitleBarWindow
      ref={windowRef}
      width="100%"
      height="100%"
      onMinimizeClick={() => {
        toPng(windowRef.current).then(dataUrl => {
          setImage(dataUrl)
        }).catch(error => {
          console.error(error);
        });
      }}
    />
  </AnimatedWindow>

  <div
    className="row"
  >
    <PushButton
      onClick={() => {
        const nonSelected = []
        allApps.forEach((_, index) => {if (!choices.includes(index)) nonSelected.push(index)})

        const newIndex = Math.floor(Math.random() * nonSelected.length);
        const oldIndex = Math.floor(Math.random() * choices.length);
        let newChoices = [...choices];
        newChoices.splice(oldIndex, 0, nonSelected[newIndex]);
        setChoices(newChoices);
      }}
      disabled={choices.length === allApps.length}
      variant={choices.length === allApps.length ? 'disabled' : 'primary'}
    >
      Add DockItem
    </PushButton>

    <PushButton
      onClick={() => {
        let oldIndex = Math.floor(Math.random() * choices.length);
        let newChoices = [...choices];
        newChoices.splice(oldIndex, 1);
        setChoices(newChoices);
      }}
      disabled={choices.length === 1}
      variant={choices.length === 1 ? 'disabled' : 'secondary'}
    >
      Remove DockItem
    </PushButton>
  </div>

  <Dock
    baseSize={64}
    largeSize={128}
    position="bottom"
    debug={false}
  >
    {choices.map((choice, index) =>
      <DockItem
        key={allApps[choice][0]}
        id={allApps[choice][0]}
        src={allApps[choice][1]}
        label={allApps[choice][0]}
        onClick={() => {
          let newChoices = [...choices];
          newChoices.splice(index, 1);
          setChoices(newChoices);
        }}
        animateOpen={false}
      />
    )}

    {!image ? undefined :
      <DockItem
        key={'image'}
        id={'image'}
        src={image}
        label={'image'}
        onClick={() => {setImage(undefined)}}
        animateDOMRect={windowRef.current.getBoundingClientRect()}
        onAnimateStop={(type, value) =>{
          if (type === 'inOut' && value === 0) setImage(null);
        }}
      />
    }
  </Dock>
</div>
```