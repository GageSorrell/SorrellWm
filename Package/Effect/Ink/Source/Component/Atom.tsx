/**
 *
 *
 * @module @sorrell/effect-ink/Component/Atom
 *
 * @file      Atom.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Clack from "./Clack.js";
import * as Ink from "ink";
import * as React from "react";
import { Grid } from "./Primitive/index.ts";

export interface AtomProps extends React.PropsWithChildren, Omit<Clack.ClackArmProps, "Height"> { }

export const Atom = ({ children, ...ClackArmProps  }: AtomProps): React.ReactNode =>
{
    const BarBoxRef: React.RefObject<Ink.DOMElement | null> = React.useRef<Ink.DOMElement>(null);

    const { height: Height } = Ink.useBoxMetrics(BarBoxRef);

    return (
        <Grid.Row gap={ 1 }>
            <Grid.Column
                height="100%"
                marginRight={ 1 }
                width={ 1 }>
                <Clack.ClackArm { ...{ ...ClackArmProps, Height } } />
            </Grid.Column>
            <Grid.Column ref={ BarBoxRef }>
                { children }
            </Grid.Column>
        </Grid.Row>
    );
};
