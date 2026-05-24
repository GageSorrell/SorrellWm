/**
 * @file      Manifest.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ModuleDecl } from "./Manifest.Types.js";

export type ManifestBase =
    Readonly<{
        Modules: Readonly<Record<string, ModuleDecl>>;
    }>;
