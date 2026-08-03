/**
 * Contextual, mouse-driven tooltips and application-wide Help Mode.
 *
 * @module @sorrell/ink-ui/Help
 *
 * @file      Help.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Box, type BoxProps, type CornerShapeValue } from "../Box/index.js";
import {
    type BoxMouseEvent,
    BoxMouseRegion,
    GetBoxMouseBounds
} from "../Box/Mouse.js";
import {
    ChooseTooltipPlacement,
    type TooltipBounds,
    type TooltipPlacement,
    type TooltipPosition,
    type TooltipScreen
} from "./Layout.js";
import {
    useCommand,
    useRoutedInput,
    useShortcut
} from "../Interaction/index.js";
import { Icon } from "../Icon/index.js";
import { useTheme } from "../Theme.js";

const ToggleHelpModeCommand = "@sorrell/ink-ui/Help/ToggleHelpMode" as const;
const DefaultDelay = 500 as const;
const DefaultBorderRadius = "0.35em" as const;
const DefaultCornerShape: CornerShapeValue = "round" as const;
const QuestionSvg =
    [
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\" ",
        "fill=\"COLOR\" viewBox=\"0 0 256 256\"><path d=\"",
        "M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4",
        "a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8",
        "a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Z",
        "m104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88",
        "A88.1,88.1,0,0,0,216,128Z\"/></svg>"
    ].join("");

interface TooltipRegistration
{
    readonly Content: React.ReactNode;
    readonly Id: string;
    readonly Position: TooltipPosition;
    readonly Target: React.RefObject<Ink.DOMElement | null>;
}

/** Public state and controls exposed by {@link useHelp}. */
export interface HelpContextValue
{
    readonly enterHelpMode: () => void;
    readonly exitHelpMode: () => void;
    readonly helpMode: boolean;
    readonly icon: React.ReactNode;
    readonly toggleHelpMode: () => void;
}

interface InternalHelpContextValue extends HelpContextValue
{
    readonly borderRadius: number | string;
    readonly cornerShape: CornerShapeValue;
    readonly delay: number;
    readonly focusedId: string | undefined;
    readonly hideMouseTooltip: (Id: string) => void;
    readonly register: (Registration: TooltipRegistration) => () => void;
    readonly showMouseTooltip: (Id: string) => void;
}

const HelpContext = React.createContext<InternalHelpContextValue | undefined>(undefined);

/** {@inheritDoc HelpProvider} */
export interface HelpProviderProps extends React.PropsWithChildren
{
    /** Compact-border radius used for tooltip surfaces and Help Mode targets. */
    readonly borderRadius?: number | string;
    /** CSS `<corner-shape-value>` used by compact help borders. */
    readonly cornerShape?: CornerShapeValue;
    /** Hover delay in milliseconds. */
    readonly delay?: number;
    /** Icon shown before tooltip content. Defaults to Phosphor's Question icon. */
    readonly icon?: React.ReactNode;
}

/** {@inheritDoc Tooltip} */
export interface TooltipProps
{
    readonly children: React.ReactElement;
    readonly content: React.ReactNode;
    readonly position?: TooltipPosition;
}

/**
 * Coordinates contextual help, mouse tooltip delays, and keyboard Help Mode.
 *
 * Place this provider below `InteractionProvider`; mouse tooltips additionally
 * require a `MouseProvider` ancestor.
 */
