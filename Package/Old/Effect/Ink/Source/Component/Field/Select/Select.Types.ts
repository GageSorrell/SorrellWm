/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/Select/Types
 * @internal
 *
 * @file      Select.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type * as Prompt from "../../../Prompt.ts";
import type { Field } from "../../index.ts";

export type SelectProps<A> = Field.Props<Internal.SelectState, Prompt.SelectOptions<A>>;

export type SelectState = object;
