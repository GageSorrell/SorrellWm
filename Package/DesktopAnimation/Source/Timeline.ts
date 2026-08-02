/**
 * Constructors and validation for sequential desktop animation timelines.
 *
 * @module @sorrell/desktop-animation/Timeline
 *
 * @file      Timeline.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    ChangeCursorStep,
    CreateWindowStep,
    DesktopAnimationDefinition,
    DesktopCursor,
    DesktopWindow,
    DestroyWindowStep,
    DragWindowStep,
    HideCursorStep,
    MoveCursorStep,
    MoveWindowStep,
    Point,
    ResizeWindowStep,
    ShowCursorStep,
    Size,
    WaitStep
} from "./Model.js";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/Timeline" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

const AssertFinite = (Value: number, Name: string): void =>
{
    if (!Number.isFinite(Value))
    {
        throw new TypeError(`${ Name } must be finite.`);
    }
};

const AssertDuration = (Duration: number, Name: string): void =>
{
    AssertFinite(Duration, Name);

    if (Duration < 0)
    {
        throw new RangeError(`${ Name } must not be negative.`);
    }
};

const AssertPositiveDuration = (Duration: number, Name: string): void =>
{
    AssertDuration(Duration, Name);

    if (Duration === 0)
    {
        throw new RangeError(`${ Name } must be greater than zero.`);
    }
};

const AssertPoint = (PointValue: Point, Name: string): void =>
{
    AssertFinite(PointValue.X, `${ Name }.X`);
    AssertFinite(PointValue.Y, `${ Name }.Y`);
};

const AssertSize = (SizeValue: Size, Name: string): void =>
{
    AssertFinite(SizeValue.Height, `${ Name }.Height`);
    AssertFinite(SizeValue.Width, `${ Name }.Width`);

    if (SizeValue.Height <= 0 || SizeValue.Width <= 0)
    {
        throw new RangeError(`${ Name } dimensions must be greater than zero.`);
    }
};

const AssertWindow = (WindowValue: DesktopWindow, Name: string): void =>
{
    if (WindowValue.Id.trim().length === 0)
    {
        throw new TypeError(`${ Name }.Id must not be empty.`);
    }

    AssertPoint(WindowValue.Frame, `${ Name }.Frame`);
    AssertSize(WindowValue.Frame, `${ Name }.Frame`);
};

/**
 * Constructors for window timeline steps.
 *
 * @category Constructor
 * @since 1.0.0
 */
export const WindowStep =
    {
        /**
         * Creates a window with a Windows-style opening motion.
         *
         * @since 1.0.0
         */
        Create: (Window: DesktopWindow, Duration = 180): CreateWindowStep =>
            ({ Duration, Kind: "CreateWindow", Window }),

        /**
         * Destroys a window with a Windows-style closing motion.
         *
         * @since 1.0.0
         */
        Destroy: (Id: string, Duration = 140): DestroyWindowStep =>
            ({ Duration, Id, Kind: "DestroyWindow" }),

        /**
         * Moves a window, instantaneously unless a positive duration is supplied.
         *
         * @since 1.0.0
         */
        Move: (Id: string, Position: Point, Duration = 0): MoveWindowStep =>
            ({ Duration, Id, Kind: "MoveWindow", Position }),

        /**
         * Resizes a window over the supplied duration.
         *
         * @since 1.0.0
         */
        Resize: (Id: string, SizeValue: Size, Duration: number): ResizeWindowStep =>
            ({ Duration, Id, Kind: "ResizeWindow", Size: SizeValue })
    } as const;

/**
 * Constructors for cursor timeline steps.
 *
 * @category Constructor
 * @since 1.0.0
 */
export const CursorStep =
    {
        /**
         * Changes cursor shape, cross-fading over the supplied duration.
         *
         * @since 1.0.0
         */
        Change: (CursorType: ChangeCursorStep["CursorType"], Duration = 0): ChangeCursorStep =>
            ({ CursorType, Duration, Kind: "ChangeCursor" }),

        /**
         * Drags a window and the cursor together to the target window position.
         *
         * @since 1.0.0
         */
        Drag: (Id: string, Position: Point, Duration: number): DragWindowStep =>
            ({ Duration, Id, Kind: "DragWindow", Position }),

        /**
         * Hides the cursor with a short exit motion.
         *
         * @since 1.0.0
         */
        Hide: (Duration = 100): HideCursorStep =>
            ({ Duration, Kind: "HideCursor" }),

        /**
         * Moves the cursor, instantaneously unless a positive duration is supplied.
         *
         * @since 1.0.0
         */
        Move: (Position: Point, Duration = 0): MoveCursorStep =>
            ({ Duration, Kind: "MoveCursor", Position }),

        /**
         * Shows a cursor with a short entrance motion.
         *
         * @since 1.0.0
         */
        Show: (Cursor: DesktopCursor, Duration = 100): ShowCursorStep =>
            ({ Cursor, Duration, Kind: "ShowCursor" })
    } as const;

/**
 * Holds the current scene for the supplied number of milliseconds.
 *
 * @category Constructor
 * @since 1.0.0
 */
