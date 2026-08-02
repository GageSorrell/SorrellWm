/**
 *
 *
 * @module @sorrell/storybook-theme-fluent/preset
 *
 * @file      preset.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const FluentPresetTypeId = Symbol.for("@sorrell/storybook-theme-fluent/Preset");
export type FluentPresetTypeId = typeof FluentPresetTypeId;

/** @category Preset @since 1.0.0 */
export const managerEntries = async (): Promise<ReadonlyArray<string>> => [
    fileURLToPath(new URL("./manager.js", import.meta.url))
];

/** @category Preset @since 1.0.0 */
export const previewAnnotations = async (): Promise<ReadonlyArray<string>> => [
    fileURLToPath(new URL("./preview.js", import.meta.url))
];
import { fileURLToPath } from "node:url";
