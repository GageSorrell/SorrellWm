/**
 * @file      renderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    ListrSilentRendererOptions,
    ListrSilentRendererTask,
    ListrSilentRendererTaskOptions } from "./renderer.interface.js";
import type { ListrRenderer } from "@interfaces/index.js";

export class SilentRenderer implements ListrRenderer
{
    public static NonTty: boolean = true;
    public static RendererOptions: ListrSilentRendererOptions;
    public static RendererTaskOptions: ListrSilentRendererTaskOptions;

    constructor(
        public Tasks: Array<ListrSilentRendererTask>,
        public Options: ListrSilentRendererOptions
    ) { }

    public Render(): void
    {
        return;
    }

    public End(): void
    {
        return;
    }
}
