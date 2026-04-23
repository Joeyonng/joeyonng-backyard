### `ColumnView` implements basic [Column Views][1]
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/windows-and-views/column-views/

`ColumnView` is used to construct a tree like structure. If the children of the `ColumnView` is a list of 
`ColumnView`s, it is considered an internal node of the tree. On the other hand, `ColumnView` is considered a 
terminal node of the tree if its children is another React component.

`ColumnView` is both the container and the item. Each `ColumnView` must be supplied with a unique ID using the 
`id` prop. `icon`, `label`, and `hasArrow` props are used for the `ColumnView` item, while others are used for the 
`ColumnView` container. When a `ColumnView` is selected, its children will be displayed in the next column. Thus,
the item part of the root `ColumnView` won't be used and its `icon`, `label`, and `hasArrow` props will be ignored.

```jsx
import {useRef, useState} from "react";
import {ColumnView, ToolbarWindow} from "react-big-sur";

<ToolbarWindow
  width={"100%"}
  height={360}
>
  <ColumnView
    id={0}
    minWidth={150}
    loading={false}
  >
    <ColumnView
      id={1}
      label={`Label-1`}
      loading={true}
    >
    </ColumnView>
    <ColumnView
      id={2}
      label={`Label-2`}
      hasArrow={true}
    >
      <ColumnView
        id={3}
        label={`Label-3`}
      >
      </ColumnView>
      <ColumnView
        id={4}
        label={`Label-4`}
      >
      </ColumnView>
    </ColumnView>
  </ColumnView>
</ToolbarWindow>
```

A simple way to create the ColumnView tree structure is to use `ColumnViewFactory`, which is a single component that
constructs the ColumnViews defined by an Object. You can supply this object via the `tree` prop. The properties of the 
object are the props for the root `ColumnView`. The children of the current object is supposed to be an `array` of 
objects that define the children `ColumnView`s, or a valid React component if the `ColumnView` defined by the 
current object is a terminal node.

```jsx
import {useRef, useState} from "react";
import {ColumnViewFactory, ColumnView, ToolbarWindow} from "react-big-sur";

const terminal = (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    Terminal
  </div>
)

const tree = {
  id: "0",
  label: "Lable 0",
  minWidth: 200,
  children: [
    {
      id: "1",
      label: "Lable 1",
      minWidth: 200,
      children: [
        {
          id: "4",
          label: "Lable 4",
          fillWidth: true,
          children: terminal,
          loading: true,
        },
        {
          id: "5",
          label: "Lable 5",
          fillWidth: true,
          children: [
            {
              id: "6",
              label: "Lable 6",
              children: terminal,
            },
          ]
        },
      ]
    },
    {
      id: "2",
      label: "Lable 2",
      fillWidth: true,
      children: terminal,
    },
    {
      id: "3",
      label: "Lable 3",
      children: terminal,
      loading: true,
    },
    {
      id: "4",
      label: "Lable 4",
      fillWidth: true,
      children: terminal,
    },
    {
      id: "5",
      label: "Lable 5",
      children: terminal,
      loading: true,
    },
    {
      id: "6",
      label: "Lable 6",
      fillWidth: true,
      children: terminal,
    },
    {
      id: "7",
      label: "Lable 7",
      children: terminal,
      loading: true,
    },
  ]
};

<ToolbarWindow
  width={"100%"}
  height={200}
>
  <ColumnViewFactory tree={tree}/>
</ToolbarWindow>
```

The benefits of using `ColumnViewFactory` is that you don't have to track the `selectedId`s at each level. The current
path of the tree is specified by the `path` prop and any operation that changed the path will fire the `onChange` 
callback so that you can have the latest path used internally. Also, `ColumnViewFactory` atomically populates the 
`containerEl` prop of the root `ColumnView` so that the `ColumnView`s know what is the boundary of the parent node. 

```jsx
import {useRef, useState} from "react";
import {ColumnViewFactory, ColumnView, ToolbarWindow, AnimatedWindow} from "react-big-sur";

const [path, setPath] = useState({});

const terminal = (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {JSON.stringify(path)}
  </div>
)

const tree = {
  id: "0",
  label: "Lable 0",
  minWidth: 200,
  children: [
    {
      id: "1",
      label: "Lable 1",
      minWidth: 200,
      children: [
        {
          id: "4",
          label: "Lable 4",
          fillWidth: true,
          children: terminal,
          loading: true,
        },
        {
          id: "5",
          label: "Lable 5",
          fillWidth: true,
          children: [
            {
              id: "6",
              label: "Lable 6",
              children: terminal,
            },
          ]
        },
      ]
    },
    {
      id: "2",
      label: "Lable 2",
      fillWidth: true,
      children: terminal,
    },
    {
      id: "3",
      label: "Lable 3",
      children: terminal,
      loading: true,
    },
  ]
};

<div className="canvas background">
  <AnimatedWindow 
    initial={{x: 50, y: 50, w: 500, h: 360}}
    disableDragging={true}
  >
    <ToolbarWindow
      width="100%"
      height="100%"
    >
      <ColumnViewFactory
        tree={tree}
        path={path}
        onChange={(path) => setPath(path)}
      />
    </ToolbarWindow>
  </AnimatedWindow>
</div>
```
