/**
 * Internal tools for the {@link \@sorrell/effect-ink/Prompt/Prose} module.
 *
 * @module @sorrell/effect-ink/Internal/Prose
 */

/**
 * @file      Prose.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Prose from "../Prompt/Prose.tsx";
import type { ReactNode } from "react";

export interface HeaderProps extends Prose.Props, Prose.HeaderOptions
{
    readonly Title: Prose.Argument;
}

export const Header = (_Props: HeaderProps): ReactNode =>
{
    // @TODO
    return undefined;
};

export interface ExpositionProps extends Prose.Props
{
    readonly Body: Prose.Argument;
}

export const Exposition = (_Props: ExpositionProps): ReactNode =>
{
    // @TODO
    return undefined;
};

export const ComponentFromArgument = (Argument: Prose.Argument): Prose.Component =>
{
    if (typeof Argument !== "string")
    {
        return Argument;
    }
    else
    {
        return (_: Prose.Props) => Argument;
    }
};
