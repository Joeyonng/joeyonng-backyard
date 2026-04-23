### `Slider` implements [Sliders][1].
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/selectors/sliders/

There are 2 variants of `Slider`.

```jsx
import {useState} from "react";
import {Slider} from "react-big-sur";

const [value, setValue] = useState(50);

<div className="row">
  <Slider value={value} variant="large" onChange={(value) => setValue(value)}/>
  <Slider value={value} variant="small" onChange={(value) => setValue(value)}/>
</div>
```

You can optionally add a header icon to `Slider` with `variant='large'`.

```jsx
import {useState} from "react";
import {Slider} from "react-big-sur";
import {Volume2} from "react-feather";

const [value, setValue] = useState(50);

<div>
  <Slider value={value} variant="large" header={<Volume2/>} onChange={(value) => setValue(value)}/>
</div>
```
