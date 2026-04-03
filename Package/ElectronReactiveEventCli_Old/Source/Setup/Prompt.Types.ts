/* File:      Prompt.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FRegistrarBaseMatch } from "./TsConfig.Types.js";

export type FRegistrarDefinition =
    {
        Name: string;
        Path: string;
    };

export type FRegistrarModuleArray = ReadonlyArray<FRegistrarBaseMatch>;
