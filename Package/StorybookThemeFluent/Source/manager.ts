/**
 *
 *
 * @module @sorrell/storybook-theme-fluent/manager
 *
 * @file      manager.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

export const FluentManagerTypeId = Symbol.for("@sorrell/storybook-theme-fluent/Manager");
export type FluentManagerTypeId = typeof FluentManagerTypeId;

addons.setConfig({
    theme: create({
        appBg: "#f5f5f5",
        appBorderColor: "#d1d1d1",
        appBorderRadius: 8,
        base: "light",
        brandTitle: "Component documentation",
        colorPrimary: "#0f6cbd",
        colorSecondary: "#115ea3",
        fontBase: '"Segoe UI Variable", "Segoe UI", sans-serif'
    })
});
