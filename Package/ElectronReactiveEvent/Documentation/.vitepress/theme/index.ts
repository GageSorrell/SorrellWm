/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import "./Theme.css"

import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import FluentIcon from "../../Component/FluentIcon.vue";
import Layout from "../../Component/Layout.vue";
import "virtual:group-icons.css";
import "vitepress-plugin-shiki-twoslash/styles.css";

const OutTheme: Theme = {
    enhanceApp({ app })
    {
        app.component("FluentIcon", FluentIcon)
    },
    extends: DefaultTheme,
    Layout
} satisfies Theme

export default OutTheme;
