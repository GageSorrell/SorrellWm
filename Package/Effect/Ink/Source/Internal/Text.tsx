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

const Simple: (self: Text.Base<React.ReactNode>) => React.ReactNode =
    Struct.get<Text.Base<React.ReactNode>, "Value">("Value");

export const DisplayText = ({ Text: InText }: DisplayTextProps): React.ReactNode =>
    Text.$match(InText, {
        Markdown: (In: Text.Markdown): React.ReactNode => <Markdown>{ Simple(In) as string }</Markdown>,
        Plain: Struct.get("Value"),
        Rich: Struct.get("Value")
    });
