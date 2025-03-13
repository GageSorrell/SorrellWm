/* File:      Tree.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type {
    FCell,
    FForest,
    FPanel,
    FPanelBase,
    FPanelHorizontal,
    FVertex } from "./Tree.Types";
import {
    type FMonitorInfo,
    GetTileableWindows,
    GetMonitorFromWindow,
    type HMonitor,
    type HWindow,
    SetWindowPosition,
    GetWindowByName,
    GetWindowTitle} from "@sorrellwm/windows";
import { GetMonitors } from "./Monitor";
import { AreHandlesEqual } from "./Core/Utility";

const Forest: FForest = [ ];

export const GetForest = (): FForest =>
{
    return [ ...Forest ];
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

    Forest.push(...Monitors.map((Monitor: FMonitorInfo): FPanelHorizontal =>
    {
        console.log(`Here, MonitorHandle is ${ Monitor.Handle }.`);
        return {
            Children: [ ],
            MonitorId: Monitor.Handle,
            Size: Monitor.Size,
            Type: "Horizontal",
            ZOrder: 0
        };
    }));

    console.log(Forest);

    const TileableWindows: Array<HWindow> = GetTileableWindows();

    console.log(`Found ${ TileableWindows.length } tileable windows.`);

    TileableWindows.forEach((Handle: HWindow): void =>
    {
        const Monitor: HMonitor = GetMonitorFromWindow(Handle);
        const RootPanel: FPanelBase | undefined =
            Forest.find((Panel: FPanelBase): boolean =>
            {
                console.log(`Monitor is ${ JSON.stringify(Monitor) } and Panel.MonitorId is ${ JSON.stringify(Panel.MonitorId) }.`);
                const Info: FMonitorInfo | undefined =
                    Monitors.find((Foo: FMonitorInfo): boolean =>
                    {
                        return Foo.Handle.Handle === Panel.MonitorId?.Handle;
                    });

                console.log(`Size ${ JSON.stringify(Info?.Size) } WorkSize ${ JSON.stringify(Info?.WorkSize) }.`);

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
    });

    console.log(`Called SetWindowPosition for ${ Cells.length } windows.`);
};

const IsCell = (Vertex: FVertex): Vertex is FCell =>
{
    return "Handle" in Vertex;
};

/**
 * Run a function for each vertex until the function returns `false` for
 * an iteration.
 */
export const Traverse = (InFunction: (Vertex: FVertex) => boolean): void =>
{
    let Continues: boolean = true;
    const Recurrence = (Vertex: FVertex): void =>
    {
        if (Continues)
        {
            Continues = InFunction(Vertex);
            if (Continues && "Children" in Vertex)
            {
                for (const Child of Vertex.Children)
                {
                    Recurrence(Child);
                }
            }
        }
    };

    for (const Panel of Forest)
    {
        for (const Child of Panel.Children)
        {
            Recurrence(Child);
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
    return false;
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
    let FoundWindow: boolean = false;
    return Exists((Vertex: FVertex): boolean =>
    {
        if (!FoundWindow)
        {
            if (IsCell(Vertex))
            {
                if (AreHandlesEqual(Vertex.Handle, Handle))
                {
                    FoundWindow = true;
                }
            }
        }
        else
        {
            return false;
        }

        return true;
    });
};

InitializeTree();
