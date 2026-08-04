/**
 * The command surface shown by the application overlay window.
 *
 * @module @sorrell/wm/Renderer/OverlayApplication
 *
 * @file      OverlayApplication.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "../../Logging.js";
import {
    AddSquareRegular,
    AppGenericRegular,
    ArrowDownRegular,
    ArrowLeft16Regular,
    ArrowLeftRegular,
    ArrowMoveRegular,
    ArrowRightRegular,
    ArrowUpRegular,
    BoardFilled,
    BoardRegular,
    CursorClickRegular,
    DesktopRegular,
    type FluentIcon,
    GridRegular,
    ResizeLargeRegular,
    WindowArrowUpRegular,
    WindowSettingsRegular
} from "@fluentui/react-icons";
import {
    Breadcrumb,
    BreadcrumbButton,
    BreadcrumbDivider,
    BreadcrumbItem,
    Button,
    Link,
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
    makeStyles,
    mergeClasses,
    tokens
} from "@fluentui/react-components";
import {
    CommandButton,
    CompactCommandButton,
    DirectionalPad,
    type DirectionalPadDirection
} from "../../Component/index.js";
import { EncodeSettingsPath, SettingsSectionId } from "../../../Shared/SettingsPath.js";
import { Option, Predicate, Struct, pipe } from "effect";
import {
    type OverlayCommandDto,
    OverlayCommandId,
    type OverlayCommandId as OverlayCommandIdType,
    type OverlayFocusFailureDto,
    type OverlayInsertWindowDto,
    type OverlayScreenDto,
    OverlayScreenId,
    type OverlayStackWindowDto
} from "../../../Shared/OverlayCommand.js";
import { type SampledColor, ToCssColor, UseDominantColor } from "../../Hook/index.js";
import { useEffect, useState } from "react";
import { DistanceToggle } from "../Overlay/DistanceToggle.js";
import { FocusDirectionButton } from "../Overlay/FocusDirectionButton.js";

interface PresentationContext
{
    readonly IsTiled: boolean;
    readonly WindowTitle: Option.Option<string>;
    readonly ApplicationName: Option.Option<string>;
}

interface Presentation
{
    readonly Description:
        | string
        | ((Context: PresentationContext) => string);

    readonly Label: string;
}

interface CommandPresentation extends Presentation
{
    readonly Icon: FluentIcon;
}

interface ScreenPresentation extends Presentation { }

const DefaultPresentationContext: PresentationContext = Object.freeze({
    ApplicationName: Option.none(),
    IsTiled: false,
    WindowTitle: Option.none()
});

const FocusFailureDismissalDelay = 5_000;

const ResolveDescription = (
    { Description }: Presentation,
    Context: PresentationContext
): string => typeof Description === "function" ? Description(Context) : Description;

const Presentation: Readonly<Record<OverlayCommandIdType, CommandPresentation>> =
    {
        [ OverlayCommandId.ChooseInsertDown ]:
        {
            Description: "Insert into the bottom half of this window.",
            Icon: ArrowDownRegular,
            Label: "Insert Down"
        },
        [ OverlayCommandId.ChooseInsertLeft ]:
        {
            Description: "Insert into the left half of this window.",
            Icon: ArrowLeftRegular,
            Label: "Insert Left"
        },
        [ OverlayCommandId.ChooseInsertRight ]:
        {
            Description: "Insert into the right half of this window.",
            Icon: ArrowRightRegular,
            Label: "Insert Right"
        },
        [ OverlayCommandId.ChooseInsertUp ]:
        {
            Description: "Insert into the top half of this window.",
            Icon: ArrowUpRegular,
            Label: "Insert Up"
        },
        [ OverlayCommandId.CommitInsertWindow ]:
        {
            Description: "Insert the selected floating window.",
            Icon: AddSquareRegular,
            Label: "Insert Selected Window"
        },
        [ OverlayCommandId.Focus ]:
        {
            Description: "Choose a window to focus.",
            Icon: CursorClickRegular,
            Label: "Focus"
        },
        [ OverlayCommandId.FocusMonitor1 ]:
        {
            Description: "Focus display 1.",
            Icon: DesktopRegular,
            Label: "Display 1"
        },
        [ OverlayCommandId.FocusMonitor2 ]:
        {
            Description: "Focus display 2.",
            Icon: DesktopRegular,
            Label: "Display 2"
        },
        [ OverlayCommandId.FocusMonitor3 ]:
        {
            Description: "Focus display 3.",
            Icon: DesktopRegular,
            Label: "Display 3"
        },
        [ OverlayCommandId.FocusMonitor4 ]:
        {
            Description: "Focus display 4.",
            Icon: DesktopRegular,
            Label: "Display 4"
        },
        [ OverlayCommandId.FocusMonitor5 ]:
        {
            Description: "Focus display 5.",
            Icon: DesktopRegular,
            Label: "Display 5"
        },
        [ OverlayCommandId.FocusMonitor6 ]:
        {
            Description: "Focus display 6.",
            Icon: DesktopRegular,
            Label: "Display 6"
        },
        [ OverlayCommandId.FocusMonitor7 ]:
        {
            Description: "Focus display 7.",
            Icon: DesktopRegular,
            Label: "Display 7"
        },
        [ OverlayCommandId.FocusMonitor8 ]:
        {
            Description: "Focus display 8.",
            Icon: DesktopRegular,
            Label: "Display 8"
        },
        [ OverlayCommandId.FocusMonitor9 ]:
        {
            Description: "Focus display 9.",
            Icon: DesktopRegular,
            Label: "Display 9"
        },
        [ OverlayCommandId.FocusMoveDown ]:
        {
            Description: "Move the focus selection down.",
            Icon: ArrowDownRegular,
            Label: "Focus Down"
        },
        [ OverlayCommandId.FocusMoveFirst ]:
        {
            Description: "Move focus to the first child.",
            Icon: ArrowLeftRegular,
            Label: "Focus First"
        },
        [ OverlayCommandId.FocusMoveLast ]:
        {
            Description: "Move focus to the last child.",
            Icon: ArrowRightRegular,
            Label: "Focus Last"
        },
        [ OverlayCommandId.FocusMoveLeft ]:
        {
            Description: "Move the focus selection left.",
            Icon: ArrowLeftRegular,
            Label: "Focus Left"
        },
        [ OverlayCommandId.FocusMoveParent ]:
        {
            Description: "Move the focus selection to its containing panel.",
            Icon: ArrowUpRegular,
            Label: "Focus Parent Panel"
        },
        [ OverlayCommandId.FocusMoveRight ]:
        {
            Description: "Move the focus selection right.",
            Icon: ArrowRightRegular,
            Label: "Focus Right"
        },
        [ OverlayCommandId.FocusMoveRoot ]:
        {
            Description: "Move focus to the monitor's root panel.",
            Icon: ArrowUpRegular,
            Label: "Focus Root Panel"
        },
        [ OverlayCommandId.FocusMoveUp ]:
        {
            Description: "Move the focus selection up.",
            Icon: ArrowUpRegular,
            Label: "Focus Up"
        },
        [ OverlayCommandId.Float ]:
        {
            Description: "Remove this window from the tiled layout.",
            Icon: WindowArrowUpRegular,
            Label: "Float"
        },
        [ OverlayCommandId.MoveWindowDown ]:
        {
            Description: "Move the window down.",
            Icon: ArrowDownRegular,
            Label: "Move Down"
        },
        [ OverlayCommandId.MoveWindowFirst ]:
        {
            Description: "Move the window to the first position in its panel.",
            Icon: ArrowLeftRegular,
            Label: "Move First"
        },
        [ OverlayCommandId.MoveWindowIntoPanel ]:
        {
            Description: "Move the window into the highlighted panel.",
            Icon: AddSquareRegular,
            Label: "Move Into Panel"
        },
        [ OverlayCommandId.MoveWindowLast ]:
        {
            Description: "Move the window to the last position in its panel.",
            Icon: ArrowRightRegular,
            Label: "Move Last"
        },
        [ OverlayCommandId.MoveWindowLeft ]:
        {
            Description: "Move the window left.",
            Icon: ArrowLeftRegular,
            Label: "Move Left"
        },
        [ OverlayCommandId.MoveWindowParent ]:
        {
            Description: "Move the window after its current panel.",
            Icon: ArrowUpRegular,
            Label: "Move After Parent Panel"
        },
        [ OverlayCommandId.MoveWindowRight ]:
        {
            Description: "Move the window right.",
            Icon: ArrowRightRegular,
            Label: "Move Right"
        },
        [ OverlayCommandId.MoveWindowUp ]:
        {
            Description: "Move the window up.",
            Icon: ArrowUpRegular,
            Label: "Move Up"
        },
        [ OverlayCommandId.OpenInsertTarget ]:
        {
            Description: "Create a target where a floating window can be dropped.",
            Icon: CursorClickRegular,
            Label: "Drag a Window Here"
        },
        [ OverlayCommandId.OpenInsertTargetForNextWindow ]:
        {
            Description: "Create a target that captures the next eligible window.",
            Icon: AddSquareRegular,
            Label: "Tile the Next Window Here"
        },
        [ OverlayCommandId.Insert ]:
        {
            Description: (Context: PresentationContext) =>
                Context.IsTiled
                    ? "Insert a window into the layout."
                    : "Create a new floating window",
            Icon: AddSquareRegular,
            Label: "Insert"
        },
        [ OverlayCommandId.Move ]:
        {
            Description: (Context: PresentationContext) =>
                Context.IsTiled
                    ? "Move this window within the tiled layout."
                    : "Change the position of this window.",
            Icon: ArrowMoveRegular,
            Label: "Move"
        },
        [ OverlayCommandId.Resize ]:
        {
            Description: () => "Resize this window.",
            Icon: ResizeLargeRegular,
            Label: "Resize"
        },
        [ OverlayCommandId.ResizeWindowDown ]:
        {
            Description: "Move this window's bottom edge.",
            Icon: ArrowDownRegular,
            Label: "Resize Down"
        },
        [ OverlayCommandId.ResizeWindowLeft ]:
        {
            Description: "Move this window's left edge.",
            Icon: ArrowLeftRegular,
            Label: "Resize Left"
        },
        [ OverlayCommandId.ResizeWindowRight ]:
        {
            Description: "Move this window's right edge.",
            Icon: ArrowRightRegular,
            Label: "Resize Right"
        },
        [ OverlayCommandId.ResizeWindowUp ]:
        {
            Description: "Move this window's top edge.",
            Icon: ArrowUpRegular,
            Label: "Resize Up"
        },
        [ OverlayCommandId.SelectInsertWindowDown ]:
        {
            Description: "Select the next floating window.",
            Icon: AppGenericRegular,
            Label: "Select Next Window"
        },
        [ OverlayCommandId.SelectInsertWindowUp ]:
        {
            Description: "Select the previous floating window.",
            Icon: AppGenericRegular,
            Label: "Select Previous Window"
        },
        [ OverlayCommandId.Tile ]:
        {
            Description: () => "Add this window to the tiled layout.",
            Icon: GridRegular,
            Label: "Tile"
        },
        [ OverlayCommandId.TileAll ]:
        {
            Description: "Add every floating window to its monitor's tiled layout.",
            Icon: GridRegular,
            Label: "Tile All"
        },
        [ OverlayCommandId.ToggleTiledResizeBehavior ]:
        {
            Description: "Change how surrounding tiled windows are resized.",
            Icon: ResizeLargeRegular,
            Label: "Resize Behavior"
        },
        [ OverlayCommandId.OpenPerAppSettings ]:
        {
            Description: (Context: PresentationContext) => Option.match(
                Context.ApplicationName,
                {
                    onNone: () => "Configure how SorrellWm manages this application's windows",
                    onSome: (Name: string) => `Configure how SorrellWm manages ${ Name } windows`
                }
            ),
            Icon: WindowSettingsRegular,
            Label: "Per-App Settings"
        }
    } as const;

const ScreenPresentation: Record<OverlayScreenDto["Id"], ScreenPresentation> =
    {
        [ OverlayScreenId.FloatingFocus ]:
        {
            Description: "Choose a direction to move the focus selection.",
            Label: "Focus"
        },
        [ OverlayScreenId.FloatingHome ]:
        {
            Description: "Choose the type of action to perform.",
            Label: "SorrellWm"
        },
        [ OverlayScreenId.FloatingMove ]:
        {
            Description: "Choose a direction to move the window.",
            Label: "Move"
        },
        [ OverlayScreenId.FloatingResize ]:
        {
            Description: "Choose an edge to grow the window. Hold Ctrl to shrink it instead.",
            Label: "Resize"
        },
        [ OverlayScreenId.FloatingTile ]:
        {
            Description: "Add this window to the tiled layout.",
            Label: "Tile"
        },
        [ OverlayScreenId.TiledHome ]:
        {
            Description: "Choose the type of action to perform.",
            Label: "SorrellWm"
        },
        [ OverlayScreenId.TiledInsertDirection ]:
        {
            Description: "Choose the half of this window where the new window will go.",
            Label: "Insert"
        },
        [ OverlayScreenId.TiledInsertWindow ]:
        {
            Description:
                "Choose a floating window, or press Tab to create a drag target.",
            Label: "Insert"
        },
        [ OverlayScreenId.TiledFocus ]:
        {
            Description: "Choose a direction to move the focus selection.",
            Label: "Focus"
        },
        [ OverlayScreenId.TiledMove ]:
        {
            Description: "Choose where to move the tiled window.",
            Label: "Move"
        },
        [ OverlayScreenId.TiledResize ]:
        {
            Description:
                "Choose an edge to grow the tiled window. Hold Ctrl to shrink it. "
                + "Press Tab to change how surrounding windows respond.",
            Label: "Resize"
        }
    } as const;

const UseStyles = makeStyles({
    ApplicationIconImage:
    {
        height: "1.5rem",
        objectFit: "contain",
        width: "1.5rem"
    },
    BackButton:
    {
        borderRadius: tokens.borderRadiusNone,
        boxSizing: "border-box",
        height: "48px",
        minWidth: "48px",
        padding: 0,
        width: "48px"
    },
    BackButtonSlot:
    {
        flexShrink: 0,
        height: "48px",
        width: "40px"
    },
    BreadcrumbBar:
    {
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: tokens.spacingHorizontalXS,
        height: "48px",
        padding: 0
    },
    CommandList:
    {
        display: "grid",
        gap: "0.65rem",
        marginTop: "clamp(1.5rem, 5vh, 3rem)"
    },
    Content:
    {
        alignItems: "stretch",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "clamp(1.5rem, 5vw, 3rem)"
    },
    ContentWithFooter:
    {
        paddingBottom: "calc(clamp(1.5rem, 5vw, 3rem) + 48px)"
    },
    Description:
    {
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase300,
        lineHeight: tokens.lineHeightBase300,
        margin: 0,
        maxWidth: "40rem"
    },
    Error:
    {
        backgroundColor: tokens.colorPaletteRedBackground1,
        border: `1px solid ${ tokens.colorPaletteRedBorder2 }`,
        borderRadius: "0.5rem",
        color: tokens.colorPaletteRedForeground1,
        padding: "0.75rem"
    },
    FocusButtons:
    {
        display: "grid",
        gap: "0.5rem"
    },
    FocusCommandGroups:
    {
        display: "grid",
        gap: "clamp(0.75rem, 2.5vh, 1.5rem)",
        marginTop: "-0.5rem"
    },
    FocusCommandGroupsWithMonitors:
    {
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
    },
    Footer:
    {
        alignItems: "center",
        backgroundColor: "transparent",
        borderTop: `1px solid ${ tokens.colorNeutralStroke2 }`,
        bottom: 0,
        boxSizing: "border-box",
        display: "flex",
        height: "48px",
        justifyContent: "center",
        left: 0,
        padding: `0 ${ tokens.spacingHorizontalM }`,
        position: "absolute",
        width: "100%"
    },
    MonitorButtons:
    {
        display: "grid",
        gap: "0.5rem"
    },
    PadLayout:
    {
        display: "grid",
        gap: "clamp(0.75rem, 2.5vh, 1.5rem)",
        marginTop: "clamp(0.75rem, 2.5vh, 1.5rem)"
    },
    Placeholder:
    {
        alignItems: "center",
        color: tokens.colorNeutralForeground3,
        display: "flex",
        flex: "1 1 auto",
        justifyContent: "center",
        marginTop: "clamp(0.75rem, 2.5vh, 1.5rem)",
        minHeight: "8rem",
        textAlign: "center"
    },
    Shell:
    {
        backgroundColor: "transparent",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative"
    }
});

export/** Render the current primary commands in their backend-supplied order. */
const OverlayApplication = (): React.ReactNode =>
{
    const Styles = UseStyles();
    const [ CurrentScreen, SetCurrentScreen ] = useState<OverlayScreenDto | undefined>();
    const [ ErrorMessage /* , SetErrorMessage */ ] = useState<string | undefined>();
    const [ VisibleFocusFailure, SetVisibleFocusFailure ] =
        useState<OverlayFocusFailureDto | undefined>();

    useEffect(() =>
    {
        let IsMounted = true;
        const StopScreenUpdates = window.sorrell.overlay.onChanged(SetCurrentScreen);

        window.sorrell.overlay.get()
            .then((Current: OverlayScreenDto) =>
            {
                if (IsMounted)
                {
                    SetCurrentScreen(Current);
                }
            })
            .catch(Logging.ReportRejection(
                "Overlay",
                "Could not load the current overlay screen."
            ));

        return () =>
        {
            IsMounted = false;
            StopScreenUpdates();
            void window.sorrell.overlay.preview(null).catch(Logging.ReportRejection(
                "Overlay",
                "Could not clear the Focus preview while unmounting."
            ));
        };
    }, [ ]);

    useEffect(() =>
    {
        const FocusFailure = CurrentScreen?.FocusFailure;

        SetVisibleFocusFailure(FocusFailure);

        if (FocusFailure === undefined)
        {
            return;
        }

        const Timeout = window.setTimeout(
            () => SetVisibleFocusFailure(undefined),
            FocusFailureDismissalDelay
        );

        return () => window.clearTimeout(Timeout);
    }, [ CurrentScreen ]);

    const Invoke = (Id: OverlayCommandIdType): void =>
    {
        void window.sorrell.overlay.invoke(Id).catch(Logging.ReportRejection(
            "Overlay",
            "Could not invoke an overlay command."
        ));
    };

    const OpenResizeRecoveryStrategy = (): void =>
    {
        void window.sorrell.settings.open(EncodeSettingsPath({
            Params:
            {
                Highlight: "ResizeRecoveryStrategy"
            },
            Section: SettingsSectionId.General
        })).catch(Logging.ReportRejection(
            "Overlay",
            "Could not open the resize recovery setting."
        ));
    };

    const Back = (): void =>
    {
        void window.sorrell.overlay.back().catch(Logging.ReportRejection(
            "Overlay",
            "Could not navigate back from the current overlay screen."
        ));
    };

    const Preview = (Id: OverlayCommandIdType | null): void =>
    {
        void window.sorrell.overlay.preview(Id).catch(Logging.ReportRejection(
            "Overlay",
            "Could not update the Focus preview."
        ));
    };

    const CurrentPresentation = CurrentScreen === undefined
        ? ScreenPresentation[OverlayScreenId.FloatingHome]
        : ScreenPresentation[CurrentScreen.Id];

    const CanGoBack = CurrentScreen?.CanGoBack === true;
    const SecondaryCommand = CurrentScreen?.SecondaryCommand;
    const SecondaryIcon = SecondaryCommand === undefined
        ? undefined
        : Presentation[SecondaryCommand.Id].Icon;
    const DistanceToggleDto = CurrentScreen?.DistanceToggle;
    const MonitorCommands = CurrentScreen?.MonitorCommands ?? [ ];
    const HasFooter = SecondaryCommand !== undefined || DistanceToggleDto !== undefined;
    const IsTiledScreen = CurrentScreen?.Id === OverlayScreenId.TiledHome
        || CurrentScreen?.Id === OverlayScreenId.TiledFocus
        || CurrentScreen?.Id === OverlayScreenId.TiledInsertDirection
        || CurrentScreen?.Id === OverlayScreenId.TiledInsertWindow
        || CurrentScreen?.Id === OverlayScreenId.TiledMove
        || CurrentScreen?.Id === OverlayScreenId.TiledResize;
    const PresentationContextValue: PresentationContext = {
        ...DefaultPresentationContext,
        IsTiled: IsTiledScreen
    };
    const IsFocusScreen = CurrentScreen?.Id === OverlayScreenId.FloatingFocus
        || CurrentScreen?.Id === OverlayScreenId.TiledFocus;
    const IsTiledFocusScreen = CurrentScreen?.Id === OverlayScreenId.TiledFocus;
    const IsRootPanelFocused = CurrentScreen?.IsRootPanelFocused === true;
    const StackWindows = CurrentScreen?.StackWindows ?? [ ];
    const InsertWindows = CurrentScreen?.InsertWindows ?? [ ];
    const IsStackPanelFocused = IsTiledFocusScreen && StackWindows.length > 0;
    const IsTiledInsertDirectionScreen =
        CurrentScreen?.Id === OverlayScreenId.TiledInsertDirection;
    const IsTiledInsertWindowScreen =
        CurrentScreen?.Id === OverlayScreenId.TiledInsertWindow;
    const IsFloatingMoveScreen = CurrentScreen?.Id === OverlayScreenId.FloatingMove;
    const IsTiledMoveScreen = CurrentScreen?.Id === OverlayScreenId.TiledMove;
    const IsTiledMovePanelTargeted = CurrentScreen?.IsTiledMovePanelTargeted === true;
    const IsResizeScreen = CurrentScreen?.Id === OverlayScreenId.FloatingResize
        || CurrentScreen?.Id === OverlayScreenId.TiledResize;
    const IsTiledResizeScreen = CurrentScreen?.Id === OverlayScreenId.TiledResize;
    const IsTileScreen = CurrentScreen?.Id === OverlayScreenId.FloatingTile;

    const FindCommand = (Id: OverlayCommandIdType): OverlayCommandDto | undefined =>
        CurrentScreen?.Commands.find((Candidate: OverlayCommandDto) => Candidate.Id === Id);

    const GetCommand = (Id: OverlayCommandIdType): OverlayCommandDto =>
    {
        const Command = FindCommand(Id);

        if (Command === undefined)
        {
            throw new Error(`The current screen is missing the ${ Id } command.`);
        }

        return Command;
    };

    // Sampled unconditionally (even outside the Focus screen) to satisfy the
    // rules of hooks; each call no-ops when there is no target icon.
    const ToColor = (Color: SampledColor | undefined): Option.Option<string> =>
        pipe(Option.fromNullishOr(Color), Option.map(ToCssColor));
    const FocusMoveDownColor = ToColor(
        UseDominantColor(FindCommand(OverlayCommandId.FocusMoveDown)?.Target?.Icon)
    );
    const FocusMoveLeftColor = ToColor(
        UseDominantColor(FindCommand(OverlayCommandId.FocusMoveLeft)?.Target?.Icon)
    );
    const FocusMoveRightColor = ToColor(
        UseDominantColor(FindCommand(OverlayCommandId.FocusMoveRight)?.Target?.Icon)
    );
    const FocusMoveUpColor = ToColor(
        UseDominantColor(FindCommand(OverlayCommandId.FocusMoveUp)?.Target?.Icon)
    );

    const ToPadDirection = (
        Id: OverlayCommandIdType,
        Color: Option.Option<string>
    ): DirectionalPadDirection =>
    {
        const Command = GetCommand(Id);

        return {
            Color,
            Disabled: Command.Disabled,
            OnHoverChange: Command.Target === undefined
                ? undefined
                : (Hovered: boolean) => Preview(Hovered ? Command.Id : null),
            OnInvoke: () => Invoke(Command.Id),
            Shortcut: Command.Shortcut
        };
    };

    const ToPlainPadDirection = (Id: OverlayCommandIdType): DirectionalPadDirection =>
        ToPadDirection(Id, Option.none());
    const ParentFocusCommand = IsTiledFocusScreen
        ? FindCommand(OverlayCommandId.FocusMoveParent)
        : undefined;
    const HasMonitorColumn = IsRootPanelFocused && MonitorCommands.length > 0;
    const ActiveStackWindowIndex = StackWindows.findIndex(
        (WindowValue: OverlayStackWindowDto): boolean => WindowValue.Active
    );
    const ActiveInsertWindowIndex = InsertWindows.findIndex(
        (WindowValue: OverlayInsertWindowDto): boolean => WindowValue.Active
    );
    const SelectStackWindow = (TargetIndex: number): void =>
    {
        if (TargetIndex === ActiveStackWindowIndex || ActiveStackWindowIndex < 0)
        {
            return;
        }

        void window.sorrell.overlay.selectStackWindow(TargetIndex).catch(
            Logging.ReportRejection(
                "Overlay",
                "Could not select a window in the focused stack panel."
            )
        );
    };
    const SelectInsertWindow = (TargetIndex: number): void =>
    {
        if (TargetIndex === ActiveInsertWindowIndex || ActiveInsertWindowIndex < 0)
        {
            return;
        }

        const Id = TargetIndex < ActiveInsertWindowIndex
            ? OverlayCommandId.SelectInsertWindowUp
            : OverlayCommandId.SelectInsertWindowDown;
        const StepCount = Math.abs(TargetIndex - ActiveInsertWindowIndex);

        void (async (): Promise<void> =>
        {
            for (let Step = 0; Step < StepCount; Step += 1)
            {
                await window.sorrell.overlay.invoke(Id);
            }
        })().catch(Logging.ReportRejection(
            "Overlay",
            "Could not select a floating window for tiled insertion."
        ));
    };
    const TiledMoveCommands = IsTiledMoveScreen
        ? CurrentScreen.Commands.filter((Command: OverlayCommandDto): boolean =>
            IsTiledMovePanelTargeted
                ? !Command.Disabled
                : Command.Id !== OverlayCommandId.MoveWindowIntoPanel)
        : [ ];
    const TiledResizeBehaviorCommand = IsTiledResizeScreen
        ? FindCommand(OverlayCommandId.ToggleTiledResizeBehavior)
        : undefined;
    const OpenInsertTargetCommand = IsTiledInsertWindowScreen
        ? FindCommand(OverlayCommandId.OpenInsertTarget)
        : undefined;
    const OpenInsertTargetForNextWindowCommand = IsTiledInsertWindowScreen
        ? FindCommand(OverlayCommandId.OpenInsertTargetForNextWindow)
        : undefined;

    return (
        <main className={ Styles.Shell }>
            <header>
                <div className={ Styles.BreadcrumbBar }>
                    <div className={ Styles.BackButtonSlot }>
                        <Button
                            appearance="subtle"
                            aria-label="Go Back"
                            className={ Styles.BackButton }
                            disabled={ !CanGoBack }
                            icon={ <ArrowLeft16Regular /> }
                            onClick={ Back }
                            shape="square"
                            style={ CanGoBack ? { } : { pointerEvents: "none" } }
                            title="Back"
                        />
                    </div>

                    <Breadcrumb
                        aria-label="Current page"
                        size="medium">
                        <BreadcrumbItem>
                            <BreadcrumbButton
                                current={ !CanGoBack }
                                disabled={ !CanGoBack }
                                icon={ CanGoBack ? <BoardRegular /> : <BoardFilled /> }
                                onClick={ CanGoBack ? Back : undefined }>
                                { ScreenPresentation[OverlayScreenId.FloatingHome].Label }
                            </BreadcrumbButton>
                        </BreadcrumbItem>

                        { CanGoBack && (
                            <>
                                <BreadcrumbDivider />
                                <BreadcrumbItem>
                                    <BreadcrumbButton current>
                                        { CurrentPresentation.Label }
                                    </BreadcrumbButton>
                                </BreadcrumbItem>
                            </>
                        ) }
                    </Breadcrumb>
                </div>
            </header>

            <div className={ mergeClasses(
                Styles.Content,
                HasFooter ? Styles.ContentWithFooter : undefined
            ) }>
                <p className={ Styles.Description }>
                    { ResolveDescription(CurrentPresentation, PresentationContextValue) }
                </p>

                { ErrorMessage !== undefined && (
                    <p
                        className={ Styles.Error }
                        role="alert">
                        { ErrorMessage }
                    </p>
                ) }

                { CurrentScreen?.ResizeRecoveryFailure === true && (
                    <MessageBar
                        intent="warning"
                        layout="multiline">
                        <MessageBarBody>
                            <MessageBarTitle>
                                Window could not be made smaller
                            </MessageBarTitle>
                            The operation was canceled and the previous tiled layout was restored.{ " " }
                            <Link
                                href="#"
                                onClick={ (Event: React.MouseEvent<HTMLAnchorElement>) =>
                                {
                                    Event.preventDefault();
                                    OpenResizeRecoveryStrategy();
                                } }>
                                Resize Recovery Strategy
                            </Link>
                        </MessageBarBody>
                    </MessageBar>
                ) }

                { IsFocusScreen ? (
                    <div className={ Styles.PadLayout }>
                        { VisibleFocusFailure !== undefined && (
                            <MessageBar
                                intent="warning"
                                layout="multiline">
                                <MessageBarBody>
                                    <MessageBarTitle>
                                        Could not move focus
                                    </MessageBarTitle>
                                    { VisibleFocusFailure.WindowTitle } could not be focused.
                                </MessageBarBody>
                            </MessageBar>
                        ) }

                        { IsStackPanelFocused ? (
                            <div
                                aria-label="Focus command groups"
                                className={ mergeClasses(
                                    Styles.FocusCommandGroups,
                                    HasMonitorColumn
                                        ? Styles.FocusCommandGroupsWithMonitors
                                        : undefined
                                ) }
                                role="group">
                                <section
                                    aria-label="Windows in stack"
                                    className={ Styles.FocusButtons }>
                                    { StackWindows.map((
                                        StackWindow: OverlayStackWindowDto,
                                        Index: number
                                    ) => (
                                        <CompactCommandButton
                                            Active={ StackWindow.Active }
                                            Icon={ StackWindow.Target.Icon === undefined
                                                ? <AppGenericRegular />
                                                : (
                                                    <img
                                                        alt=""
                                                        className={
                                                            Styles.ApplicationIconImage
                                                        }
                                                        src={
                                                            "data:image/png;base64,"
                                                            + StackWindow.Target.Icon
                                                        } />
                                                ) }
                                            Label={ StackWindow.Target.Title }
                                            OnInvoke={ () => SelectStackWindow(Index) }
                                            { ...(Index
                                                === ActiveStackWindowIndex - 1
                                                ? {
                                                    Shortcut: GetCommand(
                                                        OverlayCommandId.FocusMoveUp
                                                    ).Shortcut
                                                }
                                                : Index
                                                    === ActiveStackWindowIndex + 1
                                                    ? {
                                                        Shortcut: GetCommand(
                                                            OverlayCommandId.FocusMoveDown
                                                        ).Shortcut
                                                    }
                                                    : { }) }
                                            key={ `${ StackWindow.Target.Title }-${ Index }` }
                                        />
                                    )) }

                                    { ParentFocusCommand !== undefined && (
                                        <CompactCommandButton
                                            Active={ false }
                                            Disabled={ ParentFocusCommand.Disabled }
                                            Icon={ <ArrowUpRegular /> }
                                            Label={ ParentFocusCommand.Target?.Title
                                                ?? Presentation[ParentFocusCommand.Id].Label }
                                            OnInvoke={ () => Invoke(ParentFocusCommand.Id) }
                                            Shortcut={ ParentFocusCommand.Shortcut }
                                        />
                                    ) }
                                </section>

                                { HasMonitorColumn && (
                                    <section
                                        aria-label="Monitors"
                                        className={ Styles.MonitorButtons }>
                                        { MonitorCommands.map((
                                            Command: OverlayCommandDto
                                        ) => (
                                            <CompactCommandButton
                                                Active={ false }
                                                Disabled={ Command.Disabled }
                                                Icon={ <DesktopRegular /> }
                                                Label={ Command.Target?.Title
                                                    ?? Presentation[Command.Id].Label }
                                                OnInvoke={ () => Invoke(Command.Id) }
                                                Shortcut={ Command.Shortcut }
                                                key={ Command.Id }
                                            />
                                        )) }
                                    </section>
                                ) }
                            </div>
                        ) : (
                            <>
                                <DirectionalPad
                                    Down={ ToPadDirection(
                                        OverlayCommandId.FocusMoveDown,
                                        FocusMoveDownColor
                                    ) }
                                    Left={ ToPadDirection(
                                        OverlayCommandId.FocusMoveLeft,
                                        FocusMoveLeftColor
                                    ) }
                                    Right={ ToPadDirection(
                                        OverlayCommandId.FocusMoveRight,
                                        FocusMoveRightColor
                                    ) }
                                    Up={ ToPadDirection(
                                        OverlayCommandId.FocusMoveUp,
                                        FocusMoveUpColor
                                    ) }
                                />

                                <div
                                    aria-label="Focus command groups"
                                    className={ mergeClasses(
                                        Styles.FocusCommandGroups,
                                        HasMonitorColumn
                                            ? Styles.FocusCommandGroupsWithMonitors
                                            : undefined
                                    ) }
                                    role="group">
                                    <section
                                        aria-label="Focus targets"
                                        className={ Styles.FocusButtons }>
                                        { [
                                            OverlayCommandId.FocusMoveUp,
                                            OverlayCommandId.FocusMoveDown,
                                            OverlayCommandId.FocusMoveLeft,
                                            OverlayCommandId.FocusMoveRight
                                        ].map((Id: OverlayCommandIdType) =>
                                        {
                                            const Command = GetCommand(Id);
                                            const DirectionIcon =
                                                Presentation[Command.Id].Icon;

                                            return IsRootPanelFocused ? (
                                                <CompactCommandButton
                                                    Active={ false }
                                                    Disabled={ Command.Disabled }
                                                    Icon={ <DirectionIcon /> }
                                                    Label={ Command.Target?.Title
                                                        ?? Presentation[Command.Id].Label }
                                                    OnInvoke={ () => Invoke(Command.Id) }
                                                    Shortcut={ Command.Shortcut }
                                                    key={ Command.Id }
                                                />
                                            ) : (
                                                <FocusDirectionButton
                                                    Command={ Command }
                                                    Icon={ DirectionIcon }
                                                    OnHoverChange={
                                                        Command.Target === undefined
                                                            ? undefined
                                                            : (Hovered: boolean) => Preview(
                                                                Hovered
                                                                    ? Command.Id
                                                                    : null
                                                            )
                                                    }
                                                    OnInvoke={ () => Invoke(Command.Id) }
                                                    key={ Command.Id }
                                                />
                                            );
                                        }) }

                                        { ParentFocusCommand !== undefined && (
                                            <CompactCommandButton
                                                Active={ false }
                                                Disabled={ ParentFocusCommand.Disabled }
                                                Icon={ <ArrowUpRegular /> }
                                                Label={ ParentFocusCommand.Target?.Title
                                                    ?? Presentation[
                                                        ParentFocusCommand.Id
                                                    ].Label }
                                                OnInvoke={
                                                    () => Invoke(ParentFocusCommand.Id)
                                                }
                                                Shortcut={ ParentFocusCommand.Shortcut }
                                            />
                                        ) }
                                    </section>

                                    { HasMonitorColumn && (
                                        <section
                                            aria-label="Monitors"
                                            className={ Styles.MonitorButtons }>
                                            { MonitorCommands.map((
                                                Command: OverlayCommandDto
                                            ) => (
                                                <CompactCommandButton
                                                    Active={ false }
                                                    Disabled={ Command.Disabled }
                                                    Icon={ <DesktopRegular /> }
                                                    Label={ Command.Target?.Title
                                                        ?? Presentation[Command.Id].Label }
                                                    OnInvoke={
                                                        () => Invoke(Command.Id)
                                                    }
                                                    Shortcut={ Command.Shortcut }
                                                    key={ Command.Id }
                                                />
                                            )) }
                                        </section>
                                    ) }
                                </div>
                            </>
                        ) }
                    </div>
                ) : IsTiledInsertDirectionScreen ? (
                    <div className={ Styles.PadLayout }>
                        <DirectionalPad
                            Down={ ToPlainPadDirection(
                                OverlayCommandId.ChooseInsertDown
                            ) }
                            Left={ ToPlainPadDirection(
                                OverlayCommandId.ChooseInsertLeft
                            ) }
                            Right={ ToPlainPadDirection(
                                OverlayCommandId.ChooseInsertRight
                            ) }
                            Up={ ToPlainPadDirection(
                                OverlayCommandId.ChooseInsertUp
                            ) } />
                    </div>
                ) : IsTiledInsertWindowScreen ? (
                    <div className={ Styles.PadLayout }>
                        { InsertWindows.length === 0 ? (
                            <p className={ Styles.Placeholder }>
                                No floating windows are currently available.
                            </p>
                        ) : (
                            <section
                                aria-label="Floating windows"
                                className={ Styles.FocusButtons }>
                                { InsertWindows.map((
                                    InsertWindow: OverlayInsertWindowDto,
                                    Index: number
                                ) => (
                                    <CompactCommandButton
                                        Active={ InsertWindow.Active }
                                        Icon={ InsertWindow.Target.Icon === undefined
                                            ? <AppGenericRegular />
                                            : (
                                                <img
                                                    alt=""
                                                    className={
                                                        Styles.ApplicationIconImage
                                                    }
                                                    src={
                                                        "data:image/png;base64,"
                                                        + InsertWindow.Target.Icon
                                                    } />
                                            ) }
                                        Label={ InsertWindow.Target.Title }
                                        OnInvoke={ () => SelectInsertWindow(Index) }
                                        { ...(InsertWindow.Active
                                            ? {
                                                Shortcut: GetCommand(
                                                    OverlayCommandId.CommitInsertWindow
                                                ).Shortcut
                                            }
                                            : Index === ActiveInsertWindowIndex - 1
                                                ? {
                                                    Shortcut: GetCommand(
                                                        OverlayCommandId
                                                            .SelectInsertWindowUp
                                                    ).Shortcut
                                                }
                                                : Index === ActiveInsertWindowIndex + 1
                                                    ? {
                                                        Shortcut: GetCommand(
                                                            OverlayCommandId
                                                                .SelectInsertWindowDown
                                                        ).Shortcut
                                                    }
                                                    : { }) }
                                        key={ `${ InsertWindow.Target.Title }-${ Index }` }
                                    />
                                )) }
                            </section>
                        ) }

                        <section
                            aria-label="Other Insert methods"
                            className={ Styles.FocusButtons }>
                            { OpenInsertTargetCommand !== undefined && (
                                <CompactCommandButton
                                    Active={ false }
                                    Disabled={ OpenInsertTargetCommand.Disabled }
                                    Icon={ <CursorClickRegular /> }
                                    Label="Drag a window here"
                                    OnInvoke={ () => Invoke(
                                        OpenInsertTargetCommand.Id
                                    ) }
                                    Shortcut={ OpenInsertTargetCommand.Shortcut }
                                />
                            ) }
                            { OpenInsertTargetForNextWindowCommand !== undefined && (
                                <CompactCommandButton
                                    Active={ false }
                                    Disabled={
                                        OpenInsertTargetForNextWindowCommand.Disabled
                                    }
                                    Icon={ <AddSquareRegular /> }
                                    Label="Tile the next window here"
                                    OnInvoke={ () => Invoke(
                                        OpenInsertTargetForNextWindowCommand.Id
                                    ) }
                                    Shortcut={
                                        OpenInsertTargetForNextWindowCommand.Shortcut
                                    }
                                />
                            ) }
                        </section>
                    </div>
                ) : IsTiledMoveScreen ? (
                    <div className={ Styles.PadLayout }>
                        { IsTiledMovePanelTargeted && (
                            <MessageBar
                                intent="info"
                                layout="multiline">
                                <MessageBarBody>
                                    <MessageBarTitle>
                                        Move into the highlighted panel
                                    </MessageBarTitle>
                                    Move away from the panel, or commit to insert the
                                    window as its first child.
                                </MessageBarBody>
                            </MessageBar>
                        ) }

                        <DirectionalPad
                            Down={ ToPlainPadDirection(OverlayCommandId.MoveWindowDown) }
                            Left={ ToPlainPadDirection(OverlayCommandId.MoveWindowLeft) }
                            Right={ ToPlainPadDirection(OverlayCommandId.MoveWindowRight) }
                            Up={ ToPlainPadDirection(OverlayCommandId.MoveWindowUp) } />

                        <section
                            aria-label="Move targets"
                            className={ Styles.FocusButtons }>
                            { TiledMoveCommands.map((Command: OverlayCommandDto) =>
                            {
                                const Icon = Presentation[Command.Id].Icon;

                                return (
                                    <CompactCommandButton
                                        Active={ false }
                                        Disabled={ Command.Disabled }
                                        Icon={ <Icon /> }
                                        Label={ Presentation[Command.Id].Label }
                                        OnInvoke={ () => Invoke(Command.Id) }
                                        Shortcut={ Command.Shortcut }
                                        key={ Command.Id }
                                    />
                                );
                            }) }
                        </section>
                    </div>
                ) : IsFloatingMoveScreen ? (
                    <div className={ Styles.PadLayout }>
                        <DirectionalPad
                            Down={ ToPlainPadDirection(OverlayCommandId.MoveWindowDown) }
                            Left={ ToPlainPadDirection(OverlayCommandId.MoveWindowLeft) }
                            Right={ ToPlainPadDirection(OverlayCommandId.MoveWindowRight) }
                            Up={ ToPlainPadDirection(OverlayCommandId.MoveWindowUp) } />
                    </div>
                ) : IsResizeScreen ? (
                    <div className={ Styles.PadLayout }>
                        <DirectionalPad
                            Down={ ToPlainPadDirection(OverlayCommandId.ResizeWindowDown) }
                            Invert={ CurrentScreen?.ResizeMode === "Shrink" }
                            Left={ ToPlainPadDirection(OverlayCommandId.ResizeWindowLeft) }
                            Right={ ToPlainPadDirection(OverlayCommandId.ResizeWindowRight) }
                            Up={ ToPlainPadDirection(OverlayCommandId.ResizeWindowUp) } />

                        { TiledResizeBehaviorCommand !== undefined && (
                            <section
                                aria-label="Tiled resize behavior"
                                className={ Styles.FocusButtons }>
                                <CompactCommandButton
                                    Active={
                                        CurrentScreen?.TiledResizeBehavior
                                            === "AdjacentOnly"
                                    }
                                    Disabled={ TiledResizeBehaviorCommand.Disabled }
                                    Icon={ <ResizeLargeRegular /> }
                                    Label={
                                        CurrentScreen?.TiledResizeBehavior
                                            === "AdjacentOnly"
                                            ? "Resize adjacent window only"
                                            : "Preserve other window ratios"
                                    }
                                    OnInvoke={
                                        () => Invoke(TiledResizeBehaviorCommand.Id)
                                    }
                                    Shortcut={ TiledResizeBehaviorCommand.Shortcut }
                                />
                            </section>
                        ) }
                    </div>
                ) : IsTileScreen ? (
                    <p className={ Styles.Placeholder }>
                        Tiling isn&apos;t implemented yet.
                    </p>
                ) : (
                    <section
                        aria-label="Available commands"
                        className={ Styles.CommandList }>
                        { (CurrentScreen?.Commands ?? [ ]).map((Command: OverlayCommandDto) =>
                        {
                            const CommandPresentation = Presentation[Command.Id];
                            const Icon = CommandPresentation.Icon;
                            if (!Predicate.hasProperty(CommandPresentation, "Description"))
                            {
                                throw new Error(
                                    `Command ${ Command.Id } corresponds to a Presentation with no ` +
                                    "Description, but it should have one."
                                );
                            }
                            const Description = Command.Target?.Title
                                ?? (Command.Disabled
                                    ? undefined
                                    : ResolveDescription(
                                        CommandPresentation,
                                        {
                                            ...PresentationContextValue,
                                            WindowTitle: Option.fromNullishOr(Command.Target?.Title)
                                        })
                                );
                            const ApplicationIcon = Command.Target === undefined
                                ? undefined
                                : Command.Target.Icon === undefined
                                    ? <AppGenericRegular />
                                    : (
                                        <img
                                            alt=""
                                            className={ Styles.ApplicationIconImage }
                                            src={ `data:image/png;base64,${ Command.Target.Icon }` } />
                                    );

                            return (
                                <CommandButton
                                    Active={ false }
                                    Icon={ <Icon /> }
                                    Label={ CommandPresentation.Label }
                                    OnHoverChange={ Command.Target === undefined
                                        ? undefined
                                        : (Hovered: boolean) => Preview(
                                            Hovered ? Command.Id : null
                                        ) }
                                    OnInvoke={ () => Invoke(Command.Id) }
                                    key={ Command.Id }
                                    { ...Struct.pick(Command, [ "Disabled", "Shortcut" ]) }
                                    { ...{ ApplicationIcon, Description } }
                                />
                            );
                        }) }
                    </section>
                ) }
                { SecondaryCommand !== undefined && SecondaryIcon !== undefined && (
                    <footer
                        aria-label="Secondary command"
                        className={ Styles.Footer }>
                        <CompactCommandButton
                            Active={ false }
                            Disabled={ SecondaryCommand.Disabled }
                            Icon={ <SecondaryIcon /> }
                            Label={ ResolveDescription(Presentation[SecondaryCommand.Id], {
                                ...PresentationContextValue,
                                ApplicationName: Option.fromNullishOr(SecondaryCommand.ApplicationName)
                            }) }
                            OnInvoke={ () => Invoke(SecondaryCommand.Id) }
                            Shortcut={ SecondaryCommand.Shortcut }
                            key={ SecondaryCommand.Id }
                        />
                    </footer>
                ) }
                { DistanceToggleDto !== undefined && (
                    <footer
                        aria-label="Move distance"
                        className={ Styles.Footer }>
                        <DistanceToggle { ...DistanceToggleDto } />
                    </footer>
                ) }
            </div>
        </main>
    );
};
