import { FElectronHandler } from '../Main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: FElectronHandler;
  }
}

export {};
