import { Finder, FinderMenu } from './applications/Finder';
import { Jupyter, JupyterMenu } from './applications/Jupyter';

import appFinderIcon from './media/icons/app-finder.png';
import jupyterIcon from './media/icons/app-jupyter.png';
import bigSurIcon from './media/icons/big-sur.png';
import type { AppRegistry } from './types/app';

const apps: AppRegistry = {
  '0': {
    appId: '0',
    name: 'Desktop',
    icon: bigSurIcon,
  },
  '1': {
    appId: '1',
    name: 'Finder',
    icon: appFinderIcon,
    size: { w: 960, h: 640 },
    menu: FinderMenu,
    window: Finder,
  },
  '2': {
    appId: '2',
    name: 'Jupyter Viewer',
    icon: jupyterIcon,
    size: { w: 960, h: 640 },
    menu: JupyterMenu,
    window: Jupyter,
  },
};

export default apps;
