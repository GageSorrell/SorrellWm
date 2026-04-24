/**
 * @file      renderer.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrRendererTask } from "@interfaces/index.js";
import type { SilentRenderer } from "./renderer.js";

export type ListrSilentRendererTask = ListrRendererTask<typeof SilentRenderer>;

export type ListrSilentRendererOptions = unknown;

export type ListrSilentRendererTaskOptions = never;
