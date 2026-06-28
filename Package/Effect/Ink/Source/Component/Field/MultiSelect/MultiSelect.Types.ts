/**
 *
 *
 * @module @sorrell/effect-ink/Component/Field/MultiSelect/Types
 * @internal
 *
 * @file      MultiSelect.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type { Field } from "../../index.ts";

export type MultiSelectProps<A> =
    Field.Props<Internal.MultiSelectState, Internal.MultiSelectOptionsInternal<A>>;

export type MultiSelectState = object;

export type MultiSelectComponent<A> =
    Field.Component<Internal.MultiSelectState, Internal.MultiSelectOptionsInternal<A>>;
