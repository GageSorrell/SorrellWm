/**
 *
 *
 * @module @sorrell/storybook-theme-effect/manager
 *
 * @file      manager.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

export const EffectManagerTypeId = Symbol.for("@sorrell/storybook-theme-effect/Manager");
export type EffectManagerTypeId = typeof EffectManagerTypeId;

addons.setConfig({ theme: create({
    appBg: "#09090b", appBorderColor: "#27272a", appBorderRadius: 4, base: "dark",
    brandTitle: "Component documentation", colorPrimary: "#d4d4d8", colorSecondary: "#a1a1aa",
    fontBase: "Inter, sans-serif", fontCode: '"JetBrains Mono", monospace', textColor: "#e4e4e7"
}) });
