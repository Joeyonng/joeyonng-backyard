### `HelpButton` implements a generalized version of [Help Buttons][1].
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/buttons/help-buttons/

`HelpButton` has 4 variants.

```jsx
import {HelpButton} from "react-big-sur";
import {X, Calendar, Star, Bookmark} from "react-feather";

<div className="row">
  <HelpButton variant='primary'><X/></HelpButton>
  <HelpButton variant='secondary'><Calendar/></HelpButton>
  <HelpButton variant='subdued'><Star/></HelpButton>
  <HelpButton variant='disabled'><Bookmark/></HelpButton>
</div>
```

You can also pass in strings with single letters preferred.

```jsx
import {HelpButton} from "react-big-sur";
import {X, Calendar, Star, Bookmark} from "react-feather";

<div className="row">
  <HelpButton variant='primary'>J</HelpButton>
  <HelpButton variant='secondary'>J</HelpButton>
  <HelpButton variant='subdued'>J</HelpButton>
  <HelpButton variant='disabled'>J</HelpButton>
</div>
```

`HelpButton` has different 3 sizes.

```jsx
import {HelpButton} from "react-big-sur";
import {Star, Bookmark} from "react-feather";

<div className="row">
  <HelpButton size="large">J</HelpButton>
  <HelpButton size="medium">J</HelpButton>
  <HelpButton size="small">J</HelpButton>
  <HelpButton size="large"><Star/></HelpButton>
  <HelpButton size="medium"><Star/></HelpButton>
  <HelpButton size="small"><Star/></HelpButton>
</div>
```

`HelpButton` with `disabled` has no clicked down effect.

```jsx
import {HelpButton} from "react-big-sur";
import {Star, Bookmark} from "react-feather";

<div className="row">
  <HelpButton disabled={true}>J</HelpButton>
  <HelpButton disabled={true}><Star/></HelpButton>
</div>
```
