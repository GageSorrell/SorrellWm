/**
 * @file      Focus.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { Body1Strong, tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactNode, type RefObject, useCallback, useEffect, useEffectEvent, useMemo, useReducer, useRef, useState, useTransition } from "react";
import {
    CommandContainer,
    type FCommand,
    type FCompoundCommand,
    type FSimpleCommand } from "@/Domain/Common/Component/Command";
import type { FFocusData, FPanelFocusData, FWindowFocusData } from "../../../../Shared/Event/Focus.Types";
import type { FLogger, FSimpleCallback } from "../../../../Shared";
import { UseSendIpcEventDeferred, UseSendIpcEventState } from "@/Event";
import { Action } from "@/Action";
import type { FFocusChange } from "../../../../Shared/Tree.Types";
import { GetLogger } from "@/Log";
import type { TIpcState } from "@/Event.Types";
import { WindowHeaderHorizontalRegular } from "@fluentui/react-icons";
import { UsePromise } from "@/Utility";
import type { ReadBookmark } from "electron";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Focus");

type PPanelFooter = Pick<FFocusData, "Direction"> & FPanelFocusData;
type PWindowFooter = FWindowFocusData;

type PFooter =
    | PPanelFooter
    | PWindowFooter
    | object;

type PPanelIcon = Pick<FFocusData, "Direction">;

const PanelIcon = ({ Direction }: PPanelIcon): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: Direction === "Horizontal"
            ? "row"
            : "column",
        justifyContent: "space-between",

        height: "2rem",
        width: "2rem"
    };

    const LeafLongEdgeLength: string = "2rem";
    const LeafShortEdgeLength: string = "0.75rem";

    const LeafStyleBase: CSSProperties =
    {
        height: Direction === "Horizontal"
            ? LeafLongEdgeLength
            : LeafShortEdgeLength,
        width: Direction === "Horizontal"
            ? LeafShortEdgeLength
            : LeafLongEdgeLength
    };

    const LeafOutlineStyle: CSSProperties =
    {
        ...LeafStyleBase,
        borderColor: tokens.colorNeutralForeground1,
        borderWidth: 4
    };

    const LeafFilledStyle: CSSProperties =
    {
        ...LeafStyleBase,
        backgroundColor: tokens.colorNeutralForeground1
    };

    return (
        <div style={ RootStyle }>
            <div style={ LeafFilledStyle }/>
            <div style={ LeafOutlineStyle }/>
        </div>
    );
};

const PanelFooter = ({ Direction, NumVertices }: PPanelFooter): ReactNode =>
{
    return (
        <>
            <PanelIcon { ...{ Direction } }/>
            <Body1Strong>
                { Direction }{" "}Panel &#8226; { NumVertices } Nodes
            </Body1Strong>
        </>
    );
};

const WindowFooter = ({ FocusedWindowTitle }: PWindowFooter): ReactNode =>
{
    /* @TODO Vary the cutoff with the width of the window. */
    const LengthCutoff: number = 40;
    const FocusedWindowTitleTruncated: string = (FocusedWindowTitle !== undefined)
        ? FocusedWindowTitle.length > LengthCutoff
            ? FocusedWindowTitle.slice(0, LengthCutoff) + "…"
            : FocusedWindowTitle
        : "Static Mode (No Window Focused)";

    const TextStyle: CSSProperties =
    {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    };

    return (
        <>
            <WindowHeaderHorizontalRegular fontSize={ 20 }/>
            <Body1Strong style={ TextStyle }>
                { FocusedWindowTitleTruncated }
            </Body1Strong>
        </>
    );
};

const Footer = (Props: PFooter): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: tokens.spacingHorizontalS,
        justifyContent: "center"
    };

    const ArePanelProps = (In: object): In is PPanelFooter =>
    {
        return "NumVertices" in In;
    };

    return Props !== undefined && (
        <div style={ RootStyle }>
            {
                ArePanelProps(Props)
                    ? PanelFooter(Props)
                    : WindowFooter(Props as PWindowFooter)
            }
        </div>
    );
};

type TRefreshablePromiseHookResult = readonly [
    Promise<void>,
    () => void
];

function UseRefreshablePromise(
    CreatePromise: () => Promise<void>
): TRefreshablePromiseHookResult
{
    const CreatePromiseReference: RefObject<() => Promise<void>> = useRef(CreatePromise);
    CreatePromiseReference.current = CreatePromise;

    const PromiseReference: RefObject<Promise<void> | null> = useRef<Promise<void> | null>(null);
    const [ , ForceRender ] = useReducer(
        (Value: number) =>
        {
            return Value + 1;
        },
        0
    );

    if (PromiseReference.current === null)
    {
        PromiseReference.current = CreatePromiseReference.current();
    }

    const Refresh: FSimpleCallback = useCallback((): void =>
    {
        PromiseReference.current = CreatePromiseReference.current();
        ForceRender();
    }, [ ]);

    return [ PromiseReference.current, Refresh ] as const;
}

