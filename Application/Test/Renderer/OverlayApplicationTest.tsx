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
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { OverlayApplication } from "../../Source/Renderer/OverlayApplication.js";

const Commands: ReadonlyArray<OverlayCommandDto> =
    [
        Command("Focus", "SelectLeft", "H", 0x48),
        Command("Insert", "SelectUp", "K", 0x4B),
        Command("Move", "SelectDown", "J", 0x4A),
        Command("Resize", "SelectRight", "L", 0x4C)
    ] as const;

const HomeScreen: OverlayScreenDto =
    {
        CanGoBack: false,
        Commands,
        Id: "Home",
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
        Id: "Focus"
    } as const;

describe("OverlayApplication", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(HomeScreen);
        vi.mocked(window.sorrell.overlay.invoke).mockResolvedValue();
        vi.mocked(window.sorrell.overlay.preview).mockResolvedValue();
    });

    it("renders the primary commands in action-key order and invokes them", async () =>
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
            expect.stringContaining("Insert"),
            expect.stringContaining("Move"),
            expect.stringContaining("Resize")
        ]);
        expect(Buttons.map((Button: HTMLElement) => Button.textContent)).toEqual([
            expect.stringContaining("H"),
            expect.stringContaining("K"),
            expect.stringContaining("J"),
            expect.stringContaining("L")
        ]);

        fireEvent.click(Buttons[2] as HTMLElement);
        expect(window.sorrell.overlay.invoke).toHaveBeenCalledWith("Move");

        const SecondaryRegion = screen.getByLabelText("Secondary command");
        const SecondaryButton = within(SecondaryRegion).getByRole("button", {
            name: /configure how sorrellwm manages visual studio code windows/i
        });
        expect(SecondaryButton).toHaveTextContent("TAB");
        expect(within(SecondaryButton).queryByTestId("application-icon"))
            .not.toBeInTheDocument();

        fireEvent.click(SecondaryButton);
        expect(window.sorrell.overlay.invoke).toHaveBeenLastCalledWith("OpenPerAppSettings");
    });

    it("renders Focus targets, icons, disabled directions, previews, and navigation", async () =>
    {
        vi.mocked(window.sorrell.overlay.get).mockResolvedValue(FocusScreen);
        render(<OverlayApplication />);

        expect(await screen.findByRole("button", { name: "Focus" }))
            .toHaveAttribute("aria-current", "page");
        expect(screen.getByText("Choose a direction to move the focus selection."))
            .toBeInTheDocument();
        const MoveLeft = screen.getByRole("button", { name: /move left/i });
        const MoveUp = screen.getByRole("button", { name: /move up/i });
        const MoveDown = screen.getByRole("button", { name: /move down/i });

        expect(MoveLeft).toHaveTextContent("Left App");
        expect(MoveUp).toHaveTextContent("Upper App");
        expect(MoveDown).toBeDisabled();
        expect(MoveDown).toHaveTextContent("No window in this direction.");
        expect(screen.getByRole("button", { name: /move right/i })).toBeInTheDocument();
        expect(within(MoveLeft).getByTestId("application-icon").querySelector("img"))
            .toHaveAttribute("src", "data:image/png;base64,left-icon");
        expect(within(MoveUp).getByTestId("application-icon").querySelector("svg"))
            .not.toBeNull();
        expect(within(MoveDown).queryByTestId("application-icon")).not.toBeInTheDocument();

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
