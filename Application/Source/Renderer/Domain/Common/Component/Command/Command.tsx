/* File:      Command.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ReactNode } from "react";
import type { FCommand, FCompoundCommand, FSimpleCommand, PCommand } from "./Command.Types";
import type { TSimpleFunction } from "!/Utility/Functional.Types";

export const AreCommandsEqual = (A: FCommand, B: FCommand): boolean =>
{
    return A.Name === B.Name;
};

export const IsCommandSimple = (In: FCommand): In is FSimpleCommand =>
{
    return "Keybinds" in In;
};

export const SwitchCommandType = <T,>(
    In: FCommand,
    OnSimple: TSimpleFunction<FSimpleCommand, T>,
    OnCompound: TSimpleFunction<FCompoundCommand, T>): T =>
{
    return IsCommandSimple(In)
        ? OnSimple(In)
        : OnCompound(In);
};

export const Command = (InCommand: PCommand): ReactNode =>
{
    const RootStyle: CSSProperties =
    {

    };

    return (
        <div style={ RootStyle }>
            { InCommand.Name }
        </div>
    );
};
