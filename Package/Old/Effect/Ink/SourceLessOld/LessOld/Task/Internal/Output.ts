/**
 * The internal module that corresponds to {@link \@sorrell/effect-ink/Task/Output}.
 *
 * @module @sorrell/effect-ink/Task/Internal/Output
 * @internal
 */

/**
 * @file      Output.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Output from "../Output.ts";
import type * as Task from "../Task.ts";
import type { Untagged } from "../../Utility.js";

export interface OutputImpl extends Untagged<Output.Output>
{
    Owner: Task.Handle;
}