export const Focus = (): ReactNode =>
{
    const [ SendIpcEvent ] = UseSendIpcEventDeferred();
    // const [ FocusData, SetFocusData ] = useState<FFocusData | undefined>(undefined);
    // const MakePromise = (): Promise<void> =>
    // {
    // };

    const InitialIpcEventPromise: Promise<TIpcState<"GetFocusData">> = useMemo(
        (): Promise<TIpcState<"GetFocusData">> => SendIpcEvent("GetFocusData", undefined),
        [ SendIpcEvent ]
    );

    const [ InitialResponse ] = UsePromise<TIpcState<"GetFocusData">>(
        InitialIpcEventPromise,
        { Data: undefined, Error: undefined, IsPending: true }
    );

    const [ NewResponse, SetNewResponse ] =
        useState<TIpcState<"GetFocusData">>({ Data: undefined, Error: undefined, IsPending: true });

    // const MakeOnChangeFocus: ((Direction: FFocusChange) => FSimpleCallback) =
    // const Mutex: RefObject<boolean> = useRef<boolean>(false);
    const OnChangeFocusBase: ((Direction: FFocusChange) => void) = (Direction: FFocusChange): void =>
    {
        // if (Mutex.current)
        // {
        //     return;
        // }

        // SendIpcEvent("OnChangeFocus", Direction).then(({ Data }: TIpcState<"OnChangeFocus">): void =>
        // {
        //     Mutex.current = true;

        //     if (Data !== undefined)
        //     {
        //         SetNewResponse((_Old: TIpcState<"GetFocusData">): TIpcState<"GetFocusData"> =>
        //         {
        //             return {
        //                 Data,
        //                 Error: undefined,
        //                 IsPending: false
        //             };
        //         });

        //         Mutex.current = false;
        //     }
        // });
    };

    const MakeOnChangeFocus: ((Direction: FFocusChange) => FSimpleCallback) =
        (_Direction: FFocusChange): FSimpleCallback => (() => { });
        // useCallback((Direction: FFocusChange): FSimpleCallback =>
        // {
        //     return (): void =>
        //     {
        //         OnChangeFocusBase(Direction);
        //     };
        // }, [ OnChangeFocusBase ]);

    const FocusData: TIpcState<"GetFocusData">["Data"] = NewResponse.Data === undefined
        ? InitialResponse.Data
        : NewResponse.Data;

    // const GetFocusDataRef: RefObject<boolean> = useRef<boolean>(true);
    // const GetFocusData: FSimpleCallback = useEffectEvent((): void =>
    // {
    //     if (GetFocusDataRef.current)
    //     {
    //         GetFocusDataRef.current = false;
    //         SendIpcEvent("GetFocusData", undefined).then(({ Data }: TIpcState<"GetFocusData">): void =>
    //         {
    //             if (Data !== undefined)
    //             {
    //                 SetFocusData(Data);
    //             }
    //         });
    //     }
    // });

    // useEffect((): void =>
    // {
    //     GetFocusData();
    // }, [ GetFocusData ]);

    // type FMakeOnChangeFocus = (Direction: FFocusChange) => FSimpleCallback;
    // const MakeOnChangeFocus: FMakeOnChangeFocus =
    //     useCallback((Direction: FFocusChange): FSimpleCallback =>
    //     {
    //         const Action = async (): Promise<void> =>
    //         {
    //             const NewResponse: TIpcState<"OnChangeFocus"> =
    //                 await SendIpcEvent("OnChangeFocus", Direction);

    //             if (NewResponse.Data !== undefined)
    //             {
    //                 SetFocusData(NewResponse.Data);
    //             }
    //         };

    //         return (): void =>
    //         {
    //             StartTransition(Action);
    //         };
    //     }, [ SendIpcEvent ]);

    const IsHorizontal: boolean = FocusData !== undefined
        ? FocusData.Direction === "Horizontal"
        : true;

    const MoveFocusPrevious: FSimpleCallback = MakeOnChangeFocus("Previous");
    const MoveFocusNext: FSimpleCallback = MakeOnChangeFocus("Next");

    const StepDownIntoPanel: FSimpleCallback = MakeOnChangeFocus("Down");
    const StepUpIntoPanel: FSimpleCallback = MakeOnChangeFocus("Up");

    const GetPreviousDirection = (): string =>
    {
        return IsHorizontal
            ? "Left"
            : "Up";
    };

    const GetNextDirection = (): string =>
    {
        return IsHorizontal
            ? "Right"
            : "Down";
    };

    const FooterRootStyle: CSSProperties =
    {
        alignItems: "center",
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        height: 48,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        width: "100vw"
    };

    const MoveFocusCommand: FCompoundCommand =
    {
        Description: "@TODO",
        Name: `Move Focus (${ GetPreviousDirection() } / ${ GetNextDirection() })`,
        SubCommands:
        [
            {
                Action: [ IsHorizontal ? "Direction.Left" : "Direction.Up" ],
                Callback: MoveFocusPrevious
            },
            {
                Action: [ IsHorizontal ? "Direction.Right" : "Direction.Down" ],
                Callback: MoveFocusNext
            }
        ]
    };

    const StepDownCommand: FSimpleCommand =
    {
        Action: [ "Primary[1]" ],
        Callback: StepDownIntoPanel,
        Description: "@TODO",
        Name: "Step Down into Panel"
    };

    const StepUpCommand: FSimpleCommand =
    {
        Action: [ "Primary[0]" ],
        Callback: StepUpIntoPanel,
        Description: "@TODO",
        Name: "Step Up into Panel"
    };

    const Commands: TArray<FCommand> = [ ];

    if (FocusData?.CanMoveWithinPanel)
    {
        Commands.push(MoveFocusCommand);
    }

    if (FocusData?.CanStepDown)
    {
        Commands.push(StepDownCommand);
    }

    if (FocusData?.CanStepUp)
    {
        Commands.push(StepUpCommand);
    }

    return (
        <>
            <Action>
                <CommandContainer { ...{ Commands } } />
            </Action>
            <div style={ FooterRootStyle }>
                <Footer { ...FocusData }/>
            </div>
        </>
    );
};
