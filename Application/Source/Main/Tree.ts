/* File:      Tree.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { AreBoxesEqual, AreHandlesEqual } from "./Core/Utility";
import {
    CaptureScreenSectionToTempPngFile,
    type FMonitorInfo,
    GetApplicationFriendlyName,
    GetMonitorFriendlyName,
    GetMonitorFromWindow,
    GetTileableWindows,
    GetWindowTitle,
    type HMonitor,
    type HWindow,
    RestoreAllWindows,
    SetWindowPosition } from "@sorrellwm/windows";
import type {
    FAnnotatedPanel,
    FCell,
    FFocusChange,
    FForest,
    FPanel,
    FPanelBase,
    FVertex } from "./Tree.Types";
import { promises as Fs } from "fs";
import { GetActiveWindows } from "./MainWindow";
import { GetMonitors } from "./Monitor";
import type { TPredicate } from "@/Utility";
import type { FluentProviderContextValues } from "@fluentui/react-components";

const Forest: FForest = [ ];

export const GetForest = (): FForest =>
{
    return [ ...Forest ];
};

/** @TODO */
export const LogForest = (): void =>
{
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

    console.log(Monitors);

    Forest.push(...Monitors.map((Monitor: FMonitorInfo): FPanel =>
    {
        // console.log(`Here, MonitorHandle is ${ Monitor.Handle }.`);
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

    console.log(Forest);

    /** @TODO Consider changing this. */
    RestoreAllWindows();

    const TileableWindows: Array<HWindow> = GetTileableWindows();

    // console.log(`Found ${ TileableWindows.length } tileable windows.`);

    TileableWindows.forEach((Handle: HWindow): void =>
    {
        const Monitor: HMonitor = GetMonitorFromWindow(Handle);
        const RootPanel: FPanelBase | undefined =
            Forest.find((Panel: FPanelBase): boolean =>
            {
                // console.log(`Monitor is ${ JSON.stringify(Monitor) } and Panel.MonitorId is ${ JSON.stringify(Panel.MonitorId) }.`);
                const Info: FMonitorInfo | undefined =
                    Monitors.find((Foo: FMonitorInfo): boolean =>
                    {
                        return Foo.Handle.Handle === Panel.MonitorId?.Handle;
                    });

                // console.log(`Size ${ JSON.stringify(Info?.Size) } WorkSize ${ JSON.stringify(Info?.WorkSize) }.`);

                return Panel.MonitorId?.Handle === Monitor.Handle;
            });

        if (RootPanel === undefined)
        {
            // @TODO
            console.log("💡💡💡💡 RootPanel was undefined.");
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

        if (MonitorInfo === undefined)
        {
            // @TODO
        }
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
        console.log(`Setting position of ${ GetWindowTitle(Cell.Handle) } to ${ JSON.stringify(Cell.Size) }.`);
        SetWindowPosition(Cell.Handle, Cell.Size);
        /* At least for now, ignore SorrellWm windows. */
        // if (GetWindowTitle(Cell.Handle) !== "SorrellWm")
        // {
        //     SetWindowPosition(Cell.Handle, Cell.Size);
        // }
    });

    console.log(`Called SetWindowPosition for ${ Cells.length } windows.`);
};

const IsCell = (Vertex: FVertex): Vertex is FCell =>
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
export const ExistsExactlyOne = (Predicate: (Vertex: FVertex) => boolean): boolean =>
{
    return false;
};

export const ForAll = (Predicate: (Vertex: FVertex) => boolean): boolean =>
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

export const GetPanels = (): Array<FPanel> =>
{
    const Vertices: Array<FVertex> = Flatten();
    return Vertices.filter((Vertex: FVertex): boolean => !IsCell(Vertex)) as Array<FPanel>;
};

export const Publish = (): void =>
{
    Traverse((Vertex: FVertex): boolean =>
    {
        if (IsCell(Vertex))
        {
            SetWindowPosition(
                Vertex.Handle,
                Vertex.Size
            );
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
    const ScreenshotBuffer: Buffer =
        await Fs.readFile(CaptureScreenSectionToTempPngFile(Panel.Size));

    return "data:image/png;base64," + ScreenshotBuffer.toString("base64");
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
    const Handle: HWindow | undefined = GetActiveWindows()[0];
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
        console.log(`BringingIntoPanel: ${ GetWindowTitle(Handle) }.`);
        const Panel: FPanel | undefined = IsPanelAnnotated(InPanel)
            ? GetPanelFromAnnotated(InPanel)
            : InPanel;

        if (Panel !== undefined)
        {
            console.log("BringIntoPanel: PanelFromAnnotated was defined!");
            const OutCell: FCell = Cell(Handle);
            Panel.Children.push(OutCell);
            MakeSizesUniform(Panel);
            Publish();
        }
        else
        {
            console.log("BringIntoPanel: PanelFromAnnotated was UNDEFINED.");
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

    console.log("Begins GetPanelFromAnnotated, Panel is", LoggedPanel);
    return Find((Vertex: FVertex): boolean =>
    {
        if (IsPanel(Vertex))
        {
            console.log("Vertex is a panel.", Vertex);
            const AreEqual: boolean = ArePanelsEqual(Panel, Vertex);

            if (AreEqual)
            {
                console.log("Panels are equal", Panel, Vertex);
            }
            else
            {
                console.log("Panels are NOT equal", Panel, Vertex);
            }

            return AreEqual;
        }
        else
        {
            console.log("Vertex was NOT a panel", Vertex);
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

/** Get the index of the given `Vertex` in its parent panel.  Returns `undefined` if the `Vertex` is a root panel. */
export const GetIndexInPanel = (Vertex: FVertex): number | undefined =>
{
    const ParentPanel: FPanel | undefined = GetParent(Vertex);
    if (ParentPanel !== undefined)
    {
        let Index: number | undefined = ParentPanel.Children.indexOf((Child: FVertex): boolean =>
        {
            return AreVerticesEqual(Vertex, Child);
        });

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

export const ChangeFocus = (InterimVertex: FVertex, FocusChange: FFocusChange): FVertex | undefined =>
{
    const ParentPanel: FVertex | undefined = GetParent(InterimVertex);
    const InterimPanel: FPanel | undefined = IsPanel(InterimVertex)
        ? InterimVertex
        : undefined;
    switch (FocusChange)
    {
        case "Down":
            if (InterimPanel !== undefined && InterimPanel.Children[0])
            {
                return InterimPanel.Children[0];
            }

            break;
        case "Up":
            if (InterimPanel !== undefined && InterimPanel.Children[0])
            {
                return GetParent(InterimPanel);
            }

            break;
        case "Next":
            if (ParentPanel !== undefined)
            {
                const Index: number | undefined = GetIndexInPanel(InterimVertex);
                if (Index !== undefined)
                {
                    if (Index !== ParentPanel.Children.length - 1)
                    {
                        return ParentPanel.Children[Index + 1];
                    }
                    else
                    {
                        return ParentPanel.Children[0];
                    }
                }
            }

            break;
        case "Previous":
            if (ParentPanel !== undefined)
            {
                const Index: number | undefined = GetIndexInPanel(InterimVertex);
                if (Index !== undefined)
                {
                    if (Index !== 0)
                    {
                        return ParentPanel.Children[Index - 1];
                    }
                    else
                    {
                        return ParentPanel.Children[ParentPanel.Children.length - 1];
                    }
                }
            }

            break;
    }

    return undefined;
};

InitializeTree();
