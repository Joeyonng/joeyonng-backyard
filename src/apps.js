import About from "./applications/About";
import Jupyter from "./applications/Jupyter";
import Finder from "./applications/Finder";
import DesktopMenu from "./menus/DesktopMenu";
import JupyterMenu from "./menus/JupyterMenu";
import AboutMenu from "./menus/AboutMenu";

import bigSurIcon from "./media/icons/big-sur.png";
import appSettingsIcon from "./media/icons/app-settings.png";
import jupyterIcon from "./media/icons/app-jupyter.png";
import appFinderIcon from "./media/icons/app-finder.png";
import FinderMenu from "./menus/FinderMenu";

const apps = {
  '-1': {
    appId: '-1',
    name: 'Desktop',
    icon: <img src={bigSurIcon} alt="Desktop"/>,
    menu: DesktopMenu,
  },
  '0': {
    appId: '0',
    name: 'About',
    icon: <img src={appSettingsIcon} alt="About"/>,
    menu: AboutMenu,
    element: About,
  },
  '1': {
    appId: '1',
    name: 'Finder',
    icon: <img src={appFinderIcon} alt="Finder"/>,
    menu: FinderMenu,
    element: Finder,
  },
  '2': {
    appId: '2',
    name: 'Jupyter Viewer',
    icon: <img src={jupyterIcon} alt="jupyter"/>,
    menu: JupyterMenu,
    element: Jupyter,
  },
  // '3': {
  //   appId: '2',
  //   name: 'Jupyter',
  //   icon: <img src={jupyterIcon} alt="jupyter"/>,
  //   menu: JupyterMenu,
  //   element: Jupyter,
  // },
  // '4': {
  //   appId: '2',
  //   name: 'Jupyter',
  //   icon: <img src={jupyterIcon} alt="jupyter"/>,
  //   menu: JupyterMenu,
  //   element: Jupyter,
  // },
  // '5': {
  //   appId: '2',
  //   name: 'Jupyter',
  //   icon: <img src={jupyterIcon} alt="jupyter"/>,
  //   menu: JupyterMenu,
  //   element: Jupyter,
  // },
  // '6': {
  //   appId: '2',
  //   name: 'Jupyter',
  //   icon: <img src={jupyterIcon} alt="jupyter"/>,
  //   menu: JupyterMenu,
  //   element: Jupyter,
  // },
};

export default apps;
