/**
 * @file      Electron Vite build configuration.
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { defineConfig } from "electron-vite";
import { join } from "node:path";
import react from "@vitejs/plugin-react";

const ApplicationDirectory: string = import.meta.dirname;
const BuildDirectory: string = join(ApplicationDirectory, "Build");

export default defineConfig({
    main:
    {
        build:
        {
            lib:
            {
                entry: join(ApplicationDirectory, "Source/Main/Index.ts")
            },
            outDir: join(BuildDirectory, "Main"),
            rollupOptions:
            {
                external: [ "@sorrell/windows" ]
            },
            sourcemap: true
        }
    },
    preload:
    {
        build:
        {
            /* Sandboxed preload scripts must be self-contained. */
            externalizeDeps: false,
            lib:
            {
                entry: join(ApplicationDirectory, "Source/Preload/Index.ts")
            },
            outDir: join(BuildDirectory, "Preload"),
            rollupOptions:
            {
                output:
                {
                    format: "cjs"
                }
            },
            sourcemap: true
        }
    },
    renderer:
    {
        build:
        {
            minify: "esbuild",
            outDir: join(BuildDirectory, "Renderer"),
            rollupOptions:
            {
                input: join(ApplicationDirectory, "Source/Renderer/Index.html")
            },
            sourcemap: true
        },
        plugins: [ react() ],
        root: join(ApplicationDirectory, "Source/Renderer")
    }
});
