/**
 *
 *
 * @module @sorrell/effect-ink/Component/Primitive/Spinner
 *
 * @file      Spinner.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Color from "../../Color.ts";
import * as Ink from "ink";
import * as React from "react";
import * as Theme from "../Theme.tsx";
import InkSpinner from "ink-spinner";

export const Spinner = (): React.ReactNode =>
{
    const UserTheme: Theme.Theme = Theme.UseTheme();

    const transform = (
        children: string,
        _index: number
    ): string => Color.Apply(UserTheme.ColorPalette.InProgress, children);

    return <Ink.Transform { ...{ transform } }>
        <InkSpinner type={ UserTheme.Spinner } />
    </Ink.Transform>;
};
