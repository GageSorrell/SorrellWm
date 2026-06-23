/**
 * The state of the {@link \@sorrell/effect-ink/Prompt/Select | select prompt}.
 *
 * @module @sorrell/effect-ink/Prompt/Select/SelectState
 * @internal
 */

/**
 * @file      SelectState.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Impl } from "../index.ts";
import type { ReactNode } from "react";

export interface Choice
{
    Description: ReactNode;
    Label: string;
    Owner: undefined | Choice;
}

export interface State<A> extends Impl.State<ReadonlyArray<A>, ReadonlyArray<Choice>>
{
    readonly Page: number;
    readonly Index: number;
}
