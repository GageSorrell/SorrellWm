/**
 *
 *
 * @module @sorrell/effect-ink/Component/Float/Types
 * @internal
 *
 * @file      Float.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type * as Prompt from "../../../Prompt.ts";
import type { Field } from "../../index.ts";

export type FloatProps = Field.Props<Internal.NumberState, Prompt.FloatOptions>;

export type FloatState = object;
