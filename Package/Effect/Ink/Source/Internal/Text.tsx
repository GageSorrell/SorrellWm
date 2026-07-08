/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Text
 * @internal
 *
 * @file      Text.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import * as Struct from "effect/Struct";
import * as Text from "../Text.ts";
import Markdown from "@inkkit/ink-markdown";

export interface DisplayTextProps
{
    readonly Text: Text.Text;
}

export const DisplayText = ({ Text: InText }: DisplayTextProps): React.ReactNode =>
    Text.$Match(InText, {
        Markdown: (In: Text.Markdown): React.ReactNode =>
            <Markdown>{ Struct.get(In, "Value") as string }</Markdown>,
        Plain: Struct.get("Value"),
        Rich: Struct.get("Value")
    });
