import type { ComponentType } from 'react';

export type AppWindowSize = {
  w: number;
  h: number;
};

export type AppRegistryEntry = {
  appId: string;
  name: string;
  icon: string;
  size?: AppWindowSize;
  menu?: ComponentType<any>;
  window?: ComponentType<any>;
};

export type AppRegistry = Record<string, AppRegistryEntry>;
