/**
 * Immutable BSP-style tiling trees and their geometric projection.
 *
 * @module @sorrell/wm/Main/Tiling/Tree
 *
 * @file      Tree.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Box } from "@sorrell/math";
import type { Handle } from "@sorrell/windows";

export/** The directions in which a panel can arrange its children. */
const Orientation = Object.freeze({
    Horizontal: "Horizontal",
    Vertical: "Vertical"
} as const);

/** A panel arrangement direction. */
export type Orientation = typeof Orientation[keyof typeof Orientation];

/** A path from a workspace root to a descendant panel. */
export type Path = ReadonlyArray<0 | 1>;

/** A window tracked by the tiling manager. */
export interface ManagedWindow
{
    readonly InitialBounds: Box.Box;
    readonly Window: Handle.HWND;
}

/** A leaf that associates one native window with one layout rectangle. */
export interface WindowNode
{
    readonly _tag: "Window";
    readonly Value: ManagedWindow;
}

/** A binary panel that partitions its rectangle between two children. */
export interface PanelNode
{
    readonly _tag: "Panel";
    readonly Children: readonly [ Node, Node ];
    readonly Orientation: Orientation;
    readonly Ratio: number;
}

/** A node in a BSP tiling tree. */
export type Node =
    | PanelNode
    | WindowNode;

/** A monitor work area and the tiling tree assigned to it. */
export interface Workspace
{
    readonly Bounds: Box.Box;
    readonly Id: string;
    readonly Root: Node | null;
}

/** The complete immutable state owned by the tiling manager. */
export interface State
{
    readonly Workspaces: ReadonlyArray<Workspace>;
}

/** Information needed to adopt an existing native window. */
export interface WindowSeed extends ManagedWindow
{
    readonly WorkArea: Box.Box;
}

/** A native window and the rectangle assigned to it by the tree. */
export interface Placement
{
    readonly Bounds: Box.Box;
    readonly Window: Handle.HWND;
}

const MinimumRatio = 0.1;
const MaximumRatio = 0.9;

const ClampRatio = (Ratio: number): number => Number.isFinite(Ratio)
    ? Math.min(MaximumRatio, Math.max(MinimumRatio, Ratio))
    : 0.5;

const SplitBounds = (
    Bounds: Box.Box,
    Direction: Orientation,
    Ratio: number
): readonly [ Box.Box, Box.Box ] =>
{
    if (Direction === Orientation.Horizontal)
    {
        const Split = Bounds.Left + Math.floor(Box.Width(Bounds) * ClampRatio(Ratio));
        return [
            Box.Box(Bounds.Top, Split, Bounds.Bottom, Bounds.Left),
            Box.Box(Bounds.Top, Bounds.Right, Bounds.Bottom, Split)
        ];
    }

    const Split = Bounds.Top + Math.floor(Box.Height(Bounds) * ClampRatio(Ratio));
    return [
        Box.Box(Bounds.Top, Bounds.Right, Split, Bounds.Left),
        Box.Box(Split, Bounds.Right, Bounds.Bottom, Bounds.Left)
    ];
};

const DirectionForBounds = (Bounds: Box.Box): Orientation =>
    Box.Width(Bounds) >= Box.Height(Bounds)
        ? Orientation.Horizontal
        : Orientation.Vertical;

const CenterX = (Bounds: Box.Box): number => Bounds.Left + (Box.Width(Bounds) / 2);
const CenterY = (Bounds: Box.Box): number => Bounds.Top + (Box.Height(Bounds) / 2);

const SortWindows = (
    Windows: ReadonlyArray<ManagedWindow>,
    Direction: Orientation
): ReadonlyArray<ManagedWindow> => [ ...Windows ].sort((
    Left: ManagedWindow,
    Right: ManagedWindow
): number =>
{
    const Primary = Direction === Orientation.Horizontal
        ? CenterX(Left.InitialBounds) - CenterX(Right.InitialBounds)
        : CenterY(Left.InitialBounds) - CenterY(Right.InitialBounds);

    return Primary !== 0
        ? Primary
        : Direction === Orientation.Horizontal
            ? CenterY(Left.InitialBounds) - CenterY(Right.InitialBounds)
            : CenterX(Left.InitialBounds) - CenterX(Right.InitialBounds);
});

export/** Construct a frozen leaf for a managed native window. */
const Window = (Value: ManagedWindow): WindowNode => Object.freeze({
    Value: Object.freeze(Value),
    _tag: "Window" as const
});

