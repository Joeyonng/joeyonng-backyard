### `Controls` implements the basic ControlCenter.

`Controls` is composed of several user-defined `Control`. `Control` has 4 sizes: `small`, `medium`, `large` and
`wide`. You can customize the content of the `Control`. 

```jsx
import {Controls, Control, List, ListItem, HelpButton} from "react-big-sur";
import {Feather} from "react-feather";

<Controls>
  <Control size="large">
    <div>Large</div>
  </Control>
  <Control size="medium">
    <div>meidum</div>
  </Control>
  <Control size="small">
    <div>small</div>
  </Control>
  <Control size="small">
    <div>small</div>
  </Control>
  <Control size="wide">
    <div>wide</div>
  </Control>
  <Control size="wide">
    <div>wide</div>
  </Control>
  <Control size="large">
    <List>
      <ListItem
        icon={<HelpButton><Feather/></HelpButton>}
        primary="WI-FI"
        secondary="Home"
        noPadding={true}
        primaryWeight="bold"
      />
      <ListItem
        icon={<HelpButton><Feather/></HelpButton>}
        primary="Bluetooth"
        secondary="On"
        noPadding={true}
        primaryWeight="bold"
      />
      <ListItem
        icon={<HelpButton><Feather/></HelpButton>}
        primary="AirDrop"
        secondary="Contacts Only"
        noPadding={true}
        primaryWeight="bold"
      />
    </List>
  </Control>
</Controls>
```