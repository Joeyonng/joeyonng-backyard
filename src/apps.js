import About from "./applications/About";
import Jupyter from "./applications/Jupyter";
import DesktopMenu from "./menus/DesktopMenu";
import JupyterMenu from "./menus/JupyterMenu";
import AboutMenu from "./menus/AboutMenu";

import bigSurIcon from "./images/big-sur.png";
import settingsIcon from "./images/settings.png";
import jupyterIcon from "./images/jupyter.png";

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
    icon: <img src={settingsIcon} alt="About"/>,
    menu: AboutMenu,
    element: About,
  },
  '1': {
    appId: '1',
    name: 'Notebook Viewer',
    icon: <img src={jupyterIcon} alt="Notebook Viewer"/>,
    menu: JupyterMenu,
    element: Jupyter,
  },
};

export default apps;
