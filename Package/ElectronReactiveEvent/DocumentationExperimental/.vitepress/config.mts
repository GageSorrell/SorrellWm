/**
 * @file      config.mts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {defineConfig} from '@lando/vitepress-theme-default-plus/config';

export default defineConfig({
  title: "Electron Reactive Event",
  description: "Type-safe Electron IPC functions, including modern React hooks."
  base: '/',
  lang: 'en-US',
  themeConfig: {
    multiVersionBuild: [
  {
    base: "/",
    build: "latest",
    cache: true,
    match: "v[0-9].*",
    satisfies: "*",
  },
]
  }
});
