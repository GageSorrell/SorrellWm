/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/AutoComplete/Types
 * @internal
 *
 * @file      AutoComplete.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type * as Prompt from "../../../Prompt.ts";
import type { Field } from "../../index.ts";

export type AutoCompleteProps<A> = Field.Props<Internal.AutoCompleteState, Prompt.AutoCompleteOptions<A>>;

export type AutoCompleteState = object;
