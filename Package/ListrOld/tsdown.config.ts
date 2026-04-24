/**
 * @file      tsdown.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type UserConfig, defineConfig } from "tsdown";

export default defineConfig((Options: UserConfig): UserConfig =>
{
    return {
        name: "production",

        // tsconfig: Options.watch ? "tsconfig.json" : "tsconfig.build.json",
        tsconfig: "tsconfig.json",

        dts: true,

        format: [ "esm" ],
        platform: "node",

        sourcemap: Options.watch ? true : undefined,

        clean: true,
        minify: false,
        unbundle: false
    };
});
