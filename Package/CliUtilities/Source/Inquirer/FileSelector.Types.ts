/**
 * @file      FileSelector.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
