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
    type FluentIcon,
    ResizeLargeRegular,
    WindowSettingsRegular
} from "@fluentui/react-icons";
import {
    Breadcrumb,
    BreadcrumbButton,
    BreadcrumbDivider,
    BreadcrumbItem,
    Button,
    makeStyles,
    mergeClasses,
    tokens
} from "@fluentui/react-components";
import { CommandButton, CompactCommandButton } from "./CommandButton.js";
import { type Option, Predicate, Struct } from "effect";
import {
    type OverlayCommandDto,
    OverlayCommandId,
    type OverlayCommandId as OverlayCommandIdType,
    type OverlayScreenDto,
    OverlayScreenId
} from "../Shared/OverlayCommand.js";
import { useEffect, useState } from "react";

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

const Presentation: Readonly<Record<OverlayCommandIdType, CommandPresentation>> =
    {
        [ OverlayCommandId.Focus ]:
        {
            Description: "Choose a window to focus.",
            Icon: CursorClickRegular,
            Label: "Focus"
        },
        [ OverlayCommandId.FocusMoveDown ]:
        {
            Description: "Move the focus selection down.",
            Icon: ArrowDownRegular,
            Label: "Focus Down"
        },
        [ OverlayCommandId.FocusMoveLeft ]:
        {
            Description: "Move the focus selection left.",
            Icon: ArrowLeftRegular,
            Label: "Focus Left"
        },
        [ OverlayCommandId.FocusMoveRight ]:
        {
            Description: "Move the focus selection right.",
            Icon: ArrowRightRegular,
            Label: "Focus Right"
        },
        [ OverlayCommandId.FocusMoveUp ]:
        {
            Description: "Move the focus selection up.",
            Icon: ArrowUpRegular,
            Label: "Focus Up"
        },
        [ OverlayCommandId.Insert ]:
        {
            Description: "Insert a window into the layout.",
            Icon: AddSquareRegular,
            Label: "Insert"
        },
        [ OverlayCommandId.Move ]:
        {
            Description: "Move a window within the layout.",
            Icon: ArrowMoveRegular,
            Label: "Move"
        },
        [ OverlayCommandId.Resize ]:
        {
            Description: "Resize a window in the layout.",
            Icon: ResizeLargeRegular,
            Label: "Resize"
        },
        [ OverlayCommandId.OpenPerAppSettings ]:
        {
            Icon: WindowSettingsRegular
        }
    } as const;

const ScreenPresentation: Record<OverlayScreenDto["Id"], ScreenPresentation> =
    {
        [ OverlayScreenId.Focus ]:
        {
            Description: "Choose a direction to move the focus selection.",
            Label: "Focus"
        },
        [ OverlayScreenId.Home ]:
        {
            Description: "Choose the type of action to perform.",
            Label: "SorrellWm"
        }
    };

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
        justifyContent: "space-between",
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
    Footer:
    {
        alignItems: "center",
        backgroundColor: tokens.colorNeutralBackground1,
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

    useEffect(() =>
    {
        let IsMounted = true;
        const StopScreenUpdates = window.sorrell.overlay.onChanged(SetCurrentScreen);

        void window.sorrell.overlay.get().then((Current: OverlayScreenDto) =>
        {
            if (IsMounted)
            {
                SetCurrentScreen(Current);
            }
        });
        // }).catch((Cause: unknown) =>
        // {
        //     if (IsMounted)
        //     {
        //         SetErrorMessage(`Could not load commands: ${ String(Cause) }`);
        //     }
        // });

        return (): void =>
        {
            IsMounted = false;
            StopScreenUpdates();
            void window.sorrell.overlay.preview(null);
        };
    }, [ ]);

    const Invoke = (Id: OverlayCommandIdType): void =>
    {
        void window.sorrell.overlay.invoke(Id);
        // void window.sorrell.overlay.invoke(Id).catch((Cause: unknown) =>
        // {
        //     SetErrorMessage(`Could not invoke ${ Id }: ${ String(Cause) }`);
        // });
    };

    const Back = window.sorrell.overlay.back;
    //     void window.sorrell.overlay.back().catch((Cause: unknown) =>
    //     {
    //         SetErrorMessage(`Could not return to the previous screen: ${ String(Cause) }`);
    //     });
    // };

    const Preview = (Id: OverlayCommandIdType | null): void =>
    {
        void window.sorrell.overlay.preview(Id);
        // void window.sorrell.overlay.preview(Id).catch((Cause: unknown) =>
        // {
        //     SetErrorMessage(`Could not preview ${ Id ?? "Focus" }: ${ String(Cause) }`);
        // });
    };

    const CurrentPresentation = CurrentScreen === undefined
        ? ScreenPresentation[OverlayScreenId.Home]
        : ScreenPresentation[CurrentScreen.Id];
    const CanGoBack = CurrentScreen?.CanGoBack === true;
    const SecondaryCommand = CurrentScreen?.SecondaryCommand;
    const SecondaryIcon = SecondaryCommand === undefined
        ? undefined
        : Presentation[SecondaryCommand.Id].Icon;

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
                                { ScreenPresentation[OverlayScreenId.Home].Label }
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
                SecondaryCommand === undefined ? undefined : Styles.ContentWithFooter
            ) }>
                <p className={ Styles.Description }>
                    { CurrentPresentation.Description }
                </p>

                { ErrorMessage !== undefined && (
                    <p
                        className={ Styles.Error }
                        role="alert">
                        { ErrorMessage }
                    </p>
                ) }

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
                                : CommandPresentation.Description);
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
                { SecondaryCommand !== undefined && SecondaryIcon !== undefined && (
                    <footer
                        aria-label="Secondary command"
                        className={ Styles.Footer }>
                        <CompactCommandButton
                            Active={ false }
                            Disabled={ SecondaryCommand.Disabled }
                            Icon={ <SecondaryIcon /> }
                            Label={ SecondaryCommand.Label }
                            OnInvoke={ () => Invoke(SecondaryCommand.Id) }
                            Shortcut={ SecondaryCommand.Shortcut }
                            key={ SecondaryCommand.Id }
                        />
                    </footer>
                ) }
            </div>
        </main>
    );
};
