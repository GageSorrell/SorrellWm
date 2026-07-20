/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/Toggle/Types
 * @internal
 *
 * @file      Toggle.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type * as Prompt from "../../../Prompt.ts";
import type { Field } from "../../index.ts";

export type ToggleProps = Field.Props<Internal.ToggleState, Prompt.ToggleOptions>;

export type ToggleState = object;
