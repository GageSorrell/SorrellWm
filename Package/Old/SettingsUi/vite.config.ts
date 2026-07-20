/**
 * @file      vite.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import Declarations from "vite-plugin-dts";
import type { ModuleFormat } from "module";
import Path from "path";
import React from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins:
    [
        React(),
        Declarations({
            entryRoot: "Source",
            outDirs: "Distribution"
        })
    ],

    build:
    {
        emptyOutDir: true,
        outDir: "Distribution",
        sourcemap: true,

        lib:
        {
            entry: Path.resolve(__dirname, "Source/index.ts"),
            fileName: (Format: ModuleFormat) =>
            {
                return Format === "es"
                    ? "index.js"
                    : "index.cjs";
            },
            formats:
            [
                "es",
                "cjs"
            ],
            name: "SorrellWmComponents"
        },

        rollupOptions:
        {
            external:
            [
                "react",
                "react-dom",
                "react/jsx-runtime"
            ],

            output:
            {
                globals:
                {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react/jsx-runtime": "ReactJsxRuntime"
                }
            }
        }
    }
});
