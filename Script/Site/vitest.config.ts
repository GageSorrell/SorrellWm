/**
 *
 *
 * @module @sorrell/site/vitest.config
 *
 * @file      vitest.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: [ "Test/**/*.test.ts" ] } });
