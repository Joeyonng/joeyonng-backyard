Simple `tootips`.

```jsx
import {Tooltip} from "react-big-sur";

<div className="row">
  {['top', 'right', 'bottom', 'left'].map((key) => 
    <Tooltip key={key} placement={key}>{key}</Tooltip>)
  }
</div>
```