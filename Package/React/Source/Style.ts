/**
 * Types and utilities for defining styles, particularly useful for working with `makeStyles`
 * in {@link https://storybooks.fluentui.dev/react/ | \@fluentui/react-components}.
 *
 * @module @sorrell/react/Style
 *
 * @file      Style.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReadonlyRecord } from "effect/Record";

export type RootStyle = "Root";

export type Styles<K extends string> = ReadonlyRecord<K | RootStyle, string>;

export interface Styled<in out K extends string = string>
{
    readonly Style: Styles<K>;
}

export type Unstyled<Props extends object> = Omit<Props, "Style">;
