/**
 *
 *
 * @module @sorrell/wm/vitest.insert.config
 *
 * @file      vitest.insert.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [ react() ],
    test:
    {
        environment: "jsdom",
        include: [ "Test/**/*.Test.{ts,tsx}" ],
        setupFiles: [ "./Test/Renderer/Setup.ts" ]
    }
});
