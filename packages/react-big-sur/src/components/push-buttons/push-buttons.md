### `PushButton` implements [Push Buttons][1].
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/buttons/push-buttons/

`PushButton` has 4 variants.

```jsx
import {PushButton} from "react-big-sur";

<div className="row">
  <PushButton variant='primary'>Joeyonng</PushButton>
  <PushButton variant='secondary'>Joeyonng</PushButton>
  <PushButton variant='subdued'>Joeyonng</PushButton>
  <PushButton variant='disabled'>Joeyonng</PushButton>
</div>
```

You can also pass in icons.

```jsx
import {PushButton} from "react-big-sur";
import {X, Calendar, Star, Bookmark} from "react-feather";

<div className="row">
  <PushButton variant='primary'><X/></PushButton>
  <PushButton variant='secondary'><Calendar/></PushButton>
  <PushButton variant='subdued'><Star/></PushButton>
  <PushButton variant='disabled'><Bookmark/></PushButton>
</div>
```

`PushButton` has 2 different sizes.

```jsx
import {PushButton} from "react-big-sur";
import {Star, Bookmark} from "react-feather";

<div className="row">
  <PushButton size="large">Joeyonng</PushButton>
  <PushButton size="small">Joeyonng</PushButton>
  <PushButton size="large"><Star/></PushButton>
  <PushButton size="small"><Bookmark/></PushButton>
</div>
```

If `disbled`, `PushButton` doesn't have clicked down effect.

```jsx
import {PushButton} from "react-big-sur";
import {Star, Bookmark} from "react-feather";

<div className="row">
  <PushButton disabled>Joeyonng</PushButton>
  <PushButton disabled><Star/></PushButton>
</div>
```
