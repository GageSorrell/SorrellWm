/**
 * @file      Command.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FCommand, FCompoundCommand, FSimpleCommand } from "./Command.Types";
import type { TSimpleFunction } from "../../../../../Shared/Utility/Functional.Types";

export const AreCommandsEqual = (A: FCommand, B: FCommand): boolean =>
{
    return A.Name === B.Name;
};

export const IsCommandSimple = (In: FCommand): In is FSimpleCommand =>
{
    return !("SubCommands" in In);
};

export const SwitchOnCommandType = <Type>(
    In: FCommand,
    OnSimple: TSimpleFunction<FSimpleCommand, Type>,
    OnCompound: TSimpleFunction<FCompoundCommand, Type>
): Type =>
{
    if (IsCommandSimple(In))
    {
        return OnSimple(In);
    }
    {
        return OnCompound(In);
    }
};
