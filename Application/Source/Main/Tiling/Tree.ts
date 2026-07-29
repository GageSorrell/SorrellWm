/**
 * Immutable multi-child tiling trees and their geometric projection.
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
import type { TiledResizeBehavior } from "../../Shared/AppSettings.ts";

export/** The arrangements a panel can apply to its children. */
const Orientation = Object.freeze({
    Horizontal: "Horizontal",
    Stack: "Stack",
    Vertical: "Vertical"
} as const);

/** A panel child arrangement. */
export type Orientation = typeof Orientation[keyof typeof Orientation];

/** A path from a workspace root to a descendant node. */
export type Path = ReadonlyArray<number>;

export/** Directions used to move logical focus between panel children. */
const FocusDirection = Object.freeze({
    Down: "Down",
    Left: "Left",
    Right: "Right",
    Up: "Up"
} as const);

/** One logical panel-focus movement direction. */
export type FocusDirection = typeof FocusDirection[keyof typeof FocusDirection];

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

/** A panel that arranges two or more children within its rectangle. */
export interface PanelNode
{
    readonly _tag: "Panel";
    readonly Children: readonly [ Node, Node, ...Array<Node> ];
    readonly Orientation: Orientation;

    /**
     * The first child's normalized share.
     *
     * Retained for compatibility with the original binary-panel API. Use
     * {@link Ratios} when working with every child.
     */
    readonly Ratio: number;

    /** One normalized layout share per child, in child order. */
    readonly Ratios: ReadonlyArray<number>;
}

/** A node in a recursive tiling tree. */
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

const EqualRatios = (Count: number): ReadonlyArray<number> =>
    Object.freeze(Array.from({ length: Count }, () => 1 / Count));

const NormalizeRatios = (
    Count: number,
    Ratios?: ReadonlyArray<number>
): ReadonlyArray<number> =>
{
    if (
        Ratios === undefined
        || Ratios.length !== Count
        || Ratios.some((Ratio: number): boolean => !Number.isFinite(Ratio) || Ratio <= 0)
    )
    {
        return EqualRatios(Count);
    }

    const Total = Ratios.reduce((Sum: number, Ratio: number): number => Sum + Ratio, 0);
    return Object.freeze(Ratios.map((Ratio: number): number => Ratio / Total));
};

const NormalizeGap = (Gap: number): number =>
    Number.isFinite(Gap) ? Math.max(0, Math.floor(Gap)) : 0;

const InsetBounds = (Bounds: Box.Box, Gap: number): Box.Box =>
{
    const NormalizedGap = NormalizeGap(Gap);
    const HorizontalInset = Math.min(
        NormalizedGap,
        Math.floor(Math.max(0, Box.Width(Bounds)) / 2)
    );
    const VerticalInset = Math.min(
        NormalizedGap,
        Math.floor(Math.max(0, Box.Height(Bounds)) / 2)
    );

    return Box.Box(
        Bounds.Top + VerticalInset,
        Bounds.Right - HorizontalInset,
        Bounds.Bottom - VerticalInset,
        Bounds.Left + HorizontalInset
    );
};

const SplitBounds = (
    Bounds: Box.Box,
    Direction: Orientation,
    Ratios: ReadonlyArray<number>,
    Gap: number = 0
): ReadonlyArray<Box.Box> =>
{
    if (Direction === Orientation.Stack)
    {
        return Object.freeze(Ratios.map((): Box.Box => Bounds));
    }

    const Normalized = NormalizeRatios(Ratios.length, Ratios);
    const Length = Math.max(0, Direction === Orientation.Horizontal
        ? Box.Width(Bounds)
        : Box.Height(Bounds));
    const Start = Direction === Orientation.Horizontal
        ? Bounds.Left
        : Bounds.Top;
    const GapCount = Math.max(0, Normalized.length - 1);
    const AppliedGap = GapCount === 0
        ? 0
        : Math.min(NormalizeGap(Gap), Math.floor(Length / GapCount));
    const ContentLength = Length - (AppliedGap * GapCount);
    let Cursor: number = Start;
    let CumulativeRatio = 0;

    return Object.freeze(Normalized.map((Ratio: number, Index: number): Box.Box =>
    {
        CumulativeRatio += Ratio;
        const End = Index === Normalized.length - 1
            ? Start + Length
            : Start
                + Math.floor(ContentLength * CumulativeRatio)
                + (AppliedGap * Index);

        const ChildBounds = Direction === Orientation.Horizontal
            ? Box.Box(Bounds.Top, End, Bounds.Bottom, Cursor)
            : Box.Box(Cursor, Bounds.Right, End, Bounds.Left);

        Cursor = End + AppliedGap;
        return ChildBounds;
    }));
};

const SetRatioAt = (
    Ratios: ReadonlyArray<number>,
    ChildIndex: number,
    Ratio: number
): ReadonlyArray<number> =>
{
    if (
        !Number.isInteger(ChildIndex)
        || ChildIndex < 0
        || ChildIndex >= Ratios.length
    )
    {
        return Ratios;
    }

    const Minimum = Math.min(MinimumRatio, 0.5 / Ratios.length);
    const Maximum = 1 - (Minimum * (Ratios.length - 1));
    const Desired = Number.isFinite(Ratio)
        ? Math.min(Maximum, Math.max(Minimum, Ratio))
        : 1 / Ratios.length;
    const OtherTotal = Ratios.reduce(
        (Sum: number, Value: number, Index: number): number =>
            Index === ChildIndex ? Sum : Sum + Value,
        0
    );
    const OtherShare = 1 - Desired;

    return Object.freeze(Ratios.map((Value: number, Index: number): number =>
        Index === ChildIndex
            ? Desired
            : OtherTotal === 0
                ? OtherShare / (Ratios.length - 1)
                : (Value / OtherTotal) * OtherShare));
};

const SplitChildRatio = (
    Ratios: ReadonlyArray<number>,
    ChildIndex: number,
    Ratio: number
): ReadonlyArray<number> =>
{
    const Existing = Ratios[ChildIndex]!;
    const FirstShare = Existing * ClampRatio(Ratio);

    return Object.freeze([
        ...Ratios.slice(0, ChildIndex),
        FirstShare,
        Existing - FirstShare,
        ...Ratios.slice(ChildIndex + 1)
    ]);
};

const PanelFromChildren = (
    Direction: Orientation,
    Children: ReadonlyArray<Node>,
    Ratios?: ReadonlyArray<number>
): PanelNode =>
{
    if (Children.length < 2)
    {
        throw new RangeError("A tiling panel must contain at least two children.");
    }

    const NormalizedRatios = NormalizeRatios(Children.length, Ratios);

    return Object.freeze({
        Children: Object.freeze([ ...Children ]) as [ Node, Node, ...Array<Node> ],
        Orientation: Direction,
        Ratio: NormalizedRatios[0]!,
        Ratios: NormalizedRatios,
        _tag: "Panel" as const
    });
};

/**
 * Construct a frozen panel from an arbitrary child collection and optional
 * per-child ratios.
 */
export function Panel(
    Direction: Orientation,
    Children: readonly [ Node, Node, ...Array<Node> ],
    Ratios?: ReadonlyArray<number>
): PanelNode;

/**
 * Construct a frozen two-child panel using the original split-ratio API.
 */
export function Panel(
    Direction: Orientation,
    First: Node,
    Second: Node,
    Ratio?: number
): PanelNode;

export function Panel(
    Direction: Orientation,
    FirstOrChildren: Node | readonly [ Node, Node, ...Array<Node> ],
    SecondOrRatios?: Node | ReadonlyArray<number>,
    Ratio: number = 0.5
): PanelNode
{
    if (Array.isArray(FirstOrChildren))
    {
        return PanelFromChildren(
            Direction,
            FirstOrChildren,
            Array.isArray(SecondOrRatios) ? SecondOrRatios : undefined
        );
    }

    return PanelFromChildren(
        Direction,
        [ FirstOrChildren as Node, SecondOrRatios as Node ],
        [ ClampRatio(Ratio), 1 - ClampRatio(Ratio) ]
    );
}

const SplitBoundsBinary = (
    Bounds: Box.Box,
    Direction: Orientation,
    Ratio: number
): readonly [ Box.Box, Box.Box ] =>
{
    const Parts = SplitBounds(Bounds, Direction, [ ClampRatio(Ratio), 1 - ClampRatio(Ratio) ]);

    return [ Parts[0]!, Parts[1]! ];
};

/*
 * Balanced construction still uses recursive two-way splits so startup
 * adoption preserves its existing spatial ordering. Runtime insertion can
 * widen any matching panel beyond two children.
 */
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

export/** Derive a stable workspace identity from virtual-screen work-area coordinates. */
const WorkspaceId = (Bounds: Box.Box): string =>
    `${ Bounds.Left },${ Bounds.Top },${ Bounds.Right },${ Bounds.Bottom }`;

export/** Build a balanced tree ordered by the windows' existing screen positions. */
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
    const [ FirstBounds, SecondBounds ] = SplitBoundsBinary(Bounds, Direction, 0.5);
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

export/**
       * Group existing windows by monitor and place every monitor's windows
       * directly in its root panel.
       */
const FromWindowSeedsAtRootPanels = (Seeds: ReadonlyArray<WindowSeed>): State =>
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

    const Workspaces = [ ...Groups.entries() ].map((
        [ Id, Group ]: [ string, { Bounds: Box.Box; Windows: Array<ManagedWindow>; } ]
    ): Workspace =>
    {
        const Direction = DirectionForBounds(Group.Bounds);
        const Ordered = SortWindows(Group.Windows, Direction);
        const Root = Ordered.length === 0
            ? null
            : Ordered.length === 1
                ? Window(Ordered[0]!)
                : Panel(
                    Direction,
                    Ordered.map(Window) as [ Node, Node, ...Array<Node> ]
                );

        return Object.freeze({ Bounds: Group.Bounds, Id, Root });
    }).sort((Left: Workspace, Right: Workspace): number =>
        Left.Bounds.Top - Right.Bounds.Top || Left.Bounds.Left - Right.Bounds.Left);

    return Object.freeze({ Workspaces: Object.freeze(Workspaces) });
};

export/** Determine whether every monitor root in a tiling state is empty. */
const AreRootPanelsEmpty = (StateValue: State): boolean =>
    StateValue.Workspaces.every((Workspace: Workspace): boolean => Workspace.Root === null);

const LayoutNode = (
    Current: Node,
    Bounds: Box.Box,
    Gap: number,
    Out: Array<Placement>
): void =>
{
    if (Current._tag === "Window")
    {
        Out.push(Object.freeze({ Bounds, Window: Current.Value.Window }));
        return;
    }

    const ChildBounds = SplitBounds(
        Bounds,
        Current.Orientation,
        NormalizeRatios(Current.Children.length, Current.Ratios),
        Gap
    );

    Current.Children.forEach((Child: Node, Index: number): void =>
        LayoutNode(Child, ChildBounds[Index]!, Gap, Out));
};

export/** Project every window leaf in a state to its assigned screen rectangle. */
const Layout = (Self: State, Gap: number = 0): ReadonlyArray<Placement> =>
{
    const Out = new Array<Placement>();

    for (const WorkspaceValue of Self.Workspaces)
    {
        if (WorkspaceValue.Root !== null)
        {
            LayoutNode(
                WorkspaceValue.Root,
                InsetBounds(WorkspaceValue.Bounds, Gap),
                Gap,
                Out
            );
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
        : Root.Children.flatMap(Windows);
};

/** One stack panel's native windows in top-to-bottom order. */
export interface StackWindowOrder
{
    readonly Path: Path;
    readonly Windows: ReadonlyArray<Handle.HWND>;
    readonly WorkspaceId: string;
}

const CollectStackWindowOrders = (
    Current: Node,
    WorkspaceIdValue: string,
    CurrentPath: Path,
    Out: Array<StackWindowOrder>
): void =>
{
    if (Current._tag === "Window")
    {
        return;
    }

    if (Current.Orientation === Orientation.Stack)
    {
        Out.push(Object.freeze({
            Path: Object.freeze([ ...CurrentPath ]),
            Windows: Object.freeze(
                Windows(Current).map((Value: ManagedWindow) => Value.Window)
            ),
            WorkspaceId: WorkspaceIdValue
        }));
    }

    Current.Children.forEach((Child: Node, Index: number): void =>
        CollectStackWindowOrders(
            Child,
            WorkspaceIdValue,
            [ ...CurrentPath, Index ],
            Out
        ));
};

export/** Return every stack panel's native windows in top-to-bottom order. */
const StackWindowOrders = (Self: State): ReadonlyArray<StackWindowOrder> =>
{
    const Out = new Array<StackWindowOrder>();

    for (const WorkspaceValue of Self.Workspaces)
    {
        if (WorkspaceValue.Root !== null)
        {
            CollectStackWindowOrders(
                WorkspaceValue.Root,
                WorkspaceValue.Id,
                [ ],
                Out
            );
        }
    }

    return Object.freeze(Out);
};

export/** Determine whether a tree contains a native window handle. */
const HasWindow = (Root: Node | null, HandleValue: Handle.HWND): boolean =>
    Windows(Root).some((Value: ManagedWindow): boolean => Value.Window === HandleValue);

export/** Resolve a node by its child-index path from the workspace root. */
const GetNodeAtPath = (
    Root: Node | null,
    PathValue: Path
): Node | undefined =>
{
    let Current = Root ?? undefined;

    for (const ChildIndex of PathValue)
    {
        if (
            Current?._tag !== "Panel"
            || !Number.isInteger(ChildIndex)
            || ChildIndex < 0
            || ChildIndex >= Current.Children.length
        )
        {
            return undefined;
        }

        Current = Current.Children[ChildIndex];
    }

    return Current;
};

export/** Resolve the layout rectangle allocated to a node path. */
const GetNodeBoundsAtPath = (
    Root: Node | null,
    RootBounds: Box.Box,
    PathValue: Path,
    Gap: number = 0
): Box.Box | undefined =>
{
    let Bounds = InsetBounds(RootBounds, Gap);
    let Current = Root ?? undefined;

    for (const ChildIndex of PathValue)
    {
        if (
            Current?._tag !== "Panel"
            || !Number.isInteger(ChildIndex)
            || ChildIndex < 0
            || ChildIndex >= Current.Children.length
        )
        {
            return undefined;
        }

        Bounds = SplitBounds(
            Bounds,
            Current.Orientation,
            Current.Ratios,
            Gap
        )[ChildIndex]!;
        Current = Current.Children[ChildIndex];
    }

    return Current === undefined ? undefined : Bounds;
};

export/** Find the path of a native window leaf, if it belongs to the tree. */
const FindWindowPath = (
    Root: Node | null,
    WindowValue: Handle.HWND,
    ParentPath: Path = [ ]
): Path | undefined =>
{
    if (Root === null)
    {
        return undefined;
    }

    if (Root._tag === "Window")
    {
        return Root.Value.Window === WindowValue ? ParentPath : undefined;
    }

    for (let ChildIndex = 0; ChildIndex < Root.Children.length; ChildIndex += 1)
    {
        const Found = FindWindowPath(
            Root.Children[ChildIndex]!,
            WindowValue,
            [ ...ParentPath, ChildIndex ]
        );

        if (Found !== undefined)
        {
            return Found;
        }
    }

    return undefined;
};

export/** Select an adjacent sibling when its panel orientation matches the direction. */
const MoveFocus = (
    Root: Node | null,
    CurrentPath: Path,
    Direction: FocusDirection
): Path | undefined =>
{
    if (CurrentPath.length === 0)
    {
        return undefined;
    }

    const ParentPath = CurrentPath.slice(0, -1);
    const Parent = GetNodeAtPath(Root, ParentPath);
    const CurrentIndex = CurrentPath.at(-1)!;
    const IsHorizontal = Direction === FocusDirection.Left
        || Direction === FocusDirection.Right;
    const RequiredOrientation = IsHorizontal
        ? Orientation.Horizontal
        : Orientation.Vertical;

    if (Parent?._tag !== "Panel" || Parent.Orientation !== RequiredOrientation)
    {
        return undefined;
    }

    const Offset = Direction === FocusDirection.Left || Direction === FocusDirection.Up
        ? -1
        : 1;
    const TargetIndex = CurrentIndex + Offset;

    return TargetIndex < 0 || TargetIndex >= Parent.Children.length
        ? undefined
        : Object.freeze([ ...ParentPath, TargetIndex ]);
};

export/** Select child zero when logical focus currently rests on a panel. */
const CommitFocus = (
    Root: Node | null,
    CurrentPath: Path
): Path | undefined =>
    GetNodeAtPath(Root, CurrentPath)?._tag === "Panel"
        ? Object.freeze([ ...CurrentPath, 0 ])
        : undefined;

const FocusPanelBoundary = (
    Root: Node | null,
    CurrentPath: Path,
    Boundary: "First" | "Last"
): Path | undefined =>
{
    if (CurrentPath.length === 0)
    {
        return undefined;
    }

    const ParentPath = CurrentPath.slice(0, -1);
    const Parent = GetNodeAtPath(Root, ParentPath);
    if (Parent?._tag !== "Panel")
    {
        return undefined;
    }

    const TargetIndex = Boundary === "First"
        ? 0
        : Parent.Children.length - 1;

    return CurrentPath.at(-1) === TargetIndex
        ? undefined
        : Object.freeze([ ...ParentPath, TargetIndex ]);
};

export/** Select the first child of the panel containing logical focus. */
const FocusFirstChild = (
    Root: Node | null,
    CurrentPath: Path
): Path | undefined => FocusPanelBoundary(Root, CurrentPath, "First");

export/** Select the last child of the panel containing logical focus. */
const FocusLastChild = (
    Root: Node | null,
    CurrentPath: Path
): Path | undefined => FocusPanelBoundary(Root, CurrentPath, "Last");

export/** Select the root panel of the workspace containing logical focus. */
const FocusRootPanel = (
    Root: Node | null,
    CurrentPath: Path
): Path | undefined =>
    CurrentPath.length > 0 && Root?._tag === "Panel"
        ? Object.freeze([ ])
        : undefined;

export/**
       * Select the panel containing the current node, including the monitor
       * root panel.
       */
const FocusContainingPanel = (
    Root: Node | null,
    CurrentPath: Path
): Path | undefined =>
{
    if (CurrentPath.length === 0)
    {
        return undefined;
    }

    const PanelPath = CurrentPath.slice(0, -1);
    return GetNodeAtPath(Root, PanelPath)?._tag === "Panel"
        ? Object.freeze(PanelPath)
        : undefined;
};

const InsertAtWindow = (
    Root: Node,
    Target: Handle.HWND,
    Value: ManagedWindow,
    Direction: Orientation,
    Ratio: number,
    InsertBefore: boolean = false
): readonly [ Node, boolean ] =>
{
    if (Root._tag === "Window")
    {
        return Root.Value.Window === Target
            ? [
                InsertBefore
                    ? Panel(Direction, Window(Value), Root, Ratio)
                    : Panel(Direction, Root, Window(Value), Ratio),
                true
            ]
            : [ Root, false ];
    }

    const DirectTargetIndex = Root.Children.findIndex((Child: Node): boolean =>
        Child._tag === "Window" && Child.Value.Window === Target);

    if (DirectTargetIndex >= 0 && Root.Orientation === Direction)
    {
        const InsertIndex = DirectTargetIndex + (InsertBefore ? 0 : 1);
        const Children = [
            ...Root.Children.slice(0, InsertIndex),
            Window(Value),
            ...Root.Children.slice(InsertIndex)
        ] as [ Node, Node, ...Array<Node> ];
        const Ratios = SplitChildRatio(Root.Ratios, DirectTargetIndex, Ratio);

        if (InsertBefore)
        {
            const FirstRatio = Ratios[DirectTargetIndex]!;
            const SecondRatio = Ratios[DirectTargetIndex + 1]!;
            const MutableRatios = [ ...Ratios ];
            MutableRatios[DirectTargetIndex] = SecondRatio;
            MutableRatios[DirectTargetIndex + 1] = FirstRatio;
            return [ Panel(Root.Orientation, Children, MutableRatios), true ];
        }

        return [ Panel(Root.Orientation, Children, Ratios), true ];
    }

    for (let ChildIndex = 0; ChildIndex < Root.Children.length; ChildIndex += 1)
    {
        const [ Child, Inserted ] = InsertAtWindow(
            Root.Children[ChildIndex]!,
            Target,
            Value,
            Direction,
            Ratio,
            InsertBefore
        );

        if (Inserted)
        {
            const Children = [ ...Root.Children ];
            Children[ChildIndex] = Child;
            return [
                Panel(
                    Root.Orientation,
                    Children as [ Node, Node, ...Array<Node> ],
                    Root.Ratios
                ),
                true
            ];
        }
    }

    return [ Root, false ];
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

export/**
       * Inserts a window into the half of a target leaf selected by a
       * direction.
       *
       * # Details
       *
       * A direction parallel to the target's owning panel inserts a sibling
       * into that panel.  A perpendicular direction replaces the target leaf
       * with a two-child panel whose orientation matches the requested axis.
       *
       * @category mutations
       * @since 0.1.0
       */
const InsertWindowInDirection = (
    Root: Node,
    Value: ManagedWindow,
    Target: Handle.HWND,
    Direction: FocusDirection
): readonly [ Node, boolean ] =>
{
    if (HasWindow(Root, Value.Window))
    {
        return [ Root, false ];
    }

    const OrientationValue =
        Direction === FocusDirection.Left || Direction === FocusDirection.Right
            ? Orientation.Horizontal
            : Orientation.Vertical;
    const InsertBefore =
        Direction === FocusDirection.Left || Direction === FocusDirection.Up;

    return InsertAtWindow(
        Root,
        Target,
        Value,
        OrientationValue,
        0.5,
        InsertBefore
    );
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

    const RemainingChildren = new Array<Node>();
    const RemainingRatios = new Array<number>();
    let Changed = false;

    Root.Children.forEach((Child: Node, Index: number): void =>
    {
        const Remaining = RemoveWindow(Child, HandleValue);

        if (Remaining === null)
        {
            Changed = true;
            return;
        }

        Changed ||= Remaining !== Child;
        RemainingChildren.push(Remaining);
        RemainingRatios.push(Root.Ratios[Index]!);
    });

    if (!Changed)
    {
        return Root;
    }

    if (RemainingChildren.length === 0)
    {
        return null;
    }

    if (RemainingChildren.length === 1)
    {
        return RemainingChildren[0]!;
    }

    return Panel(
        Root.Orientation,
        RemainingChildren as [ Node, Node, ...Array<Node> ],
        RemainingRatios
    );
};

export/**
       * Move the branch containing a window to the top of each enclosing stack.
       *
       * Every other branch retains its relative z-order.
       *
       * @category mutations
       * @since 0.1.0
       */
const BringStackWindowToFront = (
    Root: Node,
    WindowValue: Handle.HWND
): readonly [ Node, boolean ] =>
{
    if (Root._tag === "Window")
    {
        return [ Root, false ];
    }

    let Changed = false;
    const Children = Root.Children.map((Child: Node): Node =>
    {
        const [ Next, ChildChanged ] = BringStackWindowToFront(Child, WindowValue);
        Changed ||= ChildChanged;
        return Next;
    });
    const Ratios = [ ...Root.Ratios ];

    if (Root.Orientation === Orientation.Stack)
    {
        const TargetIndex = Children.findIndex((Child: Node): boolean =>
            HasWindow(Child, WindowValue));

        if (TargetIndex > 0)
        {
            const [ Target ] = Children.splice(TargetIndex, 1);
            const [ TargetRatio ] = Ratios.splice(TargetIndex, 1);
            Children.unshift(Target!);
            Ratios.unshift(TargetRatio!);
            Changed = true;
        }
    }

    return Changed
        ? [
            Panel(
                Root.Orientation,
                Children as [ Node, Node, ...Array<Node> ],
                Ratios
            ),
            true
        ]
        : [ Root, false ];
};

const UpdateNodeAtPath = (
    Root: Node,
    PathValue: Path,
    Transform: (NodeValue: Node) => readonly [ Node, boolean ],
    Depth: number = 0
): readonly [ Node, boolean ] =>
{
    if (Depth === PathValue.length)
    {
        return Transform(Root);
    }

    if (Root._tag === "Window")
    {
        return [ Root, false ];
    }

    const ChildIndex = PathValue[Depth];
    if (
        ChildIndex === undefined
        || !Number.isInteger(ChildIndex)
        || ChildIndex < 0
        || ChildIndex >= Root.Children.length
    )
    {
        return [ Root, false ];
    }

    const [ Child, Updated ] = UpdateNodeAtPath(
        Root.Children[ChildIndex]!,
        PathValue,
        Transform,
        Depth + 1
    );

    return Updated
        ? [
            Panel(
                Root.Orientation,
                Root.Children.map((Current: Node, Index: number): Node =>
                    Index === ChildIndex ? Child : Current
                ) as [ Node, Node, ...Array<Node> ],
                Root.Ratios
            ),
            true
        ]
        : [ Root, false ];
};

const UpdatePanel = (
    Root: Node,
    PathValue: Path,
    Transform: (PanelValue: PanelNode) => readonly [ PanelNode, boolean ]
): readonly [ Node, boolean ] => UpdateNodeAtPath(
    Root,
    PathValue,
    (NodeValue: Node): readonly [ Node, boolean ] =>
        NodeValue._tag === "Panel"
            ? Transform(NodeValue)
            : [ NodeValue, false ]
);

export/**
       * Move a managed window to a child index in its current panel.
       *
       * @category mutations
       * @since 0.1.0
       */
const MoveWindowToIndex = (
    Root: Node,
    WindowValue: Handle.HWND,
    TargetIndex: number
): readonly [ Node, boolean ] =>
{
    const CurrentPath = FindWindowPath(Root, WindowValue);
    if (CurrentPath === undefined || CurrentPath.length === 0)
    {
        return [ Root, false ];
    }

    const ParentPath = CurrentPath.slice(0, -1);
    const CurrentIndex = CurrentPath.at(-1)!;

    return UpdatePanel(
        Root,
        ParentPath,
        (PanelValue: PanelNode): readonly [ PanelNode, boolean ] =>
        {
            if (
                !Number.isInteger(TargetIndex)
                || TargetIndex < 0
                || TargetIndex >= PanelValue.Children.length
                || TargetIndex === CurrentIndex
                || PanelValue.Children[CurrentIndex]?._tag !== "Window"
                || PanelValue.Children[CurrentIndex].Value.Window !== WindowValue
            )
            {
                return [ PanelValue, false ];
            }

            const Children = [ ...PanelValue.Children ];
            const [ WindowNodeValue ] = Children.splice(CurrentIndex, 1);
            Children.splice(TargetIndex, 0, WindowNodeValue!);

            return [
                Panel(
                    PanelValue.Orientation,
                    Children as [ Node, Node, ...Array<Node> ],
                    PanelValue.Ratios
                ),
                true
            ];
        }
    );
};

export/**
       * Promote a managed window into the panel containing its current panel.
       *
       * The promoted window is inserted immediately after its former owning
       * panel.  The former panel collapses when only one child remains.
       *
       * @category mutations
       * @since 0.1.0
       */
const MoveWindowToContainingPanel = (
    Root: Node,
    WindowValue: Handle.HWND
): readonly [ Node, boolean ] =>
{
    const CurrentPath = FindWindowPath(Root, WindowValue);
    if (CurrentPath === undefined || CurrentPath.length < 2)
    {
        return [ Root, false ];
    }

    const GrandparentPath = CurrentPath.slice(0, -2);
    const OwningPanelIndex = CurrentPath.at(-2)!;
    const WindowIndex = CurrentPath.at(-1)!;

    return UpdatePanel(
        Root,
        GrandparentPath,
        (Grandparent: PanelNode): readonly [ PanelNode, boolean ] =>
        {
            const OwningPanel = Grandparent.Children[OwningPanelIndex];
            const WindowNodeValue = OwningPanel?._tag === "Panel"
                ? OwningPanel.Children[WindowIndex]
                : undefined;

            if (
                OwningPanel?._tag !== "Panel"
                || WindowNodeValue?._tag !== "Window"
                || WindowNodeValue.Value.Window !== WindowValue
            )
            {
                return [ Grandparent, false ];
            }

            const RemainingChildren = OwningPanel.Children.filter(
                (_Child: Node, Index: number): boolean => Index !== WindowIndex
            );
            const RemainingRatios = OwningPanel.Ratios.filter(
                (_Ratio: number, Index: number): boolean => Index !== WindowIndex
            );
            const RemainingOwner = RemainingChildren.length === 1
                ? RemainingChildren[0]!
                : Panel(
                    OwningPanel.Orientation,
                    RemainingChildren as [ Node, Node, ...Array<Node> ],
                    RemainingRatios
                );
            const Children = [ ...Grandparent.Children ];
            Children[OwningPanelIndex] = RemainingOwner;
            Children.splice(OwningPanelIndex + 1, 0, WindowNodeValue);

            return [
                Panel(
                    Grandparent.Orientation,
                    Children as [ Node, Node, ...Array<Node> ],
                    SplitChildRatio(Grandparent.Ratios, OwningPanelIndex, 0.5)
                ),
                true
            ];
        }
    );
};

export/**
       * Move a managed window into an adjacent sibling panel as child zero.
       *
       * The source panel collapses when the target panel is its only remaining
       * child.
       *
       * @category mutations
       * @since 0.1.0
       */
const MoveWindowIntoPanel = (
    Root: Node,
    WindowValue: Handle.HWND,
    TargetPanelPath: Path
): readonly [ Node, boolean ] =>
{
    const CurrentPath = FindWindowPath(Root, WindowValue);
    if (
        CurrentPath === undefined
        || CurrentPath.length === 0
        || TargetPanelPath.length !== CurrentPath.length
    )
    {
        return [ Root, false ];
    }

    const ParentPath = CurrentPath.slice(0, -1);
    const TargetParentPath = TargetPanelPath.slice(0, -1);
    const IsSameParent = ParentPath.length === TargetParentPath.length
        && ParentPath.every((Index: number, Depth: number): boolean =>
            Index === TargetParentPath[Depth]);
    const CurrentIndex = CurrentPath.at(-1)!;
    const TargetIndex = TargetPanelPath.at(-1)!;

    if (!IsSameParent || Math.abs(CurrentIndex - TargetIndex) !== 1)
    {
        return [ Root, false ];
    }

    return UpdateNodeAtPath(
        Root,
        ParentPath,
        (ParentNode: Node): readonly [ Node, boolean ] =>
        {
            if (ParentNode._tag !== "Panel")
            {
                return [ ParentNode, false ];
            }

            const WindowNodeValue = ParentNode.Children[CurrentIndex];
            const TargetPanel = ParentNode.Children[TargetIndex];
            if (
                WindowNodeValue?._tag !== "Window"
                || WindowNodeValue.Value.Window !== WindowValue
                || TargetPanel?._tag !== "Panel"
            )
            {
                return [ ParentNode, false ];
            }

            const UpdatedTarget = Panel(
                TargetPanel.Orientation,
                [
                    WindowNodeValue,
                    ...TargetPanel.Children
                ] as [ Node, Node, ...Array<Node> ],
                SplitChildRatio(TargetPanel.Ratios, 0, 0.5)
            );
            const RemainingChildren = ParentNode.Children.flatMap((
                Child: Node,
                Index: number
            ): ReadonlyArray<Node> =>
                Index === CurrentIndex
                    ? [ ]
                    : [ Index === TargetIndex ? UpdatedTarget : Child ]);
            const RemainingRatios = ParentNode.Ratios.filter(
                (_Ratio: number, Index: number): boolean => Index !== CurrentIndex
            );

            return RemainingChildren.length === 1
                ? [ RemainingChildren[0]!, true ]
                : [
                    Panel(
                        ParentNode.Orientation,
                        RemainingChildren as [ Node, Node, ...Array<Node> ],
                        RemainingRatios
                    ),
                    true
                ];
        }
    );
};

export/**
       * Change one child's normalized panel ratio and report whether the panel
       * path and child index existed. The first child remains the default for
       * compatibility with the original binary-panel API.
       */
const SetPanelRatio = (
    Root: Node,
    PathValue: Path,
    Ratio: number,
    ChildIndex: number = 0
): readonly [ Node, boolean ] => UpdatePanel(
    Root,
    PathValue,
    (PanelValue: PanelNode): readonly [ PanelNode, boolean ] =>
    {
        if (
            !Number.isInteger(ChildIndex)
            || ChildIndex < 0
            || ChildIndex >= PanelValue.Children.length
        )
        {
            return [ PanelValue, false ];
        }

        return [
            Panel(
                PanelValue.Orientation,
                PanelValue.Children,
                SetRatioAt(PanelValue.Ratios, ChildIndex, Ratio)
            ),
            true
        ];
    }
);

const TransferPanelRatio = (
    Ratios: ReadonlyArray<number>,
    TargetIndex: number,
    AdjacentIndex: number,
    DeltaRatio: number
): ReadonlyArray<number> =>
{
    const Normalized = NormalizeRatios(Ratios.length, Ratios);
    const TargetRatio = Normalized[TargetIndex];
    const AdjacentRatio = Normalized[AdjacentIndex];

    if (
        TargetRatio === undefined
        || AdjacentRatio === undefined
        || !Number.isFinite(DeltaRatio)
    )
    {
        return Ratios;
    }

    const Minimum = Math.min(MinimumRatio, 0.5 / Ratios.length);
    const AppliedDelta = Math.max(
        Minimum - TargetRatio,
        Math.min(AdjacentRatio - Minimum, DeltaRatio)
    );

    if (AppliedDelta === 0)
    {
        return Ratios;
    }

    return Object.freeze(Normalized.map((RatioValue: number, Index: number): number =>
        Index === TargetIndex
            ? RatioValue + AppliedDelta
            : Index === AdjacentIndex
                ? RatioValue - AppliedDelta
                : RatioValue));
};

export/**
       * Resize the nearest tiled branch whose panel arrangement matches a
       * direction.
       *
       * # Details
       *
       * Parallel directions resize the window within its owning panel.
       * Perpendicular directions climb to the nearest matching ancestor and
       * therefore resize the entire intervening branch.
       *
       * @category mutations
       * @since 0.1.0
       */
const ResizeWindow = (
    Root: Node,
    RootBounds: Box.Box,
    WindowValue: Handle.HWND,
    Direction: FocusDirection,
    DeltaPixels: number,
    Behavior: TiledResizeBehavior,
    Gap: number = 0
): readonly [ Node, boolean ] =>
{
    const WindowPath = FindWindowPath(Root, WindowValue);
    if (WindowPath === undefined || WindowPath.length === 0 || DeltaPixels === 0)
    {
        return [ Root, false ];
    }

    const RequiredOrientation =
        Direction === FocusDirection.Left || Direction === FocusDirection.Right
            ? Orientation.Horizontal
            : Orientation.Vertical;
    let PanelPath: Path | undefined;
    let TargetIndex: number | undefined;

    for (let Depth = WindowPath.length - 1; Depth >= 0; Depth -= 1)
    {
        const CandidatePath = WindowPath.slice(0, Depth);
        const Candidate = GetNodeAtPath(Root, CandidatePath);

        if (Candidate?._tag === "Panel" && Candidate.Orientation === RequiredOrientation)
        {
            PanelPath = CandidatePath;
            TargetIndex = WindowPath[Depth];
            break;
        }
    }

    if (PanelPath === undefined || TargetIndex === undefined)
    {
        return [ Root, false ];
    }

    const PanelBounds = GetNodeBoundsAtPath(Root, RootBounds, PanelPath, Gap);
    if (PanelBounds === undefined)
    {
        return [ Root, false ];
    }

    return UpdatePanel(
        Root,
        PanelPath,
        (PanelValue: PanelNode): readonly [ PanelNode, boolean ] =>
        {
            const ChildBounds = SplitBounds(
                PanelBounds,
                PanelValue.Orientation,
                PanelValue.Ratios,
                Gap
            );
            const ContentLength = ChildBounds.reduce(
                (Total: number, BoundsValue: Box.Box): number =>
                    Total + (
                        RequiredOrientation === Orientation.Horizontal
                            ? Box.Width(BoundsValue)
                            : Box.Height(BoundsValue)
                    ),
                0
            );

            if (ContentLength <= 0)
            {
                return [ PanelValue, false ];
            }

            const DeltaRatio = DeltaPixels / ContentLength;
            let Ratios: ReadonlyArray<number>;

            if (Behavior === "AdjacentOnly")
            {
                const AdjacentIndex = TargetIndex!
                    + (
                        Direction === FocusDirection.Left
                        || Direction === FocusDirection.Up
                            ? -1
                            : 1
                    );

                if (AdjacentIndex < 0 || AdjacentIndex >= PanelValue.Children.length)
                {
                    return [ PanelValue, false ];
                }

                Ratios = TransferPanelRatio(
                    PanelValue.Ratios,
                    TargetIndex!,
                    AdjacentIndex,
                    DeltaRatio
                );
            }
            else
            {
                Ratios = SetRatioAt(
                    PanelValue.Ratios,
                    TargetIndex!,
                    PanelValue.Ratios[TargetIndex!]! + DeltaRatio
                );
            }

            return Ratios === PanelValue.Ratios
                ? [ PanelValue, false ]
                : [
                    Panel(
                        PanelValue.Orientation,
                        PanelValue.Children,
                        Ratios
                    ),
                    true
                ];
        }
    );
};

export/** Change a panel's child arrangement and report whether the path existed. */
const SetPanelOrientation = (
    Root: Node,
    PathValue: Path,
    Direction: Orientation
): readonly [ Node, boolean ] => UpdatePanel(
    Root,
    PathValue,
    (PanelValue: PanelNode) => [
        Panel(
            Direction,
            PanelValue.Children,
            PanelValue.Ratios
        ),
        true
    ]
);
