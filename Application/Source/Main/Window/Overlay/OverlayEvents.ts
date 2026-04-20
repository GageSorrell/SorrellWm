/**
 * @file      OverlayEvents.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    AnnotatePanel,
    BringIntoPanel,
    ChangeFocus,
    GetCellFromHandle,
    GetCurrentPanel,
    GetInterimFocusedVertex,
    GetNextIndex,
    GetPanelScreenshot,
    GetPanels,
    GetParent,
    GetPreviousIndex,
    GetRealSize,
    IsPanel,
    IsWindowTiled,
    Publish,
    SetInterimFocusedVertexToActive } from "#/Tree/Tree";
import { BlurBackground, Deactivate, GetActiveWindow, SetActiveWindow } from "./OverlayWindow";
import type {
    FAnnotatedPanel,
    FCell,
    FFocusChange,
    FFocusData,
    FFocusDataBase,
    FLogger,
    FPanel,
    FPanelStep,
    FSimpleCallback,
    FTiledMoveTransaction,
    FTranslation,
    FVertex,
    TEventCallback } from "../../../Shared";
import {
    type FBox,
    type FLogLevel,
    type FMonitorInfo,
    type FVector2D,
    GetFocusedWindow,
    GetMonitorFromWindow,
    GetMonitors,
    GetWindowShape,
    GetWindowTitle,
    type HMonitor,
    type HWindow,
    SetWindowPosition } from "@sorrellwm/windows";
import { GetDevSettings, GetLogger, LogFrontend } from "#/Development";
import { PoorEventFailureSimple, PoorEventSuccess, type TIpcCallback } from "#/Event";
import type { IFrontendEventRegistrar } from "../../../Shared/Event/Event.Types";
import type { TAwaitedCallback, TCallback, TCallbackReturnType } from "node_modules/electron-reactive-event/Distribution/Internal";

const Log: FLogger = GetLogger("OverlayEvents");

type FGetFocusDataReturnType = Awaited<ReturnType<TCallback<"GetFocusData", IFrontendEventRegistrar>>>;
const GetFocusData = async (): Promise<TAwaitedCallback<"GetFocusData", IFrontendEventRegistrar>> =>
{
    const CurrentPanel: FPanel | undefined = GetCurrentPanel();
    let FocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
    if (FocusedVertex === undefined)
    {
        SetInterimFocusedVertexToActive();
        FocusedVertex = GetInterimFocusedVertex();
    }

    if (FocusedVertex === undefined)
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Warn("GetFocusData cannot continue because FocusedVertex was undefined and could not be set.");
        return {
            Error: "FocusedVertexUndefined"
        };
    }

    if (CurrentPanel === undefined)
    {
        Log.Warn("GetFocusData cannot continue because CurrentPanel is undefined.");
        return {
            Error: "CurrentPanelUndefined"
        };
    }
    // if (CurrentPanel === undefined || FocusedVertex === undefined)
    // {
    /* eslint-disable-next-line @stylistic/max-len, @stylistic/max-len */
    //     Log("GetFocusData is returning without sending data because CurrentPanel or FocusedVertex is undefined.");
    //     return;
    // }

    const Direction: "Horizontal" | "Vertical" = CurrentPanel.Type;
    const ParentPanel: FPanel | undefined = GetParent(CurrentPanel);
    const CanStepUp: boolean = ParentPanel !== undefined;
    const CanStepDown: boolean = IsPanel(FocusedVertex);
    const CanMoveWithinPanel: boolean = CurrentPanel.Children.length > 1;
    const RealSize: FBox | undefined = await GetRealSize(FocusedVertex);

    if (RealSize === undefined)
    {
        return {
            Error: "UnspecifiedError"
        };
    }

    const DataBase: FFocusDataBase =
    {
        CanMoveWithinPanel,
        CanStepDown,
        CanStepUp,
        Direction,
        RealSize
    };

    let Out: FFocusData | undefined = undefined;

    if (IsPanel(FocusedVertex))
    {
        const NumVertices: number = FocusedVertex.Children.length;

        Out =
        {
            ...DataBase,
            NumVertices
        };
    }
    else
    {
        const FocusedWindowTitle: string = GetWindowTitle(FocusedVertex.Handle);

        Out =
        {
            ...DataBase,
            FocusedWindowTitle
        };
    }

    Log("GetFocusData is sending to the frontend:", Out);

    return {
        Data: Out

    };
};

export const OverlayEvents: Readonly<Array<TIpcCallback>> =
[
    GetFocusDataEvent,
    {
        Callback: async (InFocusChange: unknown): ReturnType<TEventCallback<"OnChangeFocus">> =>
        {
            const FocusChange: FFocusChange = InFocusChange as FFocusChange;

            ChangeFocus(FocusChange);
            Deactivate();

            // setTimeout((): void =>
            // {
            //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
            //     if (InterimFocus !== undefined)
            //     {
            //         BlurBackground(InterimFocus.Size);
            //     }
            // }, 250);

            const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
            if (InterimFocus !== undefined)
            {
                BlurBackground(InterimFocus.Size);
            }

            // GetFocusData(_Event, ...Arguments);
            Log("FocusChange", FocusChange);

            const Response: Awaited<ReturnType<TEventCallback<"GetFocusData">>> =
                await (GetFocusDataEvent.Callback as TEventCallback<"GetFocusData">)(undefined);

            return Response;
        },
        Channel: "OnChangeFocus"
    },
    {
        Callback: async (InTransaction: unknown): ReturnType<TEventCallback<"MoveTiledWindow">> =>
        {
            /**
             * @TODO Figure out how to have moving tiled window sit on top of panels while selecting,
             * such that the option to go "Down" is available iff the active window is currently on
             * top of a panel.
             */
            const Transaction: FTiledMoveTransaction = InTransaction as FTiledMoveTransaction;
            const ActiveWindow: HWindow | undefined = GetActiveWindow();
            if (ActiveWindow !== undefined)
            {
                const Cell: FCell | undefined = GetCellFromHandle(ActiveWindow);

                if (Cell !== undefined)
                {
                    const Parent: FPanel | undefined = GetParent(Cell);
                    if (Parent !== undefined)
                    {
                        const CurrentIndex: number = Parent.Children.indexOf(Cell);
                        const Actions: TRecord<FPanelStep, FSimpleCallback> =
                        {
                            // DownNext: (): void =>
                            // {
                            //     const SiblingPanel: FVertex | undefined = GetNextSibling(Cell);
                            //     if (SiblingPanel !== undefined && IsPanel(SiblingPanel))
                            //     {
                            //         Parent.Children.splice(CurrentIndex, 1);
                            //         SiblingPanel.Children.unshift(Cell);
                            //         Publish();
                            //     }
                            // },
                            // DownPrevious: (): void =>
                            // {
                            //     const SiblingPanel: FVertex | undefined = GetPreviousSibling(Cell);
                            //     if (SiblingPanel !== undefined && IsPanel(SiblingPanel))
                            //     {
                            //         Parent.Children.splice(CurrentIndex, 1);
                            //         SiblingPanel.Children.unshift(Cell);
                            //         Publish();
                            //     }
                            // },
                            Down: (): void =>
                            {

                            },
                            Next: (): void =>
                            {
                                const NextIndex: number | undefined = GetNextIndex(Cell);
                                if (NextIndex !== undefined)
                                {
                                    const Temporary: FVertex | undefined = Parent.Children[NextIndex];
                                    if (Temporary !== undefined)
                                    {
                                        Parent.Children[NextIndex] = Cell;
                                        Parent.Children[CurrentIndex] = Temporary;
                                    }
                                }
                            },
                            Previous: (): void =>
                            {
                                const CurrentIndex: number = Parent.Children.indexOf(Cell);
                                const PreviousIndex: number | undefined = GetPreviousIndex(Cell);
                                if (PreviousIndex !== undefined)
                                {
                                    const Temporary: FVertex | undefined = Parent.Children[PreviousIndex];
                                    if (Temporary !== undefined)
                                    {
                                        Parent.Children[PreviousIndex] = Cell;
                                        Parent.Children[CurrentIndex] = Temporary;
                                    }
                                }
                            },
                            Up: (): void =>
                            {
                                const Grandparent: FPanel | undefined = GetParent(Parent);
                                if (Grandparent !== undefined)
                                {
                                    const ParentIndex: number = Grandparent.Children.indexOf(Parent);
                                    Grandparent.Children.splice(ParentIndex, 0, Cell);
                                    const Index: number = Parent.Children.indexOf(Cell);
                                    Parent.Children.splice(Index, 1);
                                    Publish();
                                }
                            }
                        };

                        Actions[Transaction.Step]();

                        return {
                            Data:
                            {
                                IsOnPanel: false
                            },
                            Error: undefined
                        };
                    }
                }
            }

            return PoorEventFailureSimple();
        },
        Channel: "MoveTiledWindow"
    },
    {
        Callback: async (): ReturnType<TEventCallback<"GetIsActiveWindowTiled">> =>
        {
            const WindowToTile: HWindow | undefined = GetActiveWindow();
            if (WindowToTile !== undefined)
            {
                const IsTiled: boolean = IsWindowTiled(GetFocusedWindow());
                return {
                    Data: { IsTiled },
                    Error: undefined
                };
            }
            else
            {
                return {
                    Data: undefined,
                    Error: ""
                };
            }
        },
        Channel: "GetIsActiveWindowTiled"
    },
    {
        Callback: async (InPanel: unknown): ReturnType<TEventCallback<"BringIntoPanel">> =>
        {
            const Panel: FAnnotatedPanel = InPanel as FAnnotatedPanel;
            const WindowToTile: HWindow | undefined = GetActiveWindow();
            if (WindowToTile !== undefined)
            {
                BringIntoPanel(Panel, GetActiveWindow() as HWindow);
                return {
                    Data: undefined,
                    Error: undefined
                };
            }
            else
            {
                return {
                    Data: undefined,
                    Error: ""
                };
            }
        },
        Channel: "BringIntoPanel"
    },
    {
        Callback: async (): ReturnType<TEventCallback<"GetMonitorFromFocusedWindow">> =>
        {
            const ActiveWindow: HWindow | undefined = GetActiveWindow();
            if (ActiveWindow !== undefined)
            {
                const Monitor: HMonitor = GetMonitorFromWindow(ActiveWindow);
                return {
                    Data: { Monitor },
                    Error: undefined
                };
            }
            else
            {
                return {
                    Data: undefined,
                    Error: "ActiveWindowUndefined"
                };
            }
        },
        Channel: "GetMonitorFromFocusedWindow"
    },
    {
        Callback: async (InTranslation: unknown): ReturnType<TEventCallback<"MoveFloatingWindow">> =>
        {
            const Translation: FTranslation = InTranslation as FTranslation;
            const ActiveWindow: HWindow | undefined = GetActiveWindow();
            if (ActiveWindow !== undefined)
            {
                const { Height, Width, X, Y }: FBox = GetWindowShape(ActiveWindow);
                const NewShape: FBox = Translation.Direction === "X"
                    ? {
                        Height,
                        Width,
                        X: X + Translation.Distance,
                        Y
                    }
                    : {
                        Height,
                        Width,
                        X,
                        Y: Y + Translation.Distance
                    };

                const LeftCorner: FVector2D = { X, Y };
                const RightCorner: FVector2D = { X: X + Width, Y };

                const WouldBeOutOfBounds: boolean =
                    !GetMonitors().some(({ Size }: FMonitorInfo): boolean =>
                    {
                        const IsPointInBounds = (Point: FVector2D): boolean =>
                        {
                            return (
                                Size.X <= Point.X && Point.X <= Size.X + Size.Width &&
                                Size.Y <= Point.Y && Point.Y <= Size.Y + Size.Height
                            );
                        };

                        return IsPointInBounds(LeftCorner) || IsPointInBounds(RightCorner);
                    });

                if (WouldBeOutOfBounds)
                {
                    return {
                        Data: undefined,
                        Error: ""
                    };
                }
                else
                {
                    SetWindowPosition(ActiveWindow, NewShape);
                    return {
                        Data: undefined,
                        Error: undefined
                    };
                }

            }
            else
            {
                return {
                    Data: undefined,
                    Error: ""
                };
            }
        },
        Channel: "MoveFloatingWindow"
    },
    {
        Callback: async (InStatements: unknown): ReturnType<TEventCallback<"Log">> =>
        {
            const [ Category, Level, ...Statements ] =
                InStatements as [ string, FLogLevel, ...TArray<unknown> ];

            LogFrontend(Category, Level, ...Statements);

            return PoorEventSuccess();
        },
        Channel: "Log"
    },
    {
        Callback: async (): ReturnType<TEventCallback<"RequestTearDown">> =>
        {
            SetActiveWindow(undefined);
            if (!GetDevSettings().StaticMode.Enabled)
            {
                Deactivate();
            }

            return PoorEventSuccess();
        },
        Channel: "RequestTearDown"
    },
    {
        Callback: async (): ReturnType<TEventCallback<"GetPanelScreenshots">> =>
        {
            const Panels: TArray<FPanel> = GetPanels();
            const Screenshots: TArray<string> = (await Promise.all(Panels.map(GetPanelScreenshot)))
                .filter((Value: string | undefined): boolean =>
                {
                    return Value !== undefined;
                }) as TArray<string>;

            return {
                Data: Screenshots,
                Error: undefined
            };
        },
        Channel: "GetPanelScreenshots"
    },
    {
        Callback: async (): ReturnType<TEventCallback<"GetAnnotatedPanels">> =>
        {
            const Panels: TArray<FPanel> = GetPanels();
            const AnnotatedPanels: TArray<FAnnotatedPanel> =
                (await Promise.all(Panels.map(AnnotatePanel)))
                    .filter((Value: FAnnotatedPanel | undefined): boolean =>
                    {
                        return Value !== undefined;
                    }) as TArray<FAnnotatedPanel>;

            return {
                Data: { AnnotatedPanels },
                Error: undefined
            };
        },
        Channel: "GetAnnotatedPanels"
    }
] as const;
