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

export/** The directions in which a panel can arrange its children. */
const Orientation = Object.freeze({
    Horizontal: "Horizontal",
    Vertical: "Vertical"
} as const);

/** A panel arrangement direction. */
export type Orientation = typeof Orientation[keyof typeof Orientation];

/** A path from a workspace root to a descendant panel. */
export type Path = ReadonlyArray<number>;

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

/** A panel that partitions its rectangle between two or more children. */
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

const SplitBounds = (
    Bounds: Box.Box,
    Direction: Orientation,
    Ratios: ReadonlyArray<number>
): ReadonlyArray<Box.Box> =>
{
    const Normalized = NormalizeRatios(Ratios.length, Ratios);
    const Length = Direction === Orientation.Horizontal
        ? Box.Width(Bounds)
        : Box.Height(Bounds);
    const Start = Direction === Orientation.Horizontal
        ? Bounds.Left
        : Bounds.Top;
    let Cursor: number = Start;
    let CumulativeRatio = 0;

    return Object.freeze(Normalized.map((Ratio: number, Index: number): Box.Box =>
    {
        CumulativeRatio += Ratio;
        const End = Index === Normalized.length - 1
            ? Start + Length
            : Start + Math.floor(Length * CumulativeRatio);

        const ChildBounds = Direction === Orientation.Horizontal
            ? Box.Box(Bounds.Top, End, Bounds.Bottom, Cursor)
            : Box.Box(Cursor, Bounds.Right, End, Bounds.Left);

        Cursor = End;
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

    const ChildBounds = SplitBounds(
        Bounds,
        Current.Orientation,
        NormalizeRatios(Current.Children.length, Current.Ratios)
    );

    Current.Children.forEach((Child: Node, Index: number): void =>
        LayoutNode(Child, ChildBounds[Index]!, Out));
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
        : Root.Children.flatMap(Windows);
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

    const DirectTargetIndex = Root.Children.findIndex((Child: Node): boolean =>
        Child._tag === "Window" && Child.Value.Window === Target);

    if (DirectTargetIndex >= 0 && Root.Orientation === Direction)
    {
        const Children = [
            ...Root.Children.slice(0, DirectTargetIndex + 1),
            Window(Value),
            ...Root.Children.slice(DirectTargetIndex + 1)
        ] as [ Node, Node, ...Array<Node> ];
        const Ratios = SplitChildRatio(Root.Ratios, DirectTargetIndex, Ratio);

        return [ Panel(Root.Orientation, Children, Ratios), true ];
    }

    for (let ChildIndex = 0; ChildIndex < Root.Children.length; ChildIndex += 1)
    {
        const [ Child, Inserted ] = InsertAtWindow(
            Root.Children[ChildIndex]!,
            Target,
            Value,
            Direction,
            Ratio
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

const UpdatePanel = (
    Root: Node,
    PathValue: Path,
    Transform: (PanelValue: PanelNode) => readonly [ PanelNode, boolean ],
    Depth: number = 0
): readonly [ Node, boolean ] =>
{
    if (Root._tag === "Window")
    {
        return [ Root, false ];
    }

    if (Depth === PathValue.length)
    {
        return Transform(Root);
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

    const [ Child, Updated ] = UpdatePanel(
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
