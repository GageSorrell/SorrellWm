/**
 * @file      ThemeToggle.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ComponentPropsWithoutRef } from "react";

export type FTheme =
    | "dark"
    | "light"
    | "system";

export type PAnimatedThemeToggler = ComponentPropsWithoutRef<"button">;
