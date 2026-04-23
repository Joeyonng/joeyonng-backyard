### `Segments` implements [Segmented Controls][1].
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/selectors/segmented-controls/

`Segments` is composed of `Segment`s. The content of each `Segment` can be texts or icons.

```jsx
import {Segments, Segment} from "react-big-sur";
import {Star, Bookmark} from "react-feather";

<Segments
  defaultIndex={1}
  onChange={(prevIndex, curIndex) => console.log(prevIndex, curIndex)}
>
  <Segment>First</Segment>
  <Segment>Second</Segment>
  <Segment><Star/></Segment>
  <Segment><Bookmark/></Segment>
</Segments>
```