/**
 * Input handling (*e.g.*, keybinds) in `ink` prompts.
 *
 * @module @sorrell/effect-ink/Input
 */

/**
 * @file      Input.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Key as InkKey } from "ink";

export interface Input
{
    readonly Text: string;
    readonly Key: InkKey;
}
