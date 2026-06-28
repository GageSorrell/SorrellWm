/**
 *
 *
 * @module @sorrell/effect-ink/Component/Integer/Types
 * @internal
 *
 * @file      Integer.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type * as Prompt from "../../../Prompt.ts";
import type { Field } from "../../index.ts";

export type IntegerProps = Field.Props<Internal.NumberState, Prompt.IntegerOptions>;

export type IntegerState = object;
