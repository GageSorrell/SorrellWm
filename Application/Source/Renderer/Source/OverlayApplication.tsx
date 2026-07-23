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
    ResizeLargeRegular
} from "@fluentui/react-icons";
import {
    Breadcrumb,
    BreadcrumbButton,
    BreadcrumbDivider,
    BreadcrumbItem,
    Button,
    makeStyles,
    shorthands,
    tokens
} from "@fluentui/react-components";
import {
    type OverlayCommandDto,
    OverlayCommandId,
    type OverlayCommandId as OverlayCommandIdType,
    type OverlayScreenDto,
    OverlayScreenId
} from "../../Shared/OverlayCommand.js";
import { useEffect, useState } from "react";
import { CommandButton } from "./CommandButton.js";

interface CommandPresentation
{
    readonly Description: string;
    readonly Icon: FluentIcon;
    readonly Label: string;
}

interface ScreenPresentation
{
    readonly Description: string;
    readonly Label: string;
}

const Presentation: Record<OverlayCommandIdType, CommandPresentation> =
    {
        [ OverlayCommandId.Focus ]: {
            Description: "Choose a window to focus.",
            Icon: CursorClickRegular,
            Label: "Focus"
        },
        [ OverlayCommandId.FocusMoveDown ]: {
            Description: "Move the focus selection down.",
            Icon: ArrowDownRegular,
            Label: "Move Down"
        },
        [ OverlayCommandId.FocusMoveLeft ]: {
            Description: "Move the focus selection left.",
            Icon: ArrowLeftRegular,
            Label: "Move Left"
        },
        [ OverlayCommandId.FocusMoveRight ]: {
            Description: "Move the focus selection right.",
            Icon: ArrowRightRegular,
            Label: "Move Right"
        },
        [ OverlayCommandId.FocusMoveUp ]: {
            Description: "Move the focus selection up.",
            Icon: ArrowUpRegular,
            Label: "Move Up"
        },
        [ OverlayCommandId.Insert ]: {
            Description: "Insert a window into the layout.",
            Icon: AddSquareRegular,
            Label: "Insert"
        },
        [ OverlayCommandId.Move ]: {
            Description: "Move a window within the layout.",
            Icon: ArrowMoveRegular,
            Label: "Move"
        },
        [ OverlayCommandId.Resize ]: {
            Description: "Resize a window in the layout.",
            Icon: ResizeLargeRegular,
            Label: "Resize"
        }
    };

const ScreenPresentation: Record<OverlayScreenDto["Id"], ScreenPresentation> = {
    [ OverlayScreenId.Focus ]: {
        Description: "Choose a direction to move the focus selection.",
        Label: "Focus"
    },
    [ OverlayScreenId.Home ]:
    {
        Description: "Choose how to manage your windows.",
        Label: "SorrellWm"
    }
};

const UseStyles = makeStyles({
    BackButton: {
        borderRadius: tokens.borderRadiusNone,
        boxSizing: "border-box",
        height: "48px",
        minWidth: "48px",
        padding: 0,
        width: "48px"
    },
    BackButtonSlot: {
        // alignSelf: "flex-start",
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
    CommandList: {
        display: "grid",
        marginTop: "clamp(1.5rem, 5vh, 3rem)",
        ...shorthands.gap("0.65rem")
    },
    Content: {
        ...shorthands.padding("clamp(1.5rem, 5vw, 3rem)")
    },
    Description: {
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase300,
        lineHeight: tokens.lineHeightBase300,
        maxWidth: "40rem",
        ...shorthands.margin(0)
    },
    Error: {
        backgroundColor: tokens.colorPaletteRedBackground1,
        borderRadius: "0.5rem",
        color: tokens.colorPaletteRedForeground1,
        ...shorthands.border("1px", "solid", tokens.colorPaletteRedBorder2),
        ...shorthands.padding("0.75rem")
    },
    Shell: {
        backgroundColor: "transparent",
        minHeight: "100vh",
        overflow: "hidden"
    }
});

export/** Render the current primary commands in their backend-supplied order. */
const OverlayApplication = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ CurrentScreen, SetCurrentScreen ] = useState<OverlayScreenDto | undefined>();
    const [ ErrorMessage, SetErrorMessage ] = useState<string | undefined>();

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
        }).catch((Cause: unknown) =>
        {
            if (IsMounted)
            {
                SetErrorMessage(`Could not load commands: ${ String(Cause) }`);
            }
        });

        return (): void =>
        {
            IsMounted = false;
            StopScreenUpdates();
        };
    }, [ ]);

    const Invoke = (Id: OverlayCommandIdType): void =>
    {
        void window.sorrell.overlay.invoke(Id).catch((Cause: unknown) =>
        {
            SetErrorMessage(`Could not invoke ${ Id }: ${ String(Cause) }`);
        });
    };

    const Back = (): void =>
    {
        void window.sorrell.overlay.back().catch((Cause: unknown) =>
        {
            SetErrorMessage(`Could not return to the previous screen: ${ String(Cause) }`);
        });
    };

    const CurrentPresentation = CurrentScreen === undefined
        ? ScreenPresentation[OverlayScreenId.Home]
        : ScreenPresentation[CurrentScreen.Id];
    const CanGoBack = CurrentScreen?.CanGoBack === true;

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

            <div className={ Styles.Content }>
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

                        return (
                            <CommandButton
                                Active={ false }
                                Description={ CommandPresentation.Description }
                                Icon={ <Icon /> }
                                Label={ CommandPresentation.Label }
                                OnInvoke={ () => Invoke(Command.Id) }
                                Shortcut={ Command.Shortcut }
                                key={ Command.Id } />
                        );
                    }) }
                </section>
            </div>
        </main>
    );
};
