`ToolbarItem` is a special type of PushButton that should only be used on the toolbar of the window.

`ToolbarItem` has 4 different variants from `PushButton`.

```jsx
import {ToolbarItem} from "react-big-sur";
import {X, Calendar, Star, Bookmark} from "react-feather";

<div className="row">
  <ToolbarItem variant="focused"><X/></ToolbarItem>
  <ToolbarItem variant="selected"><Calendar/></ToolbarItem>
  <ToolbarItem variant="deselected"><Star/></ToolbarItem>
  <ToolbarItem variant="disabled"><Bookmark/></ToolbarItem>
</div>
```

`ToolbarItem` with `disabled` has no hover or clicked down effect.

```jsx padded
import {ToolbarItem} from "react-big-sur";
import {X, Calendar, Star, Bookmark} from "react-feather";

<div className="row">
  <ToolbarItem disabled={true} variant="focused"><X/></ToolbarItem>
  <ToolbarItem disabled={true} variant="selected"><Calendar/></ToolbarItem>
  <ToolbarItem disabled={true} variant="deselected"><Star/></ToolbarItem>
  <ToolbarItem disabled={true} variant="disabled"><Bookmark/></ToolbarItem>
</div>
```
