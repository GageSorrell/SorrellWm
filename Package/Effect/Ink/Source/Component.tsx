/**
 * Components for the built-in prompts offered by this package.
 *
 * @module @sorrell/effect-ink/Component
 */

/**
 * @file      Component.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import type { ReactNode } from "react";

/** @internal */
export const RootComponent = (): ReactNode =>
{
    // const Foo = Ink.useApp();
    return (
        <Ink.Text>RootComponent</Ink.Text>
    );
};
