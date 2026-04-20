/**
 * @file      FileSelector.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    FFileSelectorConfig,
    FFileSelectorConfigBase,
    FFileSelectorConfigFull } from "./FileSelector.Types.js";
import { type Item, type PromptTheme, fileSelector } from "@sorrell/inquirer-file-selector";
import type { PartialDeep } from "@inquirer/type";
import type { Theme } from "@inquirer/core";

/**
 * Create an {@link https://www.npmjs.com/package/@inquirer/prompts | Inquirer} prompt for
 * browsing and selecting a file or directory.
 *
 * This wraps {@link https://www.npmjs.com/package/inquirer-file-selector | inquirer-file-selector}.
 *
 * @deprecated An enquirer-based alternative needs to be found or built.
 *
 * @param Config - The options for the prompt.
 * @returns The `Item` selected by the user via the prompt.
 */
export async function FileSelector(Config: FFileSelectorConfig): Promise<Item>
{
    const { theme: InTheme, ...RemainingConfig } = Config;

    const InThemeKeys: Partial<PromptTheme["labels"]["keys"]> | undefined =
        InTheme?.labels?.keys;

    const BaseThemeKeys: Partial<PromptTheme["labels"]["keys"]> =
        {
            back: "←",
            down: "↓",
            forward: "→",
            up: "↑"
        };

    const keys: Partial<PromptTheme["labels"]["keys"]> = InThemeKeys === undefined
        ? BaseThemeKeys
        : { ...BaseThemeKeys, ...InThemeKeys };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { keys: _Keys, ...RemainingInLabels } = InTheme?.labels || { labels: { } };

    const theme: PartialDeep<Theme<PromptTheme>> =
        {
            labels:
            {
                keys,
                ...RemainingInLabels
            }
        };

    const BaseConfig: FFileSelectorConfigBase =
        {
            keybinds:
            {
                back: [ "left" ],
                confirm: [ "enter", "return" ],
                down: [ "down" ],
                forward: [ "right" ],
                up: [ "up" ]
            },
            loop: false,
            multiple: false,
            theme,
            type: "directory"
        };

    const MergedConfig: FFileSelectorConfigFull =
        {
            ...BaseConfig,
            ...RemainingConfig
        };

    return await fileSelector(MergedConfig);
}
