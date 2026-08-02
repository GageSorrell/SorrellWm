/**
 * Vitest configuration for the desktop-animation package.
 *
 * @module @sorrell/desktop-animation/vitest.config
 *
 * @file      vitest.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { defineConfig } from "vitest/config";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/vitest.config" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

export default defineConfig({
    test: {
        environment: "jsdom",
        include: [ "Test/**/*.test.{ts,tsx}" ]
    }
});
