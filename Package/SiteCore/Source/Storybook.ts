/**
 *
 *
 * @module @sorrell/site-core/Storybook
 *
 * @file      Storybook.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Storybook configuration factory for generated component websites.
 *
 * @module @sorrell/site-core/Storybook
 */

import type { StorybookConfig } from "@storybook/react-vite";
import type { StorybookWebsiteDefinition } from "./Schema.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/site-core/Storybook" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Theme preset selected by a generated Storybook website.
 *
 * @category Model
 * @since 1.0.0
 */
export interface StorybookTheme
{
    readonly PackageName: string;
}

/**
 * Creates a Storybook React/Vite configuration from a validated website definition.
 *
 * @category Configuration
 * @since 1.0.0
 */
export const CreateStorybookConfig = (
    Website: StorybookWebsiteDefinition,
    Theme: StorybookTheme
): StorybookConfig => ({
    addons: [
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        Theme.PackageName
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    stories: [ ...Website.Stories ]
});

/** Decode a definition and create its Storybook React/Vite configuration. @category Configuration @since 1.0.0 */
export const DefineStorybookConfig = (Website: StorybookWebsiteDefinition): StorybookConfig =>
    CreateStorybookConfig(Website, {
        PackageName: `@sorrell/storybook-theme-${ Website.Theme.toLowerCase() }`
    });