export function HelpProvider({
    borderRadius = DefaultBorderRadius,
    children,
    cornerShape = DefaultCornerShape,
    delay = DefaultDelay,
    icon
}: HelpProviderProps): React.ReactNode
{
    const Theme = useTheme();
    const { stdout } = Ink.useStdout();
    const Registrations = React.useRef(new Map<string, TooltipRegistration>());
    const [ Version, SetVersion ] = React.useState(0);
    const [ HelpMode, SetHelpMode ] = React.useState(false);
    const [ FocusedId, SetFocusedId ] = React.useState<string>();
    const [ MouseId, SetMouseId ] = React.useState<string>();
    const ResolvedDelay: number = Number.isFinite(delay) ? Math.max(0, delay) : DefaultDelay;
    const ResolvedIcon: React.ReactNode = React.useMemo(
        () => icon ?? <DefaultQuestionIcon Color={ Theme.Info } />,
        [ icon, Theme.Info ]
    );

    const GetVisibleIds = React.useCallback((): ReadonlyArray<string> =>
    {
        const Result: Array<string> = [ ];
        for (const [ Id, Registration ] of Registrations.current)
        {
            if (IsVisible(Registration.Target.current, stdout.columns, stdout.rows))
            {
                Result.push(Id);
            }
        }
        return Result;
    }, [ stdout ]);

    const EnterHelpMode = React.useCallback((): void =>
    {
        const Visible: ReadonlyArray<string> = GetVisibleIds();
        if (Visible.length === 0)
        {
            return;
        }
        SetMouseId(undefined);
        SetFocusedId((Current: string | undefined) =>
            Current !== undefined && Visible.includes(Current) ? Current : Visible[0]
        );
        SetHelpMode(true);
    }, [ GetVisibleIds ]);

    const ExitHelpMode = React.useCallback((): void =>
    {
        SetHelpMode(false);
        SetFocusedId(undefined);
    }, [ ]);

    const ToggleHelpMode = React.useCallback((): void =>
    {
        if (HelpMode)
        {
            ExitHelpMode();
        }
        else {EnterHelpMode();}
    }, [ EnterHelpMode, ExitHelpMode, HelpMode ]);

    const MoveFocus = React.useCallback((Offset: number): void =>
    {
        const Visible: ReadonlyArray<string> = GetVisibleIds();
        if (Visible.length === 0)
        {
            ExitHelpMode();
            return;
        }
        SetFocusedId((Current: string | undefined) =>
        {
            const CurrentIndex: number = Current === undefined ? -1 : Visible.indexOf(Current);
            const Base: number = CurrentIndex < 0 ? 0 : CurrentIndex;
            return Visible[(Base + Offset + Visible.length) % Visible.length];
        });
    }, [ ExitHelpMode, GetVisibleIds ]);

    const Register = React.useCallback((Registration: TooltipRegistration): (() => void) =>
    {
        Registrations.current.set(Registration.Id, Registration);
        SetVersion((Current: number) => Current + 1);
        return () =>
        {
            Registrations.current.delete(Registration.Id);
            SetMouseId((Current: string | undefined) =>
                Current === Registration.Id ? undefined : Current
            );
            SetFocusedId((Current: string | undefined) =>
                Current === Registration.Id ? undefined : Current
            );
            SetVersion((Current: number) => Current + 1);
        };
    }, [ ]);

    useCommand(ToggleHelpModeCommand, () =>
    {
        ToggleHelpMode();
        return true;
    }, { Enabled: Registrations.current.size > 0 });
    useShortcut("?", ToggleHelpModeCommand, {
        Description: "Show contextual help",
        Enabled: Registrations.current.size > 0,
        Label: HelpMode ? "Exit help" : "Help",
        Priority: 1_000
    });
    useRoutedInput((_Input: string, Key: Ink.Key): boolean =>
    {
        if (Key.escape)
        {
            ExitHelpMode();
            return true;
        }
        if (Key.tab || Key.rightArrow || Key.downArrow)
        {
            MoveFocus(Key.tab && Key.shift ? -1 : 1);
            return true;
        }
        if (Key.leftArrow || Key.upArrow)
        {
            MoveFocus(-1);
            return true;
        }
        return false;
    }, { Active: HelpMode, Priority: 1_000 });

    React.useLayoutEffect(() =>
    {
        if (!HelpMode)
        {
            return;
        }
        const Visible: ReadonlyArray<string> = GetVisibleIds();
        if (Visible.length === 0)
        {
            ExitHelpMode();
        }
        else if (FocusedId === undefined || !Visible.includes(FocusedId))
        {
            SetFocusedId(Visible[0]);
        }
    }, [ ExitHelpMode, FocusedId, GetVisibleIds, HelpMode, Version ]);

    const ActiveId: string | undefined = HelpMode ? FocusedId : MouseId;
    const Active: TooltipRegistration | undefined = ActiveId === undefined
        ? undefined
        : Registrations.current.get(ActiveId);
    const Context = React.useMemo<InternalHelpContextValue>(() => ({
        borderRadius,
        cornerShape,
        delay: ResolvedDelay,
        enterHelpMode: EnterHelpMode,
        exitHelpMode: ExitHelpMode,
        focusedId: FocusedId,
        helpMode: HelpMode,
        hideMouseTooltip: (Id: string) => SetMouseId((Current: string | undefined) =>
            Current === Id ? undefined : Current
        ),
        icon: ResolvedIcon,
        register: Register,
        showMouseTooltip: (Id: string) =>
        {
            if (!HelpMode)
            {
                SetMouseId(Id);
            }
        },
        toggleHelpMode: ToggleHelpMode
    }), [
        borderRadius,
        cornerShape,
        EnterHelpMode,
        ExitHelpMode,
        FocusedId,
        HelpMode,
        Register,
        ResolvedDelay,
        ResolvedIcon,
        ToggleHelpMode
    ]);

    return (
        <HelpContext.Provider value={ Context }>
            { children }
            { Active === undefined
                ? null
                : <TooltipSurface
                    Registration={ Active }
                    borderRadius={ borderRadius }
                    cornerShape={ cornerShape }
                    icon={ ResolvedIcon } /> }
        </HelpContext.Provider>
    );
}

