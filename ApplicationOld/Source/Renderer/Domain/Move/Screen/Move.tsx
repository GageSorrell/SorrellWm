/**
 * @file      Move.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { CommandContainer, type FCommand, type FCompoundCommand } from "@/Domain/Common";
import type { FPanelStep, FTiledMoveResult, FTranslation } from "../../../../Shared/Event/Move.Types";
import { type ReactElement, useCallback, useState } from "react";
import { UseSendIpcEvent, UseSendIpcEventDeferred } from "@/Temp";
import { Action } from "@/Action";
import type { TFunction } from "@sorrell/utilities/functional";
import type { TNonemptyArray } from "@sorrell/utilities/array";
import { UseIndexedValue } from "@sorrell/react";

export const Move = (): ReactElement =>
{
    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const [ MoveResult, SetMoveResult ] = useState<FTiledMoveResult>({ IsOnPanel: false });

    // @TODO Make this set of values editable as a setting.
    const StepSizes: TNonemptyArray<number> = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ];

    const [
        StepSize,
        StepSizeIndex,
        IncrementStepSize,
        DecrementStepSize
    ] = UseIndexedValue(StepSizes, { Value: 32 });

    const { Data } = UseSendIpcEvent("GetIsActiveWindowTiled", undefined);

    const IsTiled: boolean = Data !== undefined
        ? Data.IsTiled
        : false;

    // const ChangeMoveModeCommand: FSimpleCommand =
    // {
    //     Description: "@TODO",
    //     Name: ""
    // };

    const TranslationLeft: FTranslation =
        {
            Direction: "X",
            Distance: -1 * StepSize
        };

    const TranslationUp: FTranslation =
        {
            Direction: "Y",
            Distance: -1 * StepSize
        };

    const TranslationDown: FTranslation =
        {
            Direction: "Y",
            Distance: StepSize
        };

    const TranslationRight: FTranslation =
        {
            Direction: "X",
            Distance: StepSize
        };

    const MakeFloatingMoveCallback = useCallback((Translation: FTranslation): TFunction =>
    {
        return (): void =>
        {
            SendIpcEvent("MoveFloatingWindow", Translation);
        };
    }, [ SendIpcEvent ]);

    const FloatingDirectionCommands: FCompoundCommand =
        {
            Description: "@TODO",
            Name: "Move",
            SubCommands:
        [
            {
                Action: [ "Direction.Left" ],
                Callback: MakeFloatingMoveCallback(TranslationLeft)
            },
            {
                Action: [ "Direction.Up" ],
                Callback: MakeFloatingMoveCallback(TranslationUp)
            },
            {
                Action: [ "Direction.Down" ],
                Callback: MakeFloatingMoveCallback(TranslationDown)
            },
            {
                Action: [ "Direction.Right" ],
                Callback: MakeFloatingMoveCallback(TranslationRight)
            }
        ]
        };

    const MakeTiledMoveCallback = (Step: FPanelStep): (() => Promise<void>) =>
    {
        return async (): Promise<void> =>
        {
            const { Data } = await SendIpcEvent("MoveTiledWindow", { Step });
            if (Data !== undefined)
            {
                SetMoveResult(Data);
            }
        };
    };

    const TiledDirectionCommands: FCompoundCommand =
        {
            Description: "@TODO",
            Name: "Move",
            SubCommands:
        [
            {
                Action: [ "Direction.Left" ],
                Callback: MakeTiledMoveCallback("Previous")
            },
            {
                Action: [ "Direction.Up" ],
                Callback: MakeTiledMoveCallback("Up")
            },
            {
                Action: [ "Direction.Down" ],
                Callback: MakeTiledMoveCallback("Down")
            },
            {
                Action: [ "Direction.Right" ],
                Callback: MakeTiledMoveCallback("Next")
            }
        ]
        };

    const Commands: TArray<FCommand> = IsTiled
        ? [ TiledDirectionCommands ]
        : [ FloatingDirectionCommands ];

    return (
        <Action>
            <CommandContainer { ...{ Commands } } />
        </Action>
    );
};
