/**
 * The state of the {@link \@sorrell/effect-ink/Prompt/Text | text prompt}.
 *
 * @module @sorrell/effect-ink/Prompt/Text/TextState
 * @internal
 */

import type { Impl } from "../index.ts";

/**
 * @file      TextState.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// What to accomplish today:
//   * Everything into a service
//

export interface State extends Impl.State<string>
{
    readonly CursorIndex: number;
}

export type Props = Impl.State<string>;

export const UseTextState = (Props: Props): State =>
{
    return {
        ...Props,
        CursorIndex: 0,
        IsActive: true
    };
};
