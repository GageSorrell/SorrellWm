/**
 * @file      esbuild.config.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { Run } from "../../Configuration/esbuild.config.mts";

await Run({
    ".": "./Source/index.ts",
    "./internal": "./Source/Index.Internal.ts",
    "./query": "Source/Query/index.ts",
    "./registrar": "Source/Registrar/index.ts"
});