export const Wait = (Duration: number): WaitStep => ({ Duration, Kind: "Wait" });

/**
 * Validates and freezes a desktop animation definition.
 *
 * # Gotchas
 *
 * Timeline steps are sequential.  A step may reference only a window or cursor which is
 * visible at that point in the timeline, and a window identifier may be created only once.
 *
 * @category Constructor
 * @since 1.0.0
 */
export const DefineAnimation = (
    Definition: DesktopAnimationDefinition
): DesktopAnimationDefinition =>
{
    AssertSize(Definition.Canvas, "Canvas");

    if (Definition.Label.trim().length === 0)
    {
        throw new TypeError("Label must not be empty.");
    }

    const KnownWindows = new Set<string>();
    const VisibleWindows = new Set<string>();

    for (const [ Index, WindowValue ] of (Definition.Windows ?? []).entries())
    {
        AssertWindow(WindowValue, `Windows[${ Index }]`);

        if (KnownWindows.has(WindowValue.Id))
        {
            throw new TypeError(`Window identifier "${ WindowValue.Id }" is duplicated.`);
        }

        KnownWindows.add(WindowValue.Id);
        VisibleWindows.add(WindowValue.Id);
    }

    if (Definition.Cursor !== undefined)
    {
        AssertPoint(Definition.Cursor.Position, "Cursor.Position");
    }

    let CursorVisible = Definition.Cursor !== undefined;

    for (const [ Index, Step ] of Definition.Steps.entries())
    {
        AssertDuration(Step.Duration, `Steps[${ Index }].Duration`);

        switch (Step.Kind)
        {
            case "CreateWindow":
                AssertPositiveDuration(Step.Duration, `Steps[${ Index }].Duration`);
                AssertWindow(Step.Window, `Steps[${ Index }].Window`);

                if (KnownWindows.has(Step.Window.Id))
                {
                    throw new TypeError(`Window identifier "${ Step.Window.Id }" is duplicated.`);
                }

                KnownWindows.add(Step.Window.Id);
                VisibleWindows.add(Step.Window.Id);
                break;

            case "MoveWindow":
                AssertPoint(Step.Position, `Steps[${ Index }].Position`);

                if (!VisibleWindows.has(Step.Id))
                {
                    throw new TypeError(`Window "${ Step.Id }" is not visible at step ${ Index }.`);
                }
                break;

            case "ResizeWindow":
                AssertPositiveDuration(Step.Duration, `Steps[${ Index }].Duration`);
                AssertSize(Step.Size, `Steps[${ Index }].Size`);

                if (!VisibleWindows.has(Step.Id))
                {
                    throw new TypeError(`Window "${ Step.Id }" is not visible at step ${ Index }.`);
                }
                break;

            case "DestroyWindow":
                AssertPositiveDuration(Step.Duration, `Steps[${ Index }].Duration`);

                if (!VisibleWindows.delete(Step.Id))
                {
                    throw new TypeError(`Window "${ Step.Id }" is not visible at step ${ Index }.`);
                }
                break;

            case "ShowCursor":
                AssertPositiveDuration(Step.Duration, `Steps[${ Index }].Duration`);
                AssertPoint(Step.Cursor.Position, `Steps[${ Index }].Cursor.Position`);

                if (CursorVisible)
                {
                    throw new TypeError(`The cursor is already visible at step ${ Index }.`);
                }

                CursorVisible = true;
                break;

            case "MoveCursor":
                AssertPoint(Step.Position, `Steps[${ Index }].Position`);

                if (!CursorVisible)
                {
                    throw new TypeError(`The cursor is not visible at step ${ Index }.`);
                }
                break;

            case "ChangeCursor":
                if (!CursorVisible)
                {
                    throw new TypeError(`The cursor is not visible at step ${ Index }.`);
                }
                break;

            case "HideCursor":
                AssertPositiveDuration(Step.Duration, `Steps[${ Index }].Duration`);

                if (!CursorVisible)
                {
                    throw new TypeError(`The cursor is not visible at step ${ Index }.`);
                }

                CursorVisible = false;
                break;

            case "DragWindow":
                AssertPositiveDuration(Step.Duration, `Steps[${ Index }].Duration`);
                AssertPoint(Step.Position, `Steps[${ Index }].Position`);

                if (!CursorVisible)
                {
                    throw new TypeError(`The cursor is not visible at step ${ Index }.`);
                }

                if (!VisibleWindows.has(Step.Id))
                {
                    throw new TypeError(`Window "${ Step.Id }" is not visible at step ${ Index }.`);
                }
                break;

            case "Wait":
                break;
        }
    }

    const FrozenDefinition = {
        ...Definition,
        Canvas: Object.freeze({ ...Definition.Canvas }),
        Steps: Object.freeze([ ...Definition.Steps ])
    };

    return Definition.Windows === undefined
        ? Object.freeze(FrozenDefinition)
        : Object.freeze({
            ...FrozenDefinition,
            Windows: Object.freeze([ ...Definition.Windows ])
        });
};