export/** Construct a frozen binary panel with a normalized split ratio. */
const Panel = (
    Direction: Orientation,
    First: Node,
    Second: Node,
    Ratio: number = 0.5
): PanelNode => Object.freeze({
    Children: Object.freeze([ First, Second ]) as readonly [ Node, Node ],
    Orientation: Direction,
    Ratio: ClampRatio(Ratio),
    _tag: "Panel" as const
});

export/** Derive a stable workspace identity from virtual-screen work-area coordinates. */
const WorkspaceId = (Bounds: Box.Box): string =>
    `${ Bounds.Left },${ Bounds.Top },${ Bounds.Right },${ Bounds.Bottom }`;

export/** Build a balanced BSP tree ordered by the windows' existing screen positions. */
const BuildBalanced = (
    Windows: ReadonlyArray<ManagedWindow>,
    Bounds: Box.Box
): Node | null =>
{
    if (Windows.length === 0)
    {
        return null;
    }

    if (Windows.length === 1)
    {
        return Window(Windows[0]!);
    }

    const Direction = DirectionForBounds(Bounds);
    const Ordered = SortWindows(Windows, Direction);
    const Middle = Math.floor(Ordered.length / 2);
    const [ FirstBounds, SecondBounds ] = SplitBounds(Bounds, Direction, 0.5);
    const First = BuildBalanced(Ordered.slice(0, Middle), FirstBounds);
    const Second = BuildBalanced(Ordered.slice(Middle), SecondBounds);

    return First === null || Second === null
        ? First ?? Second
        : Panel(Direction, First, Second);
};

export/** Create a multi-workspace state by grouping existing windows by monitor work area. */
const FromWindowSeeds = (Seeds: ReadonlyArray<WindowSeed>): State =>
{
    const Groups = new Map<string, { Bounds: Box.Box; Windows: Array<ManagedWindow>; }>();

    for (const Seed of Seeds)
    {
        const Id = WorkspaceId(Seed.WorkArea);
        const Group = Groups.get(Id) ?? {
            Bounds: Seed.WorkArea,
            Windows: new Array<ManagedWindow>()
        };

        Group.Windows.push({ InitialBounds: Seed.InitialBounds, Window: Seed.Window });
        Groups.set(Id, Group);
    }

    const Workspaces: ReadonlyArray<Workspace> = [ ...Groups.entries() ]
        .map((Entry: [ string, { Bounds: Box.Box; Windows: Array<ManagedWindow>; } ]): Workspace =>
        {
            const [ Id, Group ] = Entry;
            return Object.freeze({
                Bounds: Group.Bounds,
                Id,
                Root: BuildBalanced(Group.Windows, Group.Bounds)
            });
        })
        .sort((Left: Workspace, Right: Workspace): number =>
            Left.Bounds.Top - Right.Bounds.Top || Left.Bounds.Left - Right.Bounds.Left);

    return Object.freeze({ Workspaces: Object.freeze(Workspaces) });
};

const LayoutNode = (
    Current: Node,
    Bounds: Box.Box,
    Out: Array<Placement>
): void =>
{
    if (Current._tag === "Window")
    {
        Out.push(Object.freeze({ Bounds, Window: Current.Value.Window }));
        return;
    }

    const [ FirstBounds, SecondBounds ] = SplitBounds(
        Bounds,
        Current.Orientation,
        Current.Ratio
    );

    LayoutNode(Current.Children[0], FirstBounds, Out);
    LayoutNode(Current.Children[1], SecondBounds, Out);
};

export/** Project every window leaf in a state to its assigned screen rectangle. */
const Layout = (Self: State): ReadonlyArray<Placement> =>
{
    const Out = new Array<Placement>();

    for (const WorkspaceValue of Self.Workspaces)
    {
        if (WorkspaceValue.Root !== null)
        {
            LayoutNode(WorkspaceValue.Root, WorkspaceValue.Bounds, Out);
        }
    }

    return Object.freeze(Out);
};

export/** Return all managed windows in depth-first layout order. */
const Windows = (Root: Node | null): ReadonlyArray<ManagedWindow> =>
{
    if (Root === null)
    {
        return [ ];
    }

    return Root._tag === "Window"
        ? [ Root.Value ]
        : [ ...Windows(Root.Children[0]), ...Windows(Root.Children[1]) ];
};

