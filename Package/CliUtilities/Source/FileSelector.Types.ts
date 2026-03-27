/* File:      FileSelector.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PromptConfig } from "@sorrell/inquirer-file-selector";

export type { Item } from "@sorrell/inquirer-file-selector";

export type FFileSelectorConfigFull =
    PromptConfig &
    {
        allowCancel?: false;
        multiple?: false;
    };

export type FFileSelectorConfigBase = Omit<FFileSelectorConfigFull,  "message" | "allowCancel">;

export type FFileSelectorConfig =
    Pick<FFileSelectorConfigFull,
        | "filter"
        | "message"
        | "type"
        | "theme"
    > &
    Partial<Pick<
        FFileSelectorConfigFull,
        | "allowCancel"
        | "basePath"
    >>;
