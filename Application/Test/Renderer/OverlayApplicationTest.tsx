/**
 * @module @sorrell/wm/Renderer/OverlayApplicationTest
 *
 * @file      OverlayApplicationTest.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    OverlayCommandDto,
    OverlayCommandTargetDto,
    OverlayScreenDto
} from "../../Source/Shared/OverlayCommand.js";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OverlayApplication } from "../../Source/Renderer/OverlayApplication.js";

const Commands: ReadonlyArray<OverlayCommandDto> =
    [
        Command("Focus", "SelectLeft", "H", 0x48),
        Command("Tile", "SelectUp", "K", 0x4B),
        Command("Move", "SelectDown", "J", 0x4A),
        Command("Resize", "SelectRight", "L", 0x4C),
        Command("TileAll", "Commit", "RETURN", 0x0D)
    ] as const;

const HomeScreen: OverlayScreenDto =
    {
        CanGoBack: false,
        Commands,
        Id: "FloatingHome",
        SecondaryCommand: {
            ApplicationName: "Visual Studio Code",
            Disabled: false,
            HotkeyId: "Toggle",
            Id: "OpenPerAppSettings",
            Shortcut: {
                KeyCode: 0x09,
                KeyLabel: "TAB",
                Modifiers: {
                    Alt: false,
                    Control: false,
                    Shift: false,
                    Super: false
                }
            }
        }
    } as const;

const FocusScreen: OverlayScreenDto =
    {
        CanGoBack: true,
        Commands: [
            Command(
                "FocusMoveLeft",
                "SelectLeft",
                "H",
                0x48,
                { Icon: "left-icon", Title: "Left App" }
            ),
            Command(
                "FocusMoveUp",
                "SelectUp",
                "K",
                0x4B,
                { Icon: undefined, Title: "Upper App" }
            ),
            Command("FocusMoveDown", "SelectDown", "J", 0x4A, undefined, true),
            Command(
                "FocusMoveRight",
                "SelectRight",
                "L",
                0x4C,
                { Icon: undefined, Title: "Right App" }
            )
        ],
        Id: "FloatingFocus"
    } as const;

const ResizeScreen = (Mode: "Grow" | "Shrink"): OverlayScreenDto => ({
    CanGoBack: true,
    Commands: [
        Command("ResizeWindowLeft", "SelectLeft", "D", 0x44),
        Command("ResizeWindowUp", "SelectUp", "H", 0x48),
        Command("ResizeWindowDown", "SelectDown", "T", 0x54),
        Command("ResizeWindowRight", "SelectRight", "N", 0x4E)
    ],
    Id: "FloatingResize",
    ResizeMode: Mode
});

describe("OverlayApplication", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(HomeScreen);
        vi.mocked(window.sorrell.overlay.invoke).mockResolvedValue();
        vi.mocked(window.sorrell.overlay.preview).mockResolvedValue();
    });

    it("renders Tile All beneath the four directional Home actions", async () =>
    {
        render(<OverlayApplication />);

        expect(await screen.findByRole("button", { name: "SorrellWm" }))
            .toHaveAttribute("aria-current", "page");
        expect(screen.getByText("Choose the type of action to perform.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Go Back" })).toBeDisabled();

        const CommandsRegion = screen.getByRole("region", { name: "Available commands" });
        const Buttons = within(CommandsRegion).getAllByRole("button");

        expect(Buttons.map((Button: HTMLElement) => Button.textContent)).toEqual([
            expect.stringContaining("Focus"),
            expect.stringContaining("Tile"),
            expect.stringContaining("Move"),
            expect.stringContaining("Resize"),
            expect.stringContaining("Tile All")
        ]);
        expect(Buttons.map((Button: HTMLElement) => Button.textContent)).toEqual([
            expect.stringContaining("H"),
            expect.stringContaining("K"),
            expect.stringContaining("J"),
            expect.stringContaining("L"),
            expect.stringContaining("⏎")
        ]);

        fireEvent.click(Buttons[2] as HTMLElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("Move");
        fireEvent.click(Buttons[4] as HTMLElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenLastCalledWith("TileAll");

        const SecondaryRegion = screen.getByLabelText("Secondary command");
        const SecondaryButton = within(SecondaryRegion).getByRole("button", {
            name: /configure how sorrellwm manages visual studio code windows/i
        });
        expect(SecondaryButton).toHaveTextContent("⭾");
        expect(within(SecondaryButton).queryByTestId("application-icon"))
            .not.toBeInTheDocument();

        fireEvent.click(SecondaryButton);
        expect(window.sorrell.overlay.invoke).toHaveBeenLastCalledWith("OpenPerAppSettings");
    });

    it("renders the five tiled Home actions with Insert and Shift plus SelectUp for Float", async () =>
    {
        const FloatCommand = Command("Float", "SelectUp", "K", 0x4B);
        const TiledHome: OverlayScreenDto = {
            CanGoBack: false,
            Commands: [
                Command("Focus", "SelectLeft", "H", 0x48),
                Command("Insert", "SelectUp", "K", 0x4B),
                Command("Move", "SelectDown", "J", 0x4A),
                Command("Resize", "SelectRight", "L", 0x4C),
                {
                    ...FloatCommand,
                    Shortcut: {
                        ...FloatCommand.Shortcut,
                        Modifiers: {
                            ...FloatCommand.Shortcut.Modifiers,
                            Shift: true
                        }
                    }
                }
            ],
            Id: "TiledHome"
        };

        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(TiledHome);
        render(<OverlayApplication />);

        const CommandsRegion = await screen.findByRole("region", {
            name: "Available commands"
        });
        const Buttons = within(CommandsRegion).getAllByRole("button");

        expect(Buttons).toHaveLength(5);
        expect(Buttons.map((Button: HTMLElement) => Button.textContent)).toEqual([
            expect.stringContaining("Focus"),
            expect.stringContaining("Insert"),
            expect.stringContaining("Move"),
            expect.stringContaining("Resize"),
            expect.stringContaining("Float")
        ]);
        expect(Buttons[1]).toHaveAttribute(
            "title",
            "Insert a window into the layout."
        );
        expect(Buttons[4]).toHaveTextContent("K");

        fireEvent.click(Buttons[4] as HTMLElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("Float");
    });

    it("renders tiled Insert directions and a floating-window picker without arrows", async () =>
    {
        const DirectionScreen: OverlayScreenDto = {
            CanGoBack: true,
            Commands: [
                Command("ChooseInsertLeft", "SelectLeft", "H", 0x48),
                Command("ChooseInsertUp", "SelectUp", "K", 0x4B),
                Command("ChooseInsertDown", "SelectDown", "J", 0x4A),
                Command("ChooseInsertRight", "SelectRight", "L", 0x4C)
            ],
            Id: "TiledInsertDirection"
        };
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(DirectionScreen);
        const DirectionRender = render(<OverlayApplication />);

        expect(await screen.findByText(
            "Choose the half of this window where the new window will go."
        )).toBeInTheDocument();
        const DirectionButtons = DirectionRender.container.querySelectorAll(
            "button[aria-hidden=\"true\"]"
        );
        expect(DirectionButtons).toHaveLength(4);
        fireEvent.click(DirectionButtons[0] as HTMLButtonElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("ChooseInsertUp");

        DirectionRender.unmount();
        vi.clearAllMocks();
        const CaptureNext = Command(
            "OpenInsertTargetForNextWindow",
            "Toggle",
            "TAB",
            0x09
        );
        const PickerScreen: OverlayScreenDto = {
            CanGoBack: true,
            Commands: [
                Command("SelectInsertWindowUp", "SelectUp", "K", 0x4B),
                Command("SelectInsertWindowDown", "SelectDown", "J", 0x4A),
                Command("CommitInsertWindow", "Commit", "RETURN", 0x0D),
                Command("OpenInsertTarget", "Toggle", "TAB", 0x09),
                {
                    ...CaptureNext,
                    Shortcut: {
                        ...CaptureNext.Shortcut,
                        Modifiers: {
                            ...CaptureNext.Shortcut.Modifiers,
                            Control: true
                        }
                    }
                }
            ],
            Id: "TiledInsertWindow",
            InsertWindows: [
                {
                    Active: true,
                    Target: { Icon: "first-icon", Title: "First App" }
                },
                {
                    Active: false,
                    Target: { Icon: undefined, Title: "Second App" }
                },
                {
                    Active: false,
                    Target: { Icon: "third-icon", Title: "Third App" }
                }
            ]
        };
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(PickerScreen);
        render(<OverlayApplication />);

        const FloatingButtons = within(await screen.findByRole("region", {
            name: "Floating windows"
        })).getAllByRole("button");
        expect(FloatingButtons).toHaveLength(3);
        expect(FloatingButtons[0]).toHaveAttribute("aria-pressed", "true");
        expect(FloatingButtons[0]).toHaveTextContent("First App");
        expect(FloatingButtons[0]).toHaveTextContent("⏎");
        expect(FloatingButtons[1]).toHaveTextContent("Second App");
        expect(FloatingButtons[1]).toHaveTextContent("J");
        expect(FloatingButtons[1]?.querySelectorAll("svg")).toHaveLength(1);

        const OtherMethods = within(screen.getByRole("region", {
            name: "Other Insert methods"
        })).getAllByRole("button");
        expect(OtherMethods[0]).toHaveTextContent("Drag a window here");
        expect(OtherMethods[0]).toHaveTextContent("⭾");
        expect(OtherMethods[1]).toHaveTextContent("Tile the next window here");
        expect(OtherMethods[1]).toHaveTextContent("Ctrl");

        await act(async () =>
        {
            fireEvent.click(FloatingButtons[2]!);
            await Promise.resolve();
            await Promise.resolve();
        });
        expect(window.sorrell.overlay.invoke).toHaveBeenNthCalledWith(
            1,
            "SelectInsertWindowDown"
        );
        expect(window.sorrell.overlay.invoke).toHaveBeenNthCalledWith(
            2,
            "SelectInsertWindowDown"
        );

        fireEvent.click(OtherMethods[1]!);
        expect(window.sorrell.overlay.invoke).toHaveBeenLastCalledWith(
            "OpenInsertTargetForNextWindow"
        );
    });

    it("renders tiled Move directions, boundaries, and parent promotion", async () =>
    {
        const Parent = Command("MoveWindowParent", "SelectUp", "K", 0x4B);
        const TiledMove: OverlayScreenDto = {
            CanGoBack: true,
            Commands: [
                Command("MoveWindowLeft", "SelectLeft", "H", 0x48),
                Command("MoveWindowUp", "SelectUp", "K", 0x4B, undefined, true),
                Command("MoveWindowDown", "SelectDown", "J", 0x4A, undefined, true),
                Command("MoveWindowRight", "SelectRight", "L", 0x4C),
                {
                    ...Parent,
                    Shortcut: {
                        ...Parent.Shortcut,
                        Modifiers: {
                            ...Parent.Shortcut.Modifiers,
                            Control: true
                        }
                    }
                },
                Command("MoveWindowFirst", "SelectFirst", "HOME", 0x24),
                Command("MoveWindowLast", "SelectLast", "END", 0x23),
                Command("MoveWindowIntoPanel", "Commit", "RETURN", 0x0D, undefined, true)
            ],
            Id: "TiledMove"
        };
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(TiledMove);
        render(<OverlayApplication />);

        expect(await screen.findByRole("button", { name: "Move" }))
            .toHaveAttribute("aria-current", "page");
        expect(screen.getByText("Choose where to move the tiled window."))
            .toBeInTheDocument();

        const MoveButtons = within(screen.getByRole("region", {
            name: "Move targets"
        })).getAllByRole("button", { hidden: true });
        expect(MoveButtons).toHaveLength(7);
        expect(MoveButtons.map((Button: HTMLElement) => Button.textContent)).toEqual([
            expect.stringContaining("Move Left"),
            expect.stringContaining("Move Up"),
            expect.stringContaining("Move Down"),
            expect.stringContaining("Move Right"),
            expect.stringContaining("Move After Parent Panel"),
            expect.stringContaining("Move First"),
            expect.stringContaining("Move Last")
        ]);
        expect(MoveButtons[1]).toBeDisabled();
        expect(MoveButtons[2]).toBeDisabled();
        expect(MoveButtons[4]).toHaveTextContent("Ctrl");
        expect(MoveButtons[5]).toHaveTextContent("HOME");
        expect(MoveButtons[6]).toHaveTextContent("END");
        expect(screen.queryByText("Move Into Panel")).not.toBeInTheDocument();

        fireEvent.click(MoveButtons[3] as HTMLElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("MoveWindowRight");
    });

    it("shows only the reverse move and Commit while a tiled panel is targeted", async () =>
    {
        const TiledMovePanelTarget: OverlayScreenDto = {
            CanGoBack: true,
            Commands: [
                Command("MoveWindowLeft", "SelectLeft", "H", 0x48),
                Command("MoveWindowUp", "SelectUp", "K", 0x4B, undefined, true),
                Command("MoveWindowDown", "SelectDown", "J", 0x4A, undefined, true),
                Command("MoveWindowRight", "SelectRight", "L", 0x4C, undefined, true),
                Command("MoveWindowParent", "SelectUp", "K", 0x4B, undefined, true),
                Command("MoveWindowFirst", "SelectFirst", "HOME", 0x24, undefined, true),
                Command("MoveWindowLast", "SelectLast", "END", 0x23, undefined, true),
                Command("MoveWindowIntoPanel", "Commit", "RETURN", 0x0D)
            ],
            Id: "TiledMove",
            IsTiledMovePanelTargeted: true
        };
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(TiledMovePanelTarget);
        render(<OverlayApplication />);

        expect(await screen.findByText("Move into the highlighted panel"))
            .toBeInTheDocument();
        const MoveButtons = within(screen.getByRole("region", {
            name: "Move targets"
        })).getAllByRole("button");
        expect(MoveButtons).toHaveLength(2);
        expect(MoveButtons[0]).toHaveTextContent("Move Left");
        expect(MoveButtons[1]).toHaveTextContent("Move Into Panel");
        expect(MoveButtons[1]).toHaveTextContent("⏎");

        fireEvent.click(MoveButtons[1] as HTMLElement);
        expect(window.sorrell.overlay.invoke)
            .toHaveBeenCalledWith("MoveWindowIntoPanel");
    });

    it("renders Focus targets, icons, disabled directions, previews, and navigation", async () =>
    {
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(FocusScreen);
        render(<OverlayApplication />);

        expect(await screen.findByRole("button", { name: "Focus" }))
            .toHaveAttribute("aria-current", "page");
        expect(screen.getByText("Choose a direction to move the focus selection."))
            .toBeInTheDocument();
        const FocusButtons = within(screen.getByRole("region", {
            name: "Focus targets"
        })).getAllByRole("button", { hidden: true });
        const MoveUp = FocusButtons[0]!;
        const MoveDown = FocusButtons[1]!;
        const MoveLeft = FocusButtons[2]!;

        expect(MoveLeft).toHaveTextContent("Left App");
        expect(MoveUp).toHaveTextContent("Upper App");
        expect(MoveDown).toBeDisabled();
        expect(FocusButtons[3]).toBeInTheDocument();
        expect(MoveLeft.querySelector("img"))
            .toHaveAttribute("src", "data:image/png;base64,left-icon");
        expect(MoveUp.querySelectorAll("svg")).toHaveLength(2);
        expect(MoveDown.querySelector("img")).not.toBeInTheDocument();

        fireEvent.mouseEnter(MoveLeft);
        expect(window.sorrell.overlay.preview).toHaveBeenCalledWith("FocusMoveLeft");
        fireEvent.mouseLeave(MoveLeft);
        expect(window.sorrell.overlay.preview).toHaveBeenLastCalledWith(null);

        fireEvent.click(MoveLeft);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("FocusMoveLeft");
        fireEvent.click(MoveDown);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledTimes(1);

        const BackButton = screen.getByRole("button", { name: "Go Back" });
        expect(BackButton).toHaveAttribute("title", "Back");
        expect(BackButton).not.toHaveTextContent("Back");

        fireEvent.click(BackButton);
        expect(window.sorrell.overlay.back).toHaveBeenCalledOnce();

        fireEvent.click(screen.getByRole("button", { name: "SorrellWm" }));
        expect(window.sorrell.overlay.back).toHaveBeenCalledTimes(2);
    });

    it.each([ "FloatingFocus", "TiledFocus" ] as const)(
        "dismisses the %s failure message after five seconds",
        async (Id: "FloatingFocus" | "TiledFocus") =>
        {
            vi.useFakeTimers();

            try
            {
                vi.mocked(window.sorrell.overlay.get).mockResolvedValue({
                    ...FocusScreen,
                    FocusFailure: { WindowTitle: "Unresponsive Window" },
                    Id
                });

                render(<OverlayApplication />);
                await act(async () =>
                {
                    await Promise.resolve();
                });

                expect(screen.getByText("Could not move focus")).toBeInTheDocument();
                expect(screen.getByText("Unresponsive Window could not be focused."))
                    .toBeInTheDocument();

                act(() => vi.advanceTimersByTime(4_999));
                expect(screen.getByText("Could not move focus")).toBeInTheDocument();

                act(() => vi.advanceTimersByTime(1));
                expect(screen.queryByText("Could not move focus")).not.toBeInTheDocument();
            }
            finally
            {
                vi.useRealTimers();
            }
        }
    );

    it("renders Ctrl plus SelectUp as the tiled parent-panel command", async () =>
    {
        const ParentCommand = Command(
            "FocusMoveParent",
            "SelectUp",
            "K",
            0x4B,
            { Icon: undefined, Title: "Horizontal panel" }
        );
        const FirstCommand = Command(
            "FocusMoveFirst",
            "SelectFirst",
            "HOME",
            0x24,
            { Icon: undefined, Title: "First App" }
        );
        const LastCommand = Command(
            "FocusMoveLast",
            "SelectLast",
            "END",
            0x23,
            { Icon: undefined, Title: "Last App" }
        );
        const RootCommand = Command(
            "FocusMoveRoot",
            "SelectFirst",
            "HOME",
            0x24,
            { Icon: undefined, Title: "Root panel" }
        );
        const TiledFocus: OverlayScreenDto = {
            ...FocusScreen,
            Commands: [
                ...FocusScreen.Commands,
                {
                    ...ParentCommand,
                    Shortcut: {
                        ...ParentCommand.Shortcut,
                        Modifiers: {
                            Alt: false,
                            Control: true,
                            Shift: false,
                            Super: false
                        }
                    }
                },
                FirstCommand,
                LastCommand,
                RootCommand
            ],
            Id: "TiledFocus"
        };

        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(TiledFocus);
        render(<OverlayApplication />);

        expect(await screen.findByRole("button", { name: "Focus" }))
            .toHaveAttribute("aria-current", "page");
        const FocusButtons = within(screen.getByRole("region", {
            name: "Focus targets"
        })).getAllByRole("button", { hidden: true });
        expect(FocusButtons).toHaveLength(5);
        expect(screen.queryByText("Focus Parent Panel")).not.toBeInTheDocument();
        const ParentButton = screen.getByRole("button", {
            name: /Horizontal panel/u
        });
        expect(ParentButton).toHaveTextContent("Ctrl");
        expect(ParentButton).toHaveTextContent("K");
        expect(screen.queryByText("Focus First")).not.toBeInTheDocument();
        expect(screen.queryByText("Focus Last")).not.toBeInTheDocument();
        expect(screen.queryByText("Focus Root Panel")).not.toBeInTheDocument();

        fireEvent.click(ParentButton);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("FocusMoveParent");
    });

    it("renders stack windows as compact focus choices without direction icons", async () =>
    {
        const StackFocus: OverlayScreenDto = {
            ...FocusScreen,
            Id: "TiledFocus",
            StackWindows: [
                {
                    Active: true,
                    Target: { Icon: "first-icon", Title: "First App" }
                },
                {
                    Active: false,
                    Target: { Icon: undefined, Title: "Second App" }
                },
                {
                    Active: false,
                    Target: { Icon: "third-icon", Title: "Third App" }
                }
            ]
        };

        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(StackFocus);
        render(<OverlayApplication />);

        const StackButtons = within(await screen.findByRole("region", {
            name: "Windows in stack"
        })).getAllByRole("button");

        expect(StackButtons).toHaveLength(3);
        expect(StackButtons[0]).toHaveAttribute("aria-pressed", "true");
        expect(StackButtons[0]).toHaveTextContent("First App");
        expect(StackButtons[0]?.querySelector("img")).toHaveAttribute(
            "src",
            "data:image/png;base64,first-icon"
        );
        expect(StackButtons[1]).toHaveTextContent("Second App");
        expect(StackButtons[1]).toHaveTextContent("J");
        expect(StackButtons[1]?.querySelectorAll("svg")).toHaveLength(1);
        expect(StackButtons[2]).toHaveTextContent("Third App");
        expect(screen.queryByRole("region", { name: "Focus targets" }))
            .not.toBeInTheDocument();

        await act(async () =>
        {
            fireEvent.click(StackButtons[2]!);
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(window.sorrell.overlay.invoke).toHaveBeenNthCalledWith(
            1,
            "FocusMoveDown"
        );
        expect(window.sorrell.overlay.invoke).toHaveBeenNthCalledWith(
            2,
            "FocusMoveDown"
        );
    });

    it("renders numbered monitors in a second column beside selection commands", async () =>
    {
        const RootFocus: OverlayScreenDto = {
            ...FocusScreen,
            Commands: FocusScreen.Commands,
            Id: "TiledFocus",
            IsRootPanelFocused: true,
            MonitorCommands: [
                Command(
                    "FocusMonitor1",
                    "SelectMonitor1",
                    "1",
                    0x31,
                    { Icon: undefined, Title: "Display 1: Primary" }
                ),
                Command(
                    "FocusMonitor2",
                    "SelectMonitor2",
                    "2",
                    0x32,
                    { Icon: undefined, Title: "Display 2: Projector" },
                    true
                ),
                Command(
                    "FocusMonitor3",
                    "SelectMonitor3",
                    "3",
                    0x33,
                    { Icon: undefined, Title: "Display 3: Desk" }
                )
            ]
        };

        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(RootFocus);
        render(<OverlayApplication />);

        const DirectionButtons = within(await screen.findByRole("region", {
            name: "Focus targets"
        })).getAllByRole("button");
        expect(DirectionButtons).toHaveLength(4);
        expect(DirectionButtons[0]).toHaveTextContent("K");
        expect(DirectionButtons[2]).toHaveTextContent("H");
        expect(DirectionButtons.every((Button: HTMLElement) =>
            Button.querySelector("svg") !== null)).toBe(true);

        const MonitorButtons = within(screen.getByRole("region", {
            name: "Monitors"
        })).getAllByRole("button");
        const CommandGroups = screen.getByRole("group", {
            name: "Focus command groups"
        });
        expect(CommandGroups.children[0]).toBe(screen.getByRole("region", {
            name: "Focus targets"
        }));
        expect(CommandGroups.children[1]).toBe(screen.getByRole("region", {
            name: "Monitors"
        }));
        expect(CommandGroups).toHaveStyle({
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
        });
        expect(MonitorButtons).toHaveLength(3);
        expect(MonitorButtons[0]).toHaveTextContent("Display 1: Primary");
        expect(MonitorButtons[0]).toHaveTextContent("1");
        expect(MonitorButtons[1]).toBeDisabled();
        expect(MonitorButtons[2]).toHaveTextContent("Display 3: Desk");

        fireEvent.click(MonitorButtons[2] as HTMLElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("FocusMonitor3");
    });

    it("shows the single Resize pad and reverses its arrows while Ctrl shrinks", async () =>
    {
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(ResizeScreen("Grow"));
        const GrowRender = render(<OverlayApplication />);

        expect(await screen.findByText(
            "Choose an edge to grow the window. Hold Ctrl to shrink it instead."
        )).toBeInTheDocument();

        const GrowArrows = Array.from(
            GrowRender.container.querySelectorAll("button[aria-hidden=\"true\"] svg")
        ).map((Icon: Element) => Icon.innerHTML);

        const DirectionButtons = GrowRender.container.querySelectorAll(
            "button[aria-hidden=\"true\"]"
        );
        fireEvent.click(DirectionButtons[0] as HTMLButtonElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("ResizeWindowUp");

        GrowRender.unmount();
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(ResizeScreen("Shrink"));
        const ShrinkRender = render(<OverlayApplication />);
        await screen.findByText(
            "Choose an edge to grow the window. Hold Ctrl to shrink it instead."
        );

        const ShrinkArrows = Array.from(
            ShrinkRender.container.querySelectorAll("button[aria-hidden=\"true\"] svg")
        ).map((Icon: Element) => Icon.innerHTML);

        expect(GrowArrows).toHaveLength(4);
        expect(ShrinkArrows).toEqual([
            GrowArrows[3],
            GrowArrows[2],
            GrowArrows[1],
            GrowArrows[0]
        ]);
    });

    it("shows and invokes the tiled resize redistribution behavior", async () =>
    {
        const TiledResize: OverlayScreenDto = {
            ...ResizeScreen("Grow"),
            Commands: [
                ...ResizeScreen("Grow").Commands,
                Command(
                    "ToggleTiledResizeBehavior",
                    "Toggle",
                    "TAB",
                    0x09
                )
            ],
            Id: "TiledResize",
            TiledResizeBehavior: "PreserveRatios"
        };

        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(TiledResize);
        render(<OverlayApplication />);

        expect(await screen.findByText(
            "Choose an edge to grow the tiled window. Hold Ctrl to shrink it. "
            + "Press Tab to change how surrounding windows respond."
        )).toBeInTheDocument();
        const Behavior = screen.getByRole("button", {
            name: "Preserve other window ratios"
        });
        expect(Behavior).toHaveTextContent("⭾");
        expect(Behavior).toHaveAttribute("aria-pressed", "false");

        fireEvent.click(Behavior);
        expect(window.sorrell.overlay.invoke)
            .toHaveBeenCalledWith("ToggleTiledResizeBehavior");
    });
});

/** Construct one renderer-safe command fixture. */
function Command(
    Id: OverlayCommandDto["Id"],
    HotkeyId: OverlayCommandDto["HotkeyId"],
    KeyLabel: string,
    KeyCode: number,
    Target?: OverlayCommandTargetDto,
    Disabled: boolean = false
): OverlayCommandDto
{
    return {
        Disabled,
        HotkeyId,
        Id,
        Shortcut:
        {
            KeyCode,
            KeyLabel,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        },
        ...(Target === undefined ? { } : { Target })
    };
}
