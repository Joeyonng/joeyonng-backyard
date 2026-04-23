`CircularBar` implements a circular progress bar with a component in the center.

```jsx
import {CircularBar} from "react-big-sur";

<div className="row">
  <CircularBar value={20} diameter={100}>
    20%
  </CircularBar>

  <CircularBar value={60} diameter={50}>
    60%
  </CircularBar>
</div>
```

If `diameter` prop is not defined, the diameter is calculated based on the size of the children.

```jsx
import {CircularBar} from "react-big-sur";
import {Code} from "react-feather";

<div className="row">
  <CircularBar>
    Long Text
  </CircularBar>
  
  <CircularBar>
    <Code/>
  </CircularBar>
</div>
```
