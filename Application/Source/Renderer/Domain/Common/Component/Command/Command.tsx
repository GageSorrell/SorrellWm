/* File:      Command.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type EffectCallback, type ReactNode, useEffect } from "react";
import type { FCommand, FCompoundCommand, FSimpleCommand, PCommand } from "./Command.Types";
import type { TSimpleFunction } from "../../../../../Shared/Utility/Functional.Types";
import { Title3 } from "@fluentui/react-components";
import { UseShortcut } from "@/Keybind";

export const AreCommandsEqual = (A: FCommand, B: FCommand): boolean =>
{
    return A.Name === B.Name;
};

export const IsCommandSimple = (In: FCommand): In is FSimpleCommand =>
{
    return !("SubCommands" in In);
};

export const SwitchOnCommandType = <T,>(
    In: FCommand,
    OnSimple: TSimpleFunction<FSimpleCommand, T>,
    OnCompound: TSimpleFunction<FCompoundCommand, T>): T =>
{
    if (IsCommandSimple(In))
    {
        return OnSimple(In);
    }
    {
        return OnCompound(In);
    }
};

export const Command = ({ Callback, Keybind, Name  }: PCommand): ReactNode =>
{
    const RootStyle: CSSProperties =
    {

    };

    const { RegisterShortcut, UnregisterShortcut } = UseShortcut();
    useEffect((): ReturnType<EffectCallback> =>
    {
        RegisterShortcut(Callback, Keybind, Name, 0);
        return (): void =>
        {
            UnregisterShortcut(Keybind, false);
        };
    }, [ Callback, Keybind, Name, RegisterShortcut, UnregisterShortcut ]);

    return (
        <div style={ RootStyle }>
            <Title3>
                { Name }
            </Title3>
        </div>
    );
};
