/**
 * MCP tools that simulate mouse input directly: cursor positioning, button press/release,
 * clicks, and point-to-point drags. General-purpose "bridge the gap" primitives, not tied
 * to any particular window.
 *
 * @module @sorrell/wm/Main/Mcp/Tools/Mouse
 *
 * @file      Mouse.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Convert from "../Convert.ts";
import * as ToolResult from "../ToolResult.ts";
import { Effect, Option, Schema, pipe } from "effect";
import { Mouse as NativeMouse, Window as NativeWindow } from "@sorrell/windows";
import type { ToolDefinition } from "../ToolDefinition.ts";
import { ToolName } from "../ToolName.ts";
import { Mouse as WmApiMouse } from "@sorrell/wm-api";

/** The default duration, in milliseconds, {@link MouseDrag}/{@link CursorMove} animate over. */
const DefaultMoveDurationMilliseconds = 300;

const NoInputSchema = Schema.Struct({ });

const GetCursorPosition = (): Effect.Effect<
    { readonly Position: WmApiMouse.IntPoint; },
    { readonly Message: string; }
> => Effect.gen(function*()
{
    const Position = NativeWindow.GetCursorPosition();

    if (Option.isNone(Position))
    {
        return yield* Effect.fail({ Message: "Could not read the current cursor position." });
    }

    return { Position: { X: Position.value.X, Y: Position.value.Y } };
});

const PointInputSchema = Schema.Struct({
    X: Schema.Int,
    Y: Schema.Int
});

const SetCursorPosition = (
    Input: typeof PointInputSchema.Type
): Effect.Effect<{ readonly Position: WmApiMouse.IntPoint; }, { readonly Message: string; }> => pipe(
    Effect.sync(() => NativeMouse.SetCursorPosition(Convert.FromIntPoint(Input))),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.as({ Position: Input })
);

const CursorMoveInputSchema = Schema.Struct({
    DurationMilliseconds: Schema.optional(Schema.Int),
    X: Schema.Int,
    Y: Schema.Int
});

const CursorMove = (
    Input: typeof CursorMoveInputSchema.Type
): Effect.Effect<{ readonly Position: WmApiMouse.IntPoint; }, never> => pipe(
    NativeMouse.MoveTo(
        Convert.FromIntPoint(Input),
        Input.DurationMilliseconds ?? DefaultMoveDurationMilliseconds
    ),
    Effect.as({ Position: { X: Input.X, Y: Input.Y } })
);

const MouseButtonInputSchema = Schema.Struct({ Button: WmApiMouse.MouseButtonSchema });

const MouseButtonDown = (
    Input: typeof MouseButtonInputSchema.Type
): Effect.Effect<{ readonly Button: WmApiMouse.MouseButton; }, { readonly Message: string; }> => pipe(
    Effect.sync(() => NativeMouse.MouseButtonDown(Convert.FromMouseButton(Input.Button))),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.as({ Button: Input.Button })
);

const MouseButtonUp = (
    Input: typeof MouseButtonInputSchema.Type
): Effect.Effect<{ readonly Button: WmApiMouse.MouseButton; }, { readonly Message: string; }> => pipe(
    Effect.sync(() => NativeMouse.MouseButtonUp(Convert.FromMouseButton(Input.Button))),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(ToolResult.ToMessageError),
    Effect.as({ Button: Input.Button })
);

const MouseClickInputSchema = Schema.Struct({
    Button: Schema.optional(WmApiMouse.MouseButtonSchema)
});

const MouseClick = (
    Input: typeof MouseClickInputSchema.Type
): Effect.Effect<{ readonly Button: WmApiMouse.MouseButton; }, never> =>
{
    const Button = Input.Button ?? "Left";
    return pipe(
        NativeMouse.Click(Convert.FromMouseButton(Button)),
        Effect.as({ Button })
    );
};

const MouseDragInputSchema = Schema.Struct({
    Button: Schema.optional(WmApiMouse.MouseButtonSchema),
    DurationMilliseconds: Schema.optional(Schema.Int),
    From: WmApiMouse.IntPointSchema,
    To: WmApiMouse.IntPointSchema
});

const MouseDrag = (
    Input: typeof MouseDragInputSchema.Type
): Effect.Effect<{ readonly From: WmApiMouse.IntPoint; readonly To: WmApiMouse.IntPoint; }, never> => pipe(
    NativeMouse.Drag(
        Convert.FromIntPoint(Input.From),
        Convert.FromIntPoint(Input.To),
        Input.DurationMilliseconds ?? DefaultMoveDurationMilliseconds,
        Input.Button === undefined ? undefined : Convert.FromMouseButton(Input.Button)
    ),
    Effect.as({ From: Input.From, To: Input.To })
);

export/** Every mouse-simulation tool this MCP server advertises. */
const Definitions: ReadonlyArray<ToolDefinition> = [
    {
        Description: "Get the current system cursor position.",
        Handle: ToolResult.HandleTool(NoInputSchema, GetCursorPosition),
        InputSchema: NoInputSchema,
        Name: ToolName.CursorGetPosition
    },
    {
        Description: "Teleport the cursor to an absolute virtual-screen position "
            + "instantly.",
        Handle: ToolResult.HandleTool(PointInputSchema, SetCursorPosition),
        InputSchema: PointInputSchema,
        Name: ToolName.CursorSetPosition
    },
    {
        Description: "Move the cursor smoothly to an absolute virtual-screen position "
            + "over a duration, so drag-detecting consumers see genuine incremental "
            + "motion rather than a teleport.",
        Handle: ToolResult.HandleTool(CursorMoveInputSchema, CursorMove),
        InputSchema: CursorMoveInputSchema,
        Name: ToolName.CursorMove
    },
    {
        Description: "Simulate pressing and holding a mouse button.",
        Handle: ToolResult.HandleTool(MouseButtonInputSchema, MouseButtonDown),
        InputSchema: MouseButtonInputSchema,
        Name: ToolName.MouseButtonDown
    },
    {
        Description: "Simulate releasing a mouse button.",
        Handle: ToolResult.HandleTool(MouseButtonInputSchema, MouseButtonUp),
        InputSchema: MouseButtonInputSchema,
        Name: ToolName.MouseButtonUp
    },
    {
        Description: "Simulate a click: press a mouse button, then release it shortly "
            + "after. Defaults to the left button.",
        Handle: ToolResult.HandleTool(MouseClickInputSchema, MouseClick),
        InputSchema: MouseClickInputSchema,
        Name: ToolName.MouseClick
    },
    {
        Description: "Simulate a click-and-drag gesture between two points: move to "
            + "'From', press and hold a button, move smoothly to 'To' over a duration, "
            + "then release. For dragging a specific window, prefer window_drag.",
        Handle: ToolResult.HandleTool(MouseDragInputSchema, MouseDrag),
        InputSchema: MouseDragInputSchema,
        Name: ToolName.MouseDrag
    }
];
