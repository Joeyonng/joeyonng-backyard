### `Menu` implements basic [Menu][1]
[1]: https://developer.apple.com/design/human-interface-guidelines/macos/menus/menu-anatomy/

Simple `Menu` with `MenuItem`.

```jsx
import {useState} from "react";
import {PushButton, Menu, MenuList, MenuGroup, MenuItem, MenuDivider} from "react-big-sur";
import {GitHub} from "react-feather";

const [anchorEl, setAnchorEl] = useState(null);

<div
  className="row">
  <PushButton
    onClick={(event) => {
      setAnchorEl(event.currentTarget);
    }}
  >
    Open
  </PushButton>

  <Menu 
    anchorEl={anchorEl} 
    open={anchorEl !== null}
    onClickOutside={() => {
      setAnchorEl(null);
    }}
    onClickInside={() => {
      setAnchorEl(null);
    }}
  >
    <MenuList width={300}>
      <MenuGroup>
        <MenuItem primary="I am a MenuItem"/>
        <MenuItem primary="Menu = <div/>"/>
        <MenuItem primary="MenuItem = ListItem"/>
      </MenuGroup>
      <MenuDivider/>
      <MenuGroup>
        <MenuItem primary="MenuDivider = ListDivider"/>
        <MenuItem primary="I am disabled" disabled/>
        <MenuItem primary="MenuItem with a front icon" icon={<GitHub/>}/>
        <MenuItem primary="MenuItem with a tail icon" tail={<GitHub/>}/>
      </MenuGroup>
      <MenuDivider/>
      <MenuGroup variant="select">
        <MenuItem primary="Click me to select me"/>
        <MenuItem primary="Click me also deselect others"/>
      </MenuGroup>
      <MenuDivider/>
      <MenuGroup variant="check">
        <MenuItem primary="Click me to select me"/>
        <MenuItem primary="Click me won't deselect others"/>
        <MenuItem primary="Click me again to deselect me"/>
      </MenuGroup>
    </MenuList>
  </Menu>
</div>
```

If a `Menu` is nested in a `MenuItem`, it becomes a submenu of that `MenuItem`.

```jsx
import {Menu, MenuList, MenuItem, MenuDivider} from "react-big-sur";

<div className="row">
  <MenuList>
    <MenuItem primary="I have a submenu :)">
      <Menu>
        <MenuItem primary="I am in a submenu!"/>
        <MenuItem primary="Look how pretty I am"/>
      </Menu>
    </MenuItem>
    <MenuItem primary="I don't have a submenu :("/>
    <MenuItem primary="I also have a submenu but I am disabled :|" disabled>
      <Menu>
        <MenuItem primary="I am in another submenu!"/>
        <MenuItem primary="Look how pretty I am"/>
      </Menu>
    </MenuItem>
  </MenuList>
</div>
```

[Menu Bar Menus][2] can be implemented using `<MenuBarButtons/>` and `<MenuBarMenu/>`.

[2]: https://developer.apple.com/design/human-interface-guidelines/macos/menus/menu-bar-menus/

```jsx
import {Menu, MenuItem, MenuBarButtons, MenuBarButton} from "react-big-sur";
import {Umbrella} from "react-feather";

<div
  className="row background"
>
  <MenuBarButtons
    overlap={true}
    onChange={(index) => console.log(index)}
  >
    <MenuBarButton
      label={<div>EMPTY DIV</div>}
    />
    
    {['left', 'right', 'middle', 'top'].map(item => (
      <MenuBarButton
        key={item}
        label={`Menu ${item}`}
      >
        <Menu
          key={item}
          anchorOriginX={item === 'top' ? 'left' : item}
          anchorOriginY={item !== 'top' ? 'bottom' : 'top'}
          popoverX={item === 'top' ? 'left' : item}
          popoverY={item === 'top' ? 'bottom' : 'top'}
        >
          <MenuItem primary="I have a submenu :)">
            <Menu>
              <MenuItem primary="I am in a submenu!"/>
              <MenuItem primary="Look how pretty I am"/>
            </Menu>
          </MenuItem>
          <MenuItem primary="I don't have a submenu :("/>
          <MenuItem primary="I also have a submenu :)">
            <Menu>
              <MenuItem primary="I am in another submenu!"/>
              <MenuItem primary="Look how pretty I am"/>
            </Menu>
          </MenuItem>
        </Menu>
      </MenuBarButton>
    ))}
  </MenuBarButtons>
</div>
```