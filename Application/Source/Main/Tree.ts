/* File:      Tree.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
    AreBoxesEqual,
    AreHandlesEqual,
    BoxToString,
    GetPngBase64,
    PositionToString } from "./Utility/Utility";
import {
    CaptureScreenSectionToTempPngFile,
    type FBox,
    type FMonitorInfo,
    GetApplicationFriendlyName,
    GetMonitorFriendlyName,
    GetMonitorFromWindow,
    GetTileableWindows,
    GetWindowLocationAndSize,
    GetWindowTitle,
    type HMonitor,
    type HWindow,
    SetForegroundWindow,
    SetWindowPosition } from "@sorrellwm/windows";
import type {
    FAnnotatedPanel,
    FCell,
    FFocusChange,
    FForest,
    FGapData,
    FLogTransformer,
    FPanel,
    FPanelBase,
    FVertex } from "./Tree.Types";
import { type FLogger, GetLogger } from "./Development";
import { type FSettings, GetSettings } from "./Settings";
import { promises as Fs } from "fs";
import { GetActiveWindow } from "./MainWindow";
import { GetMonitors } from "./Monitor";
import { type TPredicate } from "@/Utility";

const Log: FLogger = GetLogger("Tree");

const Forest: FForest = [ ];

export const GetForest = (): FForest =>
{
    return [ ...Forest ];
};

const GetDepth = (Vertex: FVertex): number =>
{
    let Depth: number = 0;
    let Parent: FPanel | undefined = GetParent(Vertex);

    while (Parent !== undefined)
    {
        Depth++;
        Parent = GetParent(Parent);
    }

    return Depth;
};

/**
 * Log the contents of the forest.
 * @param Transformer - Optionally, pass a function to transform the log statement for each vertex,
 *                      based upon the behavior that you wish to describe by logging.
 */
export const LogForest = (Transformer?: FLogTransformer): void =>
{
    let OutString: string = "";

    Traverse((Vertex: FVertex): boolean =>
    {
        const Depth: number = GetDepth(Vertex);
        const LeftPadding: string = "  ".repeat(Depth);
        OutString += LeftPadding;

        if (IsPanel(Vertex))
        {
            const PanelLog: string = `${ Vertex.Type } Panel`;
            if (Transformer !== undefined)
            {
                OutString += Transformer(Vertex, Depth, PanelLog);
            }
            else
            {
                OutString += PanelLog;
            }
        }
        else
        {
            const CellLog: string = `${ GetWindowTitle(Vertex.Handle) } `;
            if (Transformer !== undefined)
            {
                OutString += Transformer(Vertex, Depth, CellLog);
            }
            else
            {
                OutString += CellLog;
            }
        }

        OutString += "\n";

        return true;
    });

    Log(OutString);
};

const Cell = (Handle: HWindow): FCell =>
{
    return {
        Handle,
        Size: { Height: 0, Width: 0, X: 0, Y: 0 },
        ZOrder: 0
    };
};

export const UpdateForest = (UpdateFunction: (OldForest: FForest) => FForest): void =>
{
    const NewForest: FForest = UpdateFunction([ ...Forest ]);
    Forest.length = 0;
    Forest.push(...NewForest);

    // @TODO Move and resize, and sort ZOrder of all windows being tiled by SorrellWm.
};

const InitializeTree = (): void =>
{
    const Monitors: Array<FMonitorInfo> = GetMonitors();

    Forest.push(...Monitors.map((Monitor: FMonitorInfo): FPanel =>
    {
        return {
            Children: [ ],
            MonitorId: Monitor.Handle,
            Size: Monitor.Size,
            Type: Monitor.Size.Width < Monitor.Size.Height
                ? "Vertical"
                : "Horizontal",
            ZOrder: 0
        };
    }));

    // console.log(Forest);

    // /** @TODO Consider changing this. */
    // RestoreAllWindows();

    const TileableWindows: Array<HWindow> = GetTileableWindows().filter((Handle: HWindow): boolean =>
    {
        /** @TODO For now, exclude VS Code, just to make development less annoying. */
        return !GetWindowTitle(Handle).includes("SorrellWm (Workspace)");
    });

    // console.log(`Found ${ TileableWindows.length } tileable windows.`);

    TileableWindows.forEach((Handle: HWindow): void =>
    {
        const Monitor: HMonitor = GetMonitorFromWindow(Handle);
        const RootPanel: FPanelBase | undefined =
            Forest.find((Panel: FPanelBase): boolean =>
            {
                /* eslint-disable @stylistic/max-len */
                // console.log(`Monitor is ${ JSON.stringify(Monitor) } and Panel.MonitorId is ${ JSON.stringify(Panel.MonitorId) }.`);
                // const Info: FMonitorInfo | undefined =
                //     Monitors.find((Foo: FMonitorInfo): boolean =>
                //     {
                //         return Foo.Handle.Handle === Panel.MonitorId?.Handle;
                //     });

                // console.log(`Size ${ JSON.stringify(Info?.Size) } WorkSize ${ JSON.stringify(Info?.WorkSize) }.`);
                /* eslint-enable @stylistic/max-len */

                return Panel.MonitorId?.Handle === Monitor.Handle;
            });

        if (RootPanel === undefined)
        {
            // @TODO
            Log("RootPanel was undefined.");
        }
        else
        {
            RootPanel.Children.push(Cell(Handle));
        }
    });

    Forest.forEach((Panel: FPanel): void =>
    {
        const MonitorInfo: FMonitorInfo | undefined =
            Monitors.find((InMonitor: FMonitorInfo): boolean => InMonitor.Handle === Panel.MonitorId);

        /* @TODO For now, skip the main monitor. */
        if (MonitorInfo?.Size.Width === 3440)
        {
            return;
        }

        if (MonitorInfo === undefined)
        {
            // @TODO
        }
        // else if (AreBoxesEqual(MonitorInfo.WorkSize, ))
        else
        {
            Panel.Children = Panel.Children.map((Child: FVertex, Index: number): FVertex =>
            {
                const UniformWidth: number = MonitorInfo.WorkSize.Width / Panel.Children.length;
                const OutChild: FVertex = { ...Child };
                OutChild.Size =
                {
                    ...MonitorInfo.WorkSize,
                    Width: UniformWidth,
                    X: UniformWidth * Index + MonitorInfo.WorkSize.X
                };

                return OutChild;
            });
        }
    });

    const Cells: Array<FCell> = GetAllCells(Forest);

    Cells.forEach((Cell: FCell): void =>
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Verbose(`Setting position of ${ GetWindowTitle(Cell.Handle) } to ${ JSON.stringify(Cell.Size) }.`);
        SetWindowPosition(Cell.Handle, Cell.Size);
        /* At least for now, ignore SorrellWm windows. */
        // if (GetWindowTitle(Cell.Handle) !== "SorrellWm")
        // {
        //     SetWindowPosition(Cell.Handle, Cell.Size);
        // }
    });
};

export const IsCell = (Vertex: FVertex): Vertex is FCell =>
{
    return "Handle" in Vertex;
};

export const Flatten = (): Array<FVertex> =>
{
    const OutArray: Array<FVertex> = [ ];

    Traverse((Vertex: FVertex): boolean =>
    {
        OutArray.push(Vertex);
        return true;
    });

    return OutArray;
};

/**
 * Run a function for each vertex until the function returns `false` for
 * an iteration.
 */
export const Traverse = (Predicate: TPredicate<FVertex>, Entry?: FVertex): void =>
{
    let Continues: boolean = true;
    const Recurrence = (Vertex: FVertex): void =>
    {
        if (Continues)
        {
            Continues = Predicate(Vertex);
            if (Continues && "Children" in Vertex)
            {
                for (const Child of Vertex.Children)
                {
                    Recurrence(Child);
                }
            }
        }
    };

    if (Entry)
    {
        Recurrence(Entry);
    }
    else
    {
        for (const Panel of Forest)
        {
            Recurrence(Panel);
        }
    }
};

const GetAllCells = (Panels: Array<FPanel>): Array<FCell> =>
{
    const Result: Array<FCell> = [ ];

    function Traverse(Vertex: FVertex): void
    {
        if ("Handle" in Vertex)
        {
            Result.push(Vertex as FCell);
        }
        else if ("Children" in Vertex)
        {
            for (const Child of Vertex.Children)
            {
                Traverse(Child);
            }
        }
    }

    for (const Panel of Panels)
    {
        for (const Child of Panel.Children)
        {
            Traverse(Child);
        }
    }

    return Result;
};

export const Exists = (Predicate: (Vertex: FVertex) => boolean): boolean =>
{
    let DoesExist: boolean = false;
    Traverse((Vertex: FVertex): boolean =>
    {
        if (!DoesExist)
        {
            DoesExist = Predicate(Vertex);
        }

        return !DoesExist;
    });

    return DoesExist;
};

/** @TODO */
export const ExistsExactlyOne = (_Predicate: (Vertex: FVertex) => boolean): boolean =>
{
    return false;
};

export const ForAll = (_Predicate: (Vertex: FVertex) => boolean): boolean =>
{
    return false;
};

export const IsWindowTiled = (Handle: HWindow): boolean =>
{
    return Exists((Vertex: FVertex): boolean =>
    {
        return IsCell(Vertex) && AreHandlesEqual(Vertex.Handle, Handle);
    });
};

export const GetCellFromHandle = (Handle: HWindow): FCell | undefined =>
{
    return Find((Vertex: FVertex): boolean =>
    {
        return IsCell(Vertex) && AreHandlesEqual(Vertex.Handle, Handle);
    }) as FCell | undefined;
};

export const GetPanels = (): Array<FPanel> =>
{
    const Vertices: Array<FVertex> = Flatten();
    return Vertices.filter((Vertex: FVertex): boolean => !IsCell(Vertex)) as Array<FPanel>;
};

const TraverseLevelOrder = (Root: FVertex, Callback: (Vertex: FVertex, Level: number) => void): void =>
{
    const Queue: Array<{ Vertex: FVertex; Level: number }> = [ { Level: 0, Vertex: Root } ];
    while (Queue.length > 0)
    {
        const { Vertex, Level } = Queue.shift()!;
        Callback(Vertex, Level);
        if (IsPanel(Vertex))
        {
            for (const Child of Vertex.Children)
            {
                Queue.push({ Level: Level + 1, Vertex: Child });
            }
        }
    }
};

const ComputeGapData = (): Map<FVertex, FBox> =>
{
    const GapData: Map<FVertex, FGapData> = new Map<FVertex, FGapData>();

    /** @TODO Make this a setting. */
    const Gap: number = 4;

    Forest.forEach((Root: FVertex): void =>
    {
        /* Apply the outer margin. */
        GapData.set(
            Root,
            {
                AdjustedSize:
                {
                    Height: Root.Size.Height - 2 * Gap,
                    Width: Root.Size.Width - 2 * Gap,
                    X: Root.Size.X + Gap,
                    Y: Root.Size.Y + Gap
                },
                PrincipalRatio: 1
            }
        );

        // const GetPreviousVertex = (Vertex: FVertex, Parent: FPanel): FVertex | undefined =>
        // {
        //     const Index: number | undefined = GetIndexInPanel(Vertex);
        //     if (Index !== undefined)
        //     {
        //         return Index > 0
        //             ? Parent.Children[Index - 1]
        //             : undefined;
        //     }
        //     else
        //     {
        /* eslint-disable-next-line @stylistic/max-len */
        //         Log.Error("GetPreviousVertex called GetIndexInPanel, which returned undefined.  This should never happen!");
        //         return undefined;
        //     }
        // };

        const GetCumulativePreviousPrincipalRatios = (Vertex: FVertex, Parent: FPanel): number | undefined =>
        {
            const GivenIndex: number | undefined = GetIndexInPanel(Vertex);
            if (GivenIndex === undefined)
            {
                Log.Error("Oops.");
                return undefined;
            }
            else if (GivenIndex === 0)
            {
                return 0;
            }
            else
            {
                let CumulativePreviousPrincipalMeasures: number = 0;
                const PrincipalMeasure: "Height" | "Width" = Parent.Type === "Horizontal"
                    ? "Width"
                    : "Height";

                for (let Index: number = 0; Index < GivenIndex; Index++)
                {
                    CumulativePreviousPrincipalMeasures += Parent.Children[Index].Size[PrincipalMeasure];
                }

                return CumulativePreviousPrincipalMeasures / Parent.Size[PrincipalMeasure];
            }
        };

        TraverseLevelOrder(Root, (Vertex: FVertex, _Level: number): void =>
        {
            if (IsPanel(Vertex))
            {
                return;
            }

            const Parent: FVertex | undefined = GetParent(Vertex);
            if (Parent === undefined)
            {
                Log.Error("Beep boop.");
                return;
            }

            const PrincipalAxis: "X" | "Y" = Parent.Type === "Horizontal"
                ? "X"
                : "Y";

            const PrincipalMeasure: "Height" | "Width" = Parent.Type === "Horizontal"
                ? "Width"
                : "Height";

            const PrincipalRatio: number = Vertex.Size[PrincipalMeasure] / Parent.Size[PrincipalMeasure];

            const CumulativePreviousRatios: number | undefined =
                GetCumulativePreviousPrincipalRatios(Vertex, Parent);

            if (CumulativePreviousRatios === undefined)
            {
                Log.Error("Oops.");
                return;
            }

            const ParentGapData: FGapData | undefined = GapData.get(Parent);
            if (ParentGapData === undefined)
            {
                Log.Error("Oops.");
                return;
            }

            const Index: number | undefined = GetIndexInPanel(Vertex);
            if (Index === undefined)
            {
                Log.Error("Oops.");
                return;
            }

            // const TotalGapSizeInPanel: number = (Parent.Children.length - 1) * Gap;

            /* The amount of space that will be taken up by vertices in the parent panel. */
            const ParentWorkPrincipalMeasure: number =
                ParentGapData.AdjustedSize[PrincipalMeasure] - Gap * (Parent.Children.length - 1);

            const CumulativePreviousGaps: number = Index * Gap;

            /* The amount of space that will be taken up in the panel by all previous vertices *and* gaps. */
            const CumulativePrincipalDistance: number =
                CumulativePreviousRatios * ParentWorkPrincipalMeasure + CumulativePreviousGaps;

            const X: number = Math.round(
                Parent.Type === "Horizontal"
                    ? ParentGapData.AdjustedSize.X + CumulativePrincipalDistance
                    : ParentGapData.AdjustedSize.X
            );

            const Y: number = Math.round(
                Parent.Type === "Horizontal"
                    ? ParentGapData.AdjustedSize.Y
                    : ParentGapData.AdjustedSize.Y + CumulativePrincipalDistance
            );

            const Height: number = Math.round(
                Parent.Type === "Horizontal"
                    ? ParentGapData.AdjustedSize.Height
                    : PrincipalRatio * ParentWorkPrincipalMeasure
            );

            const Width: number = Math.round(
                Parent.Type === "Horizontal"
                    ? PrincipalRatio * ParentWorkPrincipalMeasure
                    : ParentGapData.AdjustedSize.Width
            );

            GapData.set(
                Vertex,
                {
                    AdjustedSize:
                    {
                        Height,
                        Width,
                        X,
                        Y
                    },
                    PrincipalRatio
                }
            );
        });
    });

    const Out: Map<FVertex, FBox> = new Map<FVertex, FBox>();

    GapData.forEach((GapData: FGapData, Vertex: FVertex): void =>
    {
        Out.set(Vertex, GapData.AdjustedSize);
    });

    return Out;
};

export const Publish = async (): Promise<void> =>
{
    const Settings: FSettings | undefined = await GetSettings();
    const GapSettingIsNonzero: boolean = Settings !== undefined && Settings.Gap > 0;
    const GapAdjustedSizes: Map<FVertex, FBox> | undefined = GapSettingIsNonzero
        ? ComputeGapData()
        : undefined;

    Traverse((Vertex: FVertex): boolean =>
    {
        if (IsCell(Vertex))
        {
            if (GapSettingIsNonzero)
            {
                if (GapAdjustedSizes !== undefined)
                {
                    const AdjustedSize: FBox | undefined = GapAdjustedSizes.get(Vertex);
                    if (AdjustedSize !== undefined)
                    {
                        SetWindowPosition(
                            Vertex.Handle,
                            AdjustedSize
                        );

                        /* eslint-disable-next-line @stylistic/max-len */
                        Log(`Cell ${ GetWindowTitle(Vertex.Handle).slice(0, 12) } has bounds ${ BoxToString(AdjustedSize) }.`);
                    }
                }
            }
            else
            {
                SetWindowPosition(
                    Vertex.Handle,
                    Vertex.Size
                );
            }
        }

        return true;
    });
};

function PanelContainsVertex(currentVertex: FVertex, targetVertex: FVertex): boolean
{
    if (currentVertex === targetVertex)
    {
        return true;
    }

    // If this is a panel, check its children recursively
    if ("Children" in currentVertex)
    {
        for (const child of currentVertex.Children)
        {
            if (PanelContainsVertex(child, targetVertex))
            {
                return true;
            }
        }
    }

    return false;
}

export const GetRootPanel = (Vertex: FVertex): FPanel | undefined =>
{
    for (const Panel of Forest)
    {
        if (PanelContainsVertex(Panel, Vertex))
        {
            return Panel;
        }
    }

    return undefined;
};

const GetPanelApplicationNames = (Panel: FPanel): Array<string> =>
{
    const ResultNames: Array<string> = [ ];

    Traverse((Vertex: FVertex): boolean =>
    {
        if ("Handle" in Vertex)
        {
            const FriendlyName: string | undefined = GetApplicationFriendlyName(Vertex.Handle);
            if (FriendlyName !== undefined)
            {
                ResultNames.push(FriendlyName);
            }

            if (ResultNames.length >= 3)
            {
                return false;
            }
        }

        return true;
    }, Panel);

    return ResultNames;
};

export const AnnotatePanel = (Panel: FPanel): FAnnotatedPanel | undefined =>
{
    const RootPanel: FPanel | undefined = GetRootPanel(Panel);
    if (RootPanel !== undefined && RootPanel.MonitorId !== undefined)
    {
        const ApplicationNames: Array<string> = GetPanelApplicationNames(Panel);
        const IsRoot: boolean = RootPanel === Panel;
        const Monitor: string = GetMonitorFriendlyName(RootPanel.MonitorId) || "";

        return {
            ...Panel,

            ApplicationNames,
            IsRoot,
            Monitor,
            Screenshot: undefined
        };
    }

    return undefined;
};

export const GetPanelScreenshot = async (Panel: FPanel): Promise<string | undefined> =>
{
    const ScreenshotPath: string = CaptureScreenSectionToTempPngFile(Panel.Size);

    return await GetPngBase64(ScreenshotPath);
};

export const MakeSizesUniform = (Panel: FPanel): void =>
{
    Panel.Children.forEach((Child: FVertex, Index: number): void =>
    {
        if (Panel.Type === "Horizontal")
        {
            Child.Size.Width = Math.floor(Panel.Size.Width / Panel.Children.length);
            Child.Size.X = Panel.Size.X + Index * Child.Size.Width;
            Child.Size.Height = Panel.Size.Height;
            Child.Size.Y = Panel.Size.Y;
        }
        else if (Panel.Type === "Vertical")
        {
            Child.Size.Height = Math.floor(Panel.Size.Height / Panel.Children.length);
            Child.Size.Y = Panel.Size.Y + Index * Child.Size.Height;
            Child.Size.Width = Panel.Size.Width;
            Child.Size.X = Panel.Size.X;
        }
    });
};

export const IsPanelAnnotated = (Panel: FPanel | FAnnotatedPanel): Panel is FAnnotatedPanel =>
{
    return "Screenshot" in Panel;
};

export const GetCurrentPanel = (): FPanel | undefined =>
{
    const Handle: HWindow | undefined = GetActiveWindow();
    if (Handle !== undefined)
    {
        return Find((Vertex: FVertex): boolean =>
        {
            if (IsPanel(Vertex))
            {
                return Vertex.Children.some((Child: FVertex): boolean =>
                {
                    return IsCell(Child) && AreHandlesEqual(Child.Handle, Handle);
                });
            }
            else
            {
                return false;
            }
        }) as FPanel | undefined;
    }
    else
    {
        return undefined;
    }
};

export const BringIntoPanel = (InPanel: FPanel | FAnnotatedPanel, Handle: HWindow): void =>
{
    if (Handle !== undefined)
    {
        // console.log(`BringingIntoPanel: ${ GetWindowTitle(Handle) }.`);
        const Panel: FPanel | undefined = IsPanelAnnotated(InPanel)
            ? GetPanelFromAnnotated(InPanel)
            : InPanel;

        if (Panel !== undefined)
        {
            // console.log("BringIntoPanel: PanelFromAnnotated was defined!");
            const OutCell: FCell = Cell(Handle);
            Panel.Children.push(OutCell);
            MakeSizesUniform(Panel);
            Publish();
        }
        else
        {
            // console.log("BringIntoPanel: PanelFromAnnotated was UNDEFINED.");
        }
    }
};

// export const ArePanelsEqual = (A: FPanel | FAnnotatedPanel, B: FPanel | FAnnotatedPanel): boolean =>
// {
//     return AreBoxesEqual(A.Size, B.Size);
// };

export const Find = (Predicate: TPredicate<FVertex>): FVertex | undefined =>
{
    let Out: FVertex | undefined = undefined;

    Traverse((Vertex: FVertex): boolean =>
    {
        if (Out === undefined)
        {
            const Satisfies: boolean = Predicate(Vertex);
            if (Satisfies)
            {
                Out = Vertex;
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return true;
        }
    });

    return Out;
};

export const IsPanel = (Vertex: FVertex): Vertex is FPanel =>
{
    return "Children" in Vertex;
};

export const GetPanelFromAnnotated = (Panel: FAnnotatedPanel): FPanel | undefined =>
{
    const LoggedPanel: Partial<FPanel> =
    {
        Size: Panel.Size,
        Type: Panel.Type
    };

    Log("Begins GetPanelFromAnnotated, Panel is", LoggedPanel);
    return Find((Vertex: FVertex): boolean =>
    {
        if (IsPanel(Vertex))
        {
            Log("Vertex is a panel.", Vertex);
            const AreEqual: boolean = ArePanelsEqual(Panel, Vertex);

            if (AreEqual)
            {
                Log("Panels are equal", Panel, Vertex);
            }
            else
            {
                Log("Panels are NOT equal", Panel, Vertex);
            }

            return AreEqual;
        }
        else
        {
            Log("Vertex was NOT a panel", Vertex);
            return false;
        }
    }) as FPanel | undefined;
};

export const RemoveAnnotations = ({ Children, MonitorId, Size, Type, ZOrder }: FAnnotatedPanel): FPanel =>
{
    return {
        Children,
        MonitorId,
        Size,
        Type,
        ZOrder
    };
};

const ArePanelsEqual = (A: FPanel, B: FPanel): boolean =>
{
    /** @TODO To support stack boxes, check if children are also equal as well. */
    return A.Children.length === B.Children.length && AreBoxesEqual(A.Size, B.Size);
    // if (A.Children.length === B.Children.length)
    // {
    //     /* We impose that the order of the children must be the same. */
    //     return A.Children.every((AChild: FVertex, Index: number): boolean =>
    //     {
    //         const BChild: FVertex = B.Children[Index];
    //         return AreVerticesEqual(AChild, BChild);
    //     });
    // }
    // else
    // {
    //     return false;
    // }
};

export const AreVerticesEqual = (A: FVertex, B: FVertex): boolean =>
{
    if (IsCell(A) && IsCell(B))
    {
        return AreHandlesEqual(A.Handle, B.Handle);
    }
    else if (IsPanel(A) && IsPanel(B))
    {
        return ArePanelsEqual(A, B);
    }
    else
    {
        return false;
    }
};

/** Get the parent vertex of `Vertex`.  Returns undefined iff it is a root panel. */
export const GetParent = (Vertex: FVertex): FPanel | undefined =>
{
    return Find((InVertex: FVertex): boolean =>
    {
        if (IsPanel(InVertex))
        {
            return InVertex.Children.some((InChild: FVertex): boolean =>
            {
                return AreVerticesEqual(Vertex, InChild);
            });
        }
        else
        {
            return false;
        }
    }) as FPanel | undefined;
};

/**
 * Get the index of the given `Vertex` in its parent panel.
 * @returns `undefined` if the `Vertex` is a root panel.
 */
export const GetIndexInPanel = (Vertex: FVertex): number | undefined =>
{
    const ParentPanel: FPanel | undefined = GetParent(Vertex);
    if (ParentPanel !== undefined)
    {
        const Self: FVertex | undefined = ParentPanel.Children.find((Child: FVertex): boolean =>
        {
            return AreVerticesEqual(Vertex, Child);
        });

        if (Self !== undefined)
        {
            const Index: number | undefined = ParentPanel.Children.indexOf(Self);

            if (Index === -1)
            {
                return undefined;
            }
            else
            {
                return Index;
            }
        }
        else
        {
            return undefined;
        }
    }
    else
    {
        return undefined;
    }
};

let InterimFocusedVertex: FVertex | undefined = undefined;

export const SetInterimFocusedVertexToActive = (): void =>
{
    const ActiveWindow: HWindow | undefined = GetActiveWindow();
    if (ActiveWindow !== undefined)
    {
        InterimFocusedVertex = GetCellFromHandle(ActiveWindow);
    }
};

export const GetInterimFocusedVertex = (): FVertex | undefined =>
{
    return InterimFocusedVertex;
};

export const ClearInterimFocusedVertex = (): void =>
{
    InterimFocusedVertex = undefined;
};

export const VertexToString = (Vertex: FVertex): string =>
{
    return IsCell(Vertex)
        ? GetWindowTitle(Vertex.Handle)
        : `${ Vertex.Type } panel with ${ Vertex.Children.length } children.`;
};

// let ChangeFocusDebounceTime: number = 0;

export const ChangeFocus = (FocusChange: FFocusChange): void =>
{
    // const Now: number = new Date().getTime();
    // const DebounceDuration: number = 50;
    // if (Math.abs(Now - ChangeFocusDebounceTime) <= DebounceDuration && ChangeFocusDebounceTime !== 0)
    // {
    //     Log(`ChangeFocus was called too soon, just ${ Now - ChangeFocusDebounceTime }ms ago.`);
    //     return;
    // }
    // else
    // {
    //     ChangeFocusDebounceTime = Now;
    // }

    const LogChangeFocus = (): void =>
    {
        LogForest((Vertex: FVertex, _Depth: number, DefaultString: string): string =>
        {
            const PositionString: string = `(${ Vertex.Size.X }, ${ Vertex.Size.Y })`;
            return Vertex === InterimFocusedVertex
                ? `${ DefaultString } ${ PositionString } ** INTERIM **`
                : `${ DefaultString } ${ PositionString }`;
        });
    };

    if (InterimFocusedVertex === undefined)
    {
        const ActiveWindow: HWindow | undefined = GetActiveWindow();
        if (ActiveWindow !== undefined)
        {
            const ActiveWindowPosition: FBox = GetWindowLocationAndSize(ActiveWindow);
            /* eslint-disable-next-line @stylistic/max-len */
            Log(`In ChangeFocus, the ActiveWindow is ${ GetWindowTitle(ActiveWindow) } at ${ PositionToString(ActiveWindowPosition) }.`);
            InterimFocusedVertex = GetCellFromHandle(ActiveWindow);
        }
        else
        {
            Log("Whoops...");
        }
        return;
    }
    else
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log(`In ChangeFocus, InterimFocusedVertex was already defined and is ${ VertexToString(InterimFocusedVertex) } at ${ PositionToString(InterimFocusedVertex.Size) }.`);
    }

    const ParentPanel: FVertex | undefined = GetParent(InterimFocusedVertex);
    // /* I have no idea why this is needed. */
    // if (ParentPanel !== undefined)
    // {
    //     const NewIndex: number = ParentPanel.Children.indexOf(InterimFocusedVertex) + 1;
    //     Log(`In ChangeFocus, NewIndex is ${ NewIndex }.`);
    //     InterimFocusedVertex = ParentPanel.Children[NewIndex];
    // }

    Log("Before Changing Focus, this is the current Forest:");
    LogChangeFocus();

    switch (FocusChange)
    {
        case "Down":
            if (IsPanel(InterimFocusedVertex))
            {
                InterimFocusedVertex = InterimFocusedVertex.Children[0];
            }

            break;
        case "Up":
            if (ParentPanel !== undefined)
            {
                InterimFocusedVertex = ParentPanel;
            }

            break;
        case "Next":
            if (ParentPanel !== undefined)
            {
                const Index: number | undefined = GetIndexInPanel(InterimFocusedVertex);
                if (Index !== undefined)
                {
                    if (Index !== ParentPanel.Children.length - 1)
                    {
                        InterimFocusedVertex = ParentPanel.Children[Index + 1];
                    }
                    else
                    {
                        InterimFocusedVertex = ParentPanel.Children[0];
                    }
                }
            }

            break;
        case "Previous":
            if (ParentPanel !== undefined)
            {
                const Index: number | undefined = GetIndexInPanel(InterimFocusedVertex);
                Log.Verbose(`InChangeFocus, under case "Previous", Index is ${ Index }.`);
                /* eslint-disable-next-line @stylistic/max-len */
                Log(`After getting the Index under case "Previous", the InterimFocusedVertex has position (${ InterimFocusedVertex.Size.X }, ${ InterimFocusedVertex.Size.Y }).`);
                if (Index !== undefined)
                {
                    if (Index === 0)
                    {
                        InterimFocusedVertex = ParentPanel.Children[ParentPanel.Children.length - 1];
                    }
                    else
                    {
                        InterimFocusedVertex = ParentPanel.Children[Index - 1];
                    }
                }
                else
                {
                    Log("Whoops.");
                }
            }

            break;
    }

    Log("After Changing Focus, this is the current Forest:");
    LogChangeFocus();
};

/**
 * Given a panel, get its 0th cell.
 * @TODO Consider modifying this such that if the 0th child of the panel is a panel with no children,
 *       then try the 1st child, 2nd, etc.
 */
const GetZerothCell = (Panel: FPanel): FCell | undefined =>
{
    if (Panel.Children.length > 0)
    {
        return IsCell(Panel.Children[0])
            ? Panel.Children[0]
            : GetZerothCell(Panel.Children[0]);
    }
    else
    {
        return undefined;
    }
};

export const FinishFocus = (): void =>
{
    if (InterimFocusedVertex !== undefined)
    {
        if (IsCell(InterimFocusedVertex))
        {
            SetForegroundWindow(InterimFocusedVertex.Handle);
        }
        else if (InterimFocusedVertex.Children.length > 0)
        {
            const ZerothCell: FCell | undefined = GetZerothCell(InterimFocusedVertex);
            if (ZerothCell !== undefined)
            {
                SetForegroundWindow(ZerothCell.Handle);
            }
            else
            {
                /* eslint-disable-next-line @stylistic/max-len */
                Log.Warn("FinishFocus could not set the foreground window, because InterimFocusedVertex was a panel that did not have a zeroth child.");
            }
        }
    }
    else
    {
        const ActiveWindow: HWindow | undefined = GetActiveWindow();
        if (ActiveWindow !== undefined)
        {
            SetForegroundWindow(ActiveWindow);
        }
    }
};

InitializeTree();