export/** Determine whether a tree contains a native window handle. */
const HasWindow = (Root: Node | null, HandleValue: Handle.HWND): boolean =>
    Windows(Root).some((Value: ManagedWindow): boolean => Value.Window === HandleValue);

const InsertAtWindow = (
    Root: Node,
    Target: Handle.HWND,
    Value: ManagedWindow,
    Direction: Orientation,
    Ratio: number
): readonly [ Node, boolean ] =>
{
    if (Root._tag === "Window")
    {
        return Root.Value.Window === Target
            ? [ Panel(Direction, Root, Window(Value), Ratio), true ]
            : [ Root, false ];
    }

    const [ First, InsertedFirst ] = InsertAtWindow(
        Root.Children[0],
        Target,
        Value,
        Direction,
        Ratio
    );

    if (InsertedFirst)
    {
        return [ Panel(Root.Orientation, First, Root.Children[1], Root.Ratio), true ];
    }

    const [ Second, InsertedSecond ] = InsertAtWindow(
        Root.Children[1],
        Target,
        Value,
        Direction,
        Ratio
    );

    return InsertedSecond
        ? [ Panel(Root.Orientation, Root.Children[0], Second, Root.Ratio), true ]
        : [ Root, false ];
};

export/** Insert a window beside a target leaf, or beside the last leaf when omitted. */
const InsertWindow = (
    Root: Node | null,
    Value: ManagedWindow,
    Direction: Orientation,
    Target?: Handle.HWND,
    Ratio: number = 0.5
): Node =>
{
    if (Root === null)
    {
        return Window(Value);
    }

    if (HasWindow(Root, Value.Window))
    {
        return Root;
    }

    const TargetWindow = Target ?? Windows(Root).at(-1)!.Window;
    const [ Next, Inserted ] = InsertAtWindow(
        Root,
        TargetWindow,
        Value,
        Direction,
        Ratio
    );

    return Inserted ? Next : Panel(Direction, Root, Window(Value), Ratio);
};

export/** Remove a window leaf and collapse any panel left with one child. */
const RemoveWindow = (Root: Node | null, HandleValue: Handle.HWND): Node | null =>
{
    if (Root === null)
    {
        return null;
    }

    if (Root._tag === "Window")
    {
        return Root.Value.Window === HandleValue ? null : Root;
    }

    const First = RemoveWindow(Root.Children[0], HandleValue);
    const Second = RemoveWindow(Root.Children[1], HandleValue);

    if (First === null)
    {
        return Second;
    }

    if (Second === null)
    {
        return First;
    }

    return First === Root.Children[0] && Second === Root.Children[1]
        ? Root
        : Panel(Root.Orientation, First, Second, Root.Ratio);
};

const UpdatePanel = (
    Root: Node,
    PathValue: Path,
    Transform: (PanelValue: PanelNode) => PanelNode,
    Depth: number = 0
): readonly [ Node, boolean ] =>
{
    if (Root._tag === "Window")
    {
        return [ Root, false ];
    }

    if (Depth === PathValue.length)
    {
        return [ Transform(Root), true ];
    }

    const ChildIndex = PathValue[Depth];
    if (ChildIndex === undefined)
    {
        return [ Root, false ];
    }

    const [ Child, Updated ] = UpdatePanel(
        Root.Children[ChildIndex],
        PathValue,
        Transform,
        Depth + 1
    );

    return Updated
        ? [
            Panel(
                Root.Orientation,
                ChildIndex === 0 ? Child : Root.Children[0],
                ChildIndex === 1 ? Child : Root.Children[1],
                Root.Ratio
            ),
            true
        ]
        : [ Root, false ];
};

export/** Change a panel's normalized split ratio and report whether the path existed. */
const SetPanelRatio = (
    Root: Node,
    PathValue: Path,
    Ratio: number
): readonly [ Node, boolean ] => UpdatePanel(
    Root,
    PathValue,
    (PanelValue: PanelNode) => Panel(
        PanelValue.Orientation,
        PanelValue.Children[0],
        PanelValue.Children[1],
        Ratio
    )
);

export/** Change a panel's child arrangement and report whether the path existed. */
const SetPanelOrientation = (
    Root: Node,
    PathValue: Path,
    Direction: Orientation
): readonly [ Node, boolean ] => UpdatePanel(
    Root,
    PathValue,
    (PanelValue: PanelNode) => Panel(
        Direction,
        PanelValue.Children[0],
        PanelValue.Children[1],
        PanelValue.Ratio
    )
);
