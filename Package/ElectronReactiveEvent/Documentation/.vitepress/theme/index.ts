/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import "./Theme.css"

import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts"
import FluentIcon from "../../Component/FluentIcon.vue";

export default {
extends: DefaultTheme,
  enhanceApp({ app }) {
        app.component("FluentIcon", FluentIcon)
  }
} satisfies Theme
