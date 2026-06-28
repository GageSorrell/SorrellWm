/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/Date/Types
 * @internal
 *
 * @file      Date.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type * as Prompt from "../../../Prompt.ts";
import type { Field } from "../../index.ts";

export type DateProps = Field.Props<Internal.DateState, Prompt.DateOptions>;

export type DateState = object;
