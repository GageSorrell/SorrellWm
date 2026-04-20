import { defineConfig, type UserConfig } from "tsdown";

export default defineConfig((Options: UserConfig): UserConfig =>
{
    return {
        name: Options.watch ? "production" : undefined,

        tsconfig: Options.watch ? "tsconfig.json" : "tsconfig.build.json",

        dts: true,

        platform: "node",
        format: ["esm"],

        sourcemap: Options.watch ? true : undefined,

        clean: true,
        minify: false,
        unbundle: false
    };
});
