/**
 * Tests the MCP tool handlers against a mocked `@sorrell/windows` and a fake
 * `TilingManagerImpl`, matching `CommandExecutor.Test.ts`'s mocking conventions.
 *
 * @module @sorrell/wm/Test/McpTools
 *
 * @file      McpTools.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Tiling from "../../Source/Main/Tiling/index.ts";
import * as ToolsMouse from "../../Source/Main/Mcp/Tools/Mouse.ts";
import * as ToolsTiling from "../../Source/Main/Mcp/Tools/Tiling.ts";
import * as ToolsWindow from "../../Source/Main/Mcp/Tools/Window.ts";
import * as WmApi from "@sorrell/wm-api";
import { Effect, Option, Result, Stream } from "effect";
import { Mouse as WindowsMouse, Window as WindowsWindow } from "@sorrell/windows";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Box } from "@sorrell/math";
import type { Handle } from "@sorrell/windows";

vi.mock("@sorrell/windows", async () =>
{
    const { Option: EffectOption, Result: EffectResult } = await import("effect");

    return {
        Mouse:
        {
            Click: vi.fn(() => Effect.void),
            Drag: vi.fn(() => Effect.void),
            MouseButtonDown: vi.fn(() => EffectResult.succeed(undefined)),
            MouseButtonUp: vi.fn(() => EffectResult.succeed(undefined)),
            MoveTo: vi.fn(() => Effect.void),
            SetCursorPosition: vi.fn(() => EffectResult.succeed(undefined))
        },
        Screen:
        {
            GetMonitors: vi.fn(() => EffectResult.succeed([ ]))
        },
        VK:
        {
            LBUTTON: 0x01,
            MBUTTON: 0x04,
            RBUTTON: 0x02,
            XBUTTON1: 0x05,
            XBUTTON2: 0x06
        },
        Window:
        {
            GetApplicationName: vi.fn(() => EffectOption.none()),
            GetCursorPosition: vi.fn(() => EffectOption.none()),
            GetExecutablePath: vi.fn(() => EffectOption.none()),
            GetForegroundWindow: vi.fn(() => EffectOption.none()),
            GetManageableTopLevelWindows: vi.fn(() => EffectResult.succeed([ ])),
            GetWindowRect: vi.fn(() => EffectOption.none()),
            GetWindowText: vi.fn(() => EffectOption.none()),
            SetForegroundWindow: vi.fn(() => EffectResult.succeed(undefined)),
            SetWindowRect: vi.fn(() => EffectResult.succeed(undefined))
        }
    };
});

const FakeWindow = 42n as Handle.HWND;

const FakeTilingManagerImpl = (
    Overrides: Partial<Tiling.Manager.TilingManagerImpl> = { }
): Tiling.Manager.TilingManagerImpl => ({
    BringStackWindowToFront: () => Effect.void,
    Changes: Stream.empty,
    Float: () => Effect.void,
    Gap: Effect.succeed(0),
    Insert: () => Effect.void,
    Move: () => Effect.void,
    MoveIntoPanel: () => Effect.void,
    MoveToContainingPanel: () => Effect.void,
    MoveToIndex: () => Effect.void,
    PreviewInsert: () => Effect.succeed(Box.Box(0, 100, 100, 0)),
    Reconcile: Effect.void,
    Refresh: Effect.void,
    Resize: () => Effect.void,
    SetGap: () => Effect.void,
    SetPanelOrientation: () => Effect.void,
    SetPanelRatio: () => Effect.void,
    Snapshot: Effect.succeed({ Workspaces: [ ] }),
    Tile: () => Effect.void,
    TileExistingWindows: Effect.void,
    ...Overrides
});

beforeEach(() =>
{
    vi.clearAllMocks();
    vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(Result.succeed([ ]));
    vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetWindowText).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetApplicationName).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetExecutablePath).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.SetForegroundWindow).mockReturnValue(Result.succeed(undefined));
    vi.mocked(WindowsWindow.GetCursorPosition).mockReturnValue(Option.none());
});

describe("Mcp.Tools.Window", () =>
{
    it("lists a manageable window, cross-referencing the tiling snapshot", async () =>
    {
        vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(
            Result.succeed([ FakeWindow ])
        );
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(Box.Box(0, 100, 100, 0))
        );
        vi.mocked(WindowsWindow.GetWindowText).mockReturnValue(Option.some("Notepad"));

        const Definitions = ToolsWindow.MakeDefinitions(FakeTilingManagerImpl());
        const ListWindows = Definitions.find(
            (Definition) => Definition.Name === "window_list"
        )!;

        const OutputResult = await Effect.runPromise(ListWindows.Handle({ }));
        expect(OutputResult.isError).toBeUndefined();

        const Payload = JSON.parse((OutputResult.content[0] as { text: string; }).text) as
            ReadonlyArray<WmApi.Window.WindowDetail>;
        expect(Payload).toHaveLength(1);
        expect(Payload[0]!.Title).toBe("Notepad");
        expect(Payload[0]!.IsTiled).toBe(false);
    });

    it("reports a native failure as an error tool result", async () =>
    {
        vi.mocked(WindowsWindow.SetForegroundWindow).mockReturnValue(
            Result.fail({ Message: "Access denied." } as never)
        );

        const Definitions = ToolsWindow.MakeDefinitions(FakeTilingManagerImpl());
        const FocusWindow = Definitions.find(
            (Definition) => Definition.Name === "window_focus"
        )!;

        const OutputResult = await Effect.runPromise(FocusWindow.Handle({
            WindowId: WmApi.Window.ToWindowId(FakeWindow)
        }));

        expect(OutputResult.isError).toBe(true);
    });

    it("reports invalid tool arguments as an error result rather than throwing", async () =>
    {
        const Definitions = ToolsWindow.MakeDefinitions(FakeTilingManagerImpl());
        const FocusWindow = Definitions.find(
            (Definition) => Definition.Name === "window_focus"
        )!;

        const OutputResult = await Effect.runPromise(FocusWindow.Handle({ WindowId: 12 }));
        expect(OutputResult.isError).toBe(true);
    });
});

describe("Mcp.Tools.Tiling", () =>
{
    it("flattens an empty tiling snapshot", async () =>
    {
        const Definitions = ToolsTiling.MakeDefinitions(FakeTilingManagerImpl());
        const GetSnapshot = Definitions.find(
            (Definition) => Definition.Name === "tiling_snapshot"
        )!;

        const OutputResult = await Effect.runPromise(GetSnapshot.Handle({ }));
        const Payload = JSON.parse((OutputResult.content[0] as { text: string; }).text) as
            WmApi.Tiling.TilingSnapshot;

        expect(Payload.Panels).toEqual([ ]);
        expect(Payload.Windows).toEqual([ ]);
        expect(Payload.Workspaces).toEqual([ ]);
    });

    it("flattens a single tiled window into the snapshot", async () =>
    {
        const Node: Tiling.Tree.Node = {
            _tag: "Window",
            Value: { InitialBounds: Box.Box(0, 100, 100, 0), Window: FakeWindow }
        };

        const Manager = FakeTilingManagerImpl({
            Snapshot: Effect.succeed({
                Workspaces: [ { Bounds: Box.Box(0, 1920, 1080, 0), Id: "Monitor1", Root: Node } ]
            })
        });

        const Definitions = ToolsTiling.MakeDefinitions(Manager);
        const GetSnapshot = Definitions.find(
            (Definition) => Definition.Name === "tiling_snapshot"
        )!;

        const OutputResult = await Effect.runPromise(GetSnapshot.Handle({ }));
        const Payload = JSON.parse((OutputResult.content[0] as { text: string; }).text) as
            WmApi.Tiling.TilingSnapshot;

        expect(Payload.Windows).toHaveLength(1);
        expect(Payload.Windows[0]!.WorkspaceId).toBe("Monitor1");
    });
});

describe("Mcp.Tools.Mouse", () =>
{
    it("reports an error when the cursor position cannot be read", async () =>
    {
        const GetCursorPosition = ToolsMouse.Definitions.find(
            (Definition) => Definition.Name === "cursor_get_position"
        )!;

        const OutputResult = await Effect.runPromise(GetCursorPosition.Handle({ }));
        expect(OutputResult.isError).toBe(true);
    });

    it("simulates a click via the native Mouse module", async () =>
    {
        const MouseClick = ToolsMouse.Definitions.find(
            (Definition) => Definition.Name === "mouse_click"
        )!;

        const OutputResult = await Effect.runPromise(MouseClick.Handle({ }));
        expect(OutputResult.isError).toBeUndefined();
        expect(WindowsMouse.Click).toHaveBeenCalledTimes(1);
    });
});