export/**
       * Read Help Mode state and controls from the nearest provider.
       *
       * @throws {Error} When there is no HelpProvider ancestor.
       *
       * @category Hook
       * @since 1.0.0
       */
const useHelp = (): HelpContextValue =>
{
    const Context = React.useContext(HelpContext);
    if (Context === undefined)
    {
        throw new Error("useHelp must be used inside a HelpProvider.");
    }
    return Context;
};

export/**
       * Attach contextual help to exactly one child.
       *
       * @category Component
       * @since 1.0.0
       */
const Tooltip = ({
    children,
    content,
    position = "bottom"
}: TooltipProps): React.ReactElement =>
{
    const Context = React.useContext(HelpContext);
    if (Context === undefined)
    {
        throw new Error("Tooltip must be used inside a HelpProvider.");
    }
    const Theme = useTheme();
    const { register } = Context;
    const Id = React.useId();
    const Target = React.useRef<Ink.DOMElement>(null);
    const DelayTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const Registration = React.useMemo<TooltipRegistration>(() => ({
        Content: content,
        Id,
        Position: position,
        Target
    }), [ Id, content, position ]);

    React.useLayoutEffect(
        () => register(Registration),
        [ register, Registration ]
    );
    React.useEffect(() => () =>
    {
        if (DelayTimer.current !== undefined)
        {
            clearTimeout(DelayTimer.current);
        }
    }, [ ]);

    const OnMouseEnter = React.useCallback((_Event: BoxMouseEvent): void =>
    {
        if (DelayTimer.current !== undefined)
        {
            clearTimeout(DelayTimer.current);
        }
        DelayTimer.current = setTimeout(() => Context.showMouseTooltip(Id), Context.delay);
    }, [ Context, Id ]);
    const OnMouseLeave = React.useCallback((_Event: BoxMouseEvent): void =>
    {
        if (DelayTimer.current !== undefined)
        {
            clearTimeout(DelayTimer.current);
        }
        DelayTimer.current = undefined;
        Context.hideMouseTooltip(Id);
    }, [ Context, Id ]);
    const Focused: boolean = Context.helpMode && Context.focusedId === Id;

    if (Context.helpMode)
    {
        return (
            <Box
                borderColor={ Focused ? Theme.BorderActive : Theme.Border }
                borderRadius={ Context.borderRadius }
                borderStyle="compact"
                cornerShape={ Context.cornerShape }
                onMouseEnter={ OnMouseEnter }
                onMouseLeave={ OnMouseLeave }
                ref={ Target }>
                { children }
            </Box>
        );
    }

    if (children.type === Box)
    {
        const Props = children.props as BoxProps;
        return React.cloneElement(children as React.ReactElement<
            BoxProps & React.RefAttributes<Ink.DOMElement>
        >, {
            onMouseEnter: ChainMouseHandlers(Props.onMouseEnter, OnMouseEnter),
            onMouseLeave: ChainMouseHandlers(Props.onMouseLeave, OnMouseLeave),
            ref: MergeReferences(GetElementReference(children), Target)
        });
    }

    if (children.type === Ink.Box)
    {
        const Child = React.cloneElement(children, {
            ref: MergeReferences(GetElementReference(children), Target)
        } as React.Attributes);
        return (
            <>
                { Child }
                <BoxMouseRegion
                    TargetReference={ Target }
                    onMouseEnter={ OnMouseEnter }
                    onMouseLeave={ OnMouseLeave } />
            </>
        );
    }

    return (
        <Box
            onMouseEnter={ OnMouseEnter }
            onMouseLeave={ OnMouseLeave }
            ref={ Target }>
            { children }
        </Box>
    );
};

