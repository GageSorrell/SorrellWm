/**
 *
 *
 * @module @sorrell/effect-ink/Component/Text/Types
 * @internal
 *
 * @file      Text.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Ink from "ink";
import type * as Internal from "../../../Internal/Prompt.ts";
import type { Field } from "../../index.ts";

export type TextProps = Field.Props<Internal.TextState, Internal.TextOptionsInternal>;

export type TextState =
    Readonly<
        Pick<Ink.TextProps, "inverse"> &
        {
            children: string;
        }
    >;