/** {@inheritDoc TooltipSurface} */
interface TooltipSurfaceProps
{
    readonly borderRadius: number | string;
    readonly cornerShape: CornerShapeValue;
    readonly icon: React.ReactNode;
    readonly Registration: TooltipRegistration;
}

/**
 * The "card" on which tooltip content exists.
 *
 * @category Component
 * @since 1.0.0
 */
const TooltipSurface = ({
    borderRadius,
    cornerShape,
    icon,
    Registration
}: TooltipSurfaceProps): React.ReactElement =>
{
    const Theme = useTheme();
    const { stdout } = Ink.useStdout();
    const Surface = React.useRef<Ink.DOMElement>(null);
    const [ Placement, SetPlacement ] = React.useState<TooltipPlacement>({
        FullyVisible: false,
        Left: 0,
        Position: Registration.Position,
        Top: 0,
        VisibleArea: 0
    });

    const UpdatePlacement = React.useCallback((): void =>
    {
        const TargetNode: Ink.DOMElement | null = Registration.Target.current;
        const SurfaceNode: Ink.DOMElement | null = Surface.current;
        if (TargetNode === null || SurfaceNode === null)
        {
            return;
        }

        const TargetPosition = GetAbsolutePosition(TargetNode);
        const SurfacePosition = GetAbsolutePosition(SurfaceNode);
        const TargetSize = Ink.measureElement(TargetNode);
        const SurfaceSize = Ink.measureElement(SurfaceNode);
        const RootSize = GetRootSize(TargetNode);
        const Screen: TooltipScreen = {
            Height: stdout.rows ?? RootSize.height,
            Width: stdout.columns ?? RootSize.width
        };
        const TargetBounds: TooltipBounds = {
            Height: TargetSize.height,
            Left: TargetPosition.Left,
            Top: TargetPosition.Top,
            Width: TargetSize.width
        };
        const Selected: TooltipPlacement = ChooseTooltipPlacement(
            TargetBounds,
            { Height: SurfaceSize.height, Width: SurfaceSize.width },
            Screen,
            Registration.Position
        );
        const ParentLeft: number = SurfacePosition.Left - Placement.Left;
        const ParentTop: number = SurfacePosition.Top - Placement.Top;
        const Local: TooltipPlacement = {
            ...Selected,
            Left: Selected.Left - ParentLeft,
            Top: Selected.Top - ParentTop
        };

        SetPlacement((Current: TooltipPlacement) =>
            Current.Left === Local.Left
                && Current.Top === Local.Top
                && Current.Position === Local.Position
                ? Current
                : Local
        );
    }, [ Placement.Left, Placement.Top, Registration, stdout.columns, stdout.rows ]);

    React.useLayoutEffect(UpdatePlacement, [ UpdatePlacement ]);
    React.useEffect(() =>
    {
        stdout.on("resize", UpdatePlacement);
        return () =>
        {
            stdout.off("resize", UpdatePlacement);
        };
    }, [ UpdatePlacement, stdout ]);

    const Content: React.ReactNode = typeof Registration.Content === "string"
        || typeof Registration.Content === "number"
        ? <Ink.Text color={ Theme.Text }>{ Registration.Content }</Ink.Text>
        : Registration.Content;

    return (
        <Box
            backgroundColor={ Theme.BackgroundPanel }
            borderColor={ Theme.BorderActive }
            borderRadius={ borderRadius }
            borderStyle="compact"
            cornerShape={ cornerShape }
            flexDirection="row"
            gap={ 1 }
            left={ Placement.Left }
            position="absolute"
            ref={ Surface }
            top={ Placement.Top }>
            { icon }
            { Content }
        </Box>
    );
};

const DefaultQuestionIcon = ({ Color }: { readonly Color: string }): React.ReactElement =>
{
    return <Icon
        fallback={ <Ink.Text color={ Color }>?</Ink.Text> }
        src={ QuestionSvg.replace("COLOR", Color) } />;
};

const ChainMouseHandlers = (
    First: ((Event: BoxMouseEvent) => void) | undefined,
    Second: (Event: BoxMouseEvent) => void
): (Event: BoxMouseEvent) => void =>
{
    return (Event: BoxMouseEvent): void =>
    {
        First?.(Event);
        Second(Event);
    };
};

const GetElementReference = (Element: React.ReactElement): React.Ref<Ink.DOMElement> | undefined =>
{
    return (Element.props as { readonly ref?: React.Ref<Ink.DOMElement> }).ref;
};

const MergeReferences = (
    First: React.Ref<Ink.DOMElement> | undefined,
    Second: React.RefObject<Ink.DOMElement | null>
): (Node: Ink.DOMElement | null) => void =>
{
    return (Node: Ink.DOMElement | null): void =>
    {
        SetReference(First, Node);
        Second.current = Node;
    };
};

const SetReference = (
    Reference: React.Ref<Ink.DOMElement> | undefined,
    Node: Ink.DOMElement | null
): void =>
{
    if (typeof Reference === "function")
    {
        Reference(Node);
    }
    else if (Reference !== undefined && Reference !== null)
    {
        Reference.current = Node;
    }
};

const IsVisible = (
    Node: Ink.DOMElement | null,
    TerminalWidth: number | undefined,
    TerminalHeight: number | undefined
): boolean =>
{
    if (Node === null)
    {
        return false;
    }
    return GetBoxMouseBounds(Node, TerminalWidth, TerminalHeight) !== undefined;
};

const GetAbsolutePosition = (Node: Ink.DOMElement): { readonly Left: number; readonly Top: number } =>
{
    let Current: Ink.DOMElement | undefined = Node;
    let Left = 0;
    let Top = 0;
    while (Current !== undefined)
    {
        if (Current.yogaNode !== undefined)
        {
            Left += Current.yogaNode.getComputedLeft();
            Top += Current.yogaNode.getComputedTop();
        }
        Current = Current.parentNode;
    }
    return { Left, Top };
};

const GetRootSize = (Node: Ink.DOMElement): { readonly height: number; readonly width: number; } =>
{
    let Root = Node;
    while (Root.parentNode !== undefined)
    {
        Root = Root.parentNode;
    }
    return Ink.measureElement(Root);
};
