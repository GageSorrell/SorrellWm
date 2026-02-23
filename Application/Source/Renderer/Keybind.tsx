/* File:      Keybinds.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
    type Context,
    type MutableRefObject,
    type PropsWithChildren,
    type ReactNode,
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import type { FSimpleCallback, TSimpleFunction } from "!/Utility/Functional.Types";
import { Identity } from "./Utility";

/** Shortcut. */
export interface IShortcut
{
    Hold: boolean;
    HoldDuration: number;
    Id: string;
    Keys: Array<string>;
    Method: (Props: KeyboardEvent) => unknown;
    Sequence: boolean;
    Title: string;
}

/** Shortcut binding. */
export interface IShortcutBinding
{
    [ Key: string ]: IShortcut;
}

/** Shortcut Props. */
export interface IShortcutProviderProps
{
    children?: ReactNode;
    IgnoreKeys?: Array<string>;
    IgnoreTagNames?: Array<string>;
    PreventDefault?: boolean;
    SequenceTimeout?: number;
}

/** Shortcut State. */
export type IShortcutProviderState = Array<IShortcut>;

export type FRegisterFunction = (
    Method: () => unknown,
    Keys: Array<string>,
    Title: string,
    HoldDuration?: number
) => void;

export type FRegisterSequenceFunction = (
    Method: () => unknown,
    Keys: Array<string>,
    Title: string
) => void;

/** Shortcut Render Props. */
export type IShortcutProviderRenderProps =
{
    RegisterShortcut: FRegisterFunction;
    RegisterSequenceShortcut: FRegisterSequenceFunction;
    SetEnabled: TSimpleFunction<boolean>;
    Shortcuts: IShortcutProviderState;
    TriggerShortcut: TSimpleFunction<string, unknown>;
    UnregisterShortcut: (Keys: Array<string>, Sequence: boolean) => void;
};

/** Listener Interface. */
interface ISingleShortcutListener
{
    [ Key: string ]: (Event?: KeyboardEvent) => unknown;
}

/**
 * MultiListener Interface
 * Uses an array to store multiple different shortcuts. Only applies to standard shortcuts
 */
interface IShortcutListener
{
    [ Key: string ]: Array<(Event?: KeyboardEvent) => unknown>;
}

type FKeyboardEventCallback = (Event: KeyboardEvent) => void;

/** Default tags to ignore shortcuts when focused */
const IgnoreForTagNames: Array<string> = [ "input", "textarea", "select" ];

const EmptyProps: IShortcutProviderRenderProps =
{
    RegisterSequenceShortcut: Identity,
    RegisterShortcut: Identity,
    SetEnabled: Identity,
    Shortcuts: [ ],
    TriggerShortcut: Identity,
    UnregisterShortcut: Identity
};

const ShortcutContext: Context<IShortcutProviderRenderProps> =
    createContext<IShortcutProviderRenderProps>(EmptyProps);

/**
 * Route known keys to their proper executed counterpart.
 *
 * Mappings:
 *  - opt, option = alt
 *  - control = ctrl
 *  - cmd, command = meta
 */
const transformKeys = (keys: Array<string>) =>
{
    return keys.map((RawKeys: string): string =>
    {
        const SplitKeys: Array<string> = `${ RawKeys }`.split("+");
        const TransformedKeys: Array<string> = SplitKeys.map((Key: string): string =>
        {
            const KeyEvent: string = Key.toLowerCase();
            switch (KeyEvent)
            {
                case "opt":
                case "option":
                    return "alt";
                case "control":
                    return "ctrl";
                case "cmd":
                case "command":
                    return "meta";
                default:
                    return KeyEvent;
            }
        });

        return TransformedKeys.join("+");
    });
};

type FShortcutProvider = React.MemoExoticComponent<
    ({ children, ...Props }: PropsWithChildren<IShortcutProviderProps>) => JSX.Element
>;

/* eslint-disable-next-line @stylistic/max-len */
export const ShortcutProvider: FShortcutProvider = memo(({ children, ...Props }: PropsWithChildren<IShortcutProviderProps>) =>
{
    const HoldDurations: MutableRefObject<Record<string, number>> = useRef<Record<string, number>>({ });
    const HoldInterval: MutableRefObject<number | undefined> = useRef<number>();
    const HoldListeners: MutableRefObject<ISingleShortcutListener> = useRef<ISingleShortcutListener>({ });
    const HoldTimer: MutableRefObject<number> = useRef<number>(0);
    const KeysDown: MutableRefObject<Array<string>> = useRef<Array<string>>([ ]);
    const Listeners: MutableRefObject<IShortcutListener> = useRef<IShortcutListener>({ });
    const PreviousKeys: MutableRefObject<Array<string>> = useRef<Array<string>>([ ]);
    const SequenceListeners: MutableRefObject<ISingleShortcutListener> = useRef<ISingleShortcutListener>({ });
    const SequenceTimer: MutableRefObject<number | undefined> = useRef<number | undefined>();
    const Shortcuts: MutableRefObject<IShortcutProviderState> = useRef<IShortcutProviderState>([ ]);

    const [ ShortcutsState, SetShortcutsState ] = useState<IShortcutProviderState>([ ]);
    const IsEnabled: MutableRefObject<boolean> = useRef<boolean>(true);

    /** Create an interval timer to check the duration of held keypresses. */
    const CreateTimer: ((Callback: FSimpleCallback) => void) =
        useCallback((Callback: FSimpleCallback): void =>
        {
            HoldInterval.current = window.setInterval(() =>
            {
                Callback();
                HoldTimer.current += 100;
            }, 100);
        }, [ ]);

    /** Reset the keypress timer. */
    const ResetTimer: FSimpleCallback = useCallback(() =>
    {
        if (HoldInterval.current !== undefined)
        {
            window.clearInterval(HoldInterval.current);
            HoldInterval.current = undefined;
            HoldTimer.current = 0;
        }
    }, [ ]);

    /**
     * Handle "keydown" events and run the appropriate registered method
     */
    const KeyDown: FKeyboardEventCallback = useCallback(
        (InEvent: KeyboardEvent) =>
        {
            /* Ignore events from F24 or its Windows 11 representation "⇒". */
            if (InEvent.key === "⇒" || InEvent.key?.toLowerCase() === "f20")
            {
                return;
            }

            if (!IsEnabled.current)
            {
                return;
            }

            const {
                IgnoreKeys = [ ],
                IgnoreTagNames,
                PreventDefault = true } = Props;
            const Target: HTMLElement = InEvent.target as HTMLElement;

            /* Ignore listening when certain elements are focused. */
            const Ignore: Array<string> = IgnoreTagNames
                ? IgnoreTagNames.map((Tag: string) => Tag.toLowerCase())
                : IgnoreForTagNames;

            /* The currently pressed key */
            const Key: string = InEvent.key?.toLowerCase();

            /* Ensure that we are not focused on an element, such as `<input />`. */
            const IsNotFocusedOnInputElement: boolean = (
                Key !== undefined &&
                Ignore.indexOf(Target.tagName.toLowerCase()) < 0 &&
                KeysDown.current.indexOf(Key) < 0
            );

            if (IsNotFocusedOnInputElement)
            {
                const NextKeysDown: Array<string> = [ ];
                const NextModKeys: Array<string> = [ ];

                if ((Key === "control" || InEvent.ctrlKey) && IgnoreKeys.indexOf("ctrl") < 0)
                {
                    if (KeysDown.current.indexOf("ctrl") < 0)
                    {
                        NextKeysDown.push("ctrl");
                    }
                    if (Key === "control")
                    {
                        NextModKeys.push(Key);
                    }
                }
                if ((Key === "alt" || InEvent.altKey) && IgnoreKeys.indexOf("alt") < 0)
                {
                    if (KeysDown.current.indexOf("alt") < 0)
                    {
                        NextKeysDown.push("alt");
                    }
                    if (Key === "alt")
                    {
                        NextModKeys.push(Key);
                    }
                }
                const ShouldConsiderMetaKey: boolean = (
                    (Key === "meta" || InEvent.metaKey) &&
                    IgnoreKeys.indexOf("meta") < 0 &&
                    IgnoreKeys.indexOf("cmd") < 0
                );

                if (ShouldConsiderMetaKey)
                {
                    if (KeysDown.current.indexOf("meta") < 0)
                    {
                        NextKeysDown.push("meta");
                    }
                    if (Key === "meta")
                    {
                        NextModKeys.push(Key);
                    }
                }
                if ((Key === "shift" || InEvent.shiftKey) && IgnoreKeys.indexOf("shift") < 0)
                {
                    if (KeysDown.current.indexOf("shift") < 0)
                    {
                        NextKeysDown.push("shift");
                    }
                    if (Key === "shift")
                    {
                        NextModKeys.push(Key);
                    }
                }

                if ([ ...IgnoreKeys, ...NextModKeys ].indexOf(Key) < 0)
                {
                    NextKeysDown.push(Key);
                }

                KeysDown.current = [ ...KeysDown.current, ...NextKeysDown ];

                const KeyPress: string = KeysDown.current.join("+");
                if (Listeners.current[KeyPress])
                {
                    if (PreventDefault)
                    {
                        InEvent.preventDefault();
                    }
                    /* eslint-disable-next-line @typescript-eslint/typedef */
                    Listeners.current[KeyPress].forEach((Method) => Method(InEvent));
                }

                // create an interval to check the duration every 100ms
                ResetTimer();
                CreateTimer(() =>
                {
                    NextKeysDown.forEach((Key: string) =>
                    {
                        if (HoldTimer.current >= HoldDurations.current[Key])
                        {
                            /* We are given the duration; execute and reset the timer check. */
                            HoldListeners.current?.[KeyPress](InEvent);
                            ResetTimer();
                        }
                    });
                });

                /* Check whether we fulfilled a sequence. */
                if (SequenceTimer.current !== undefined)
                {
                    window.clearTimeout(SequenceTimer.current);
                }

                /* Track previously pressed keys. */
                PreviousKeys.current.push(...NextKeysDown);

                const SequenceKeys: string = PreviousKeys.current.join(",");
                if (SequenceListeners.current[SequenceKeys] !== undefined)
                {
                    SequenceListeners.current[SequenceKeys](InEvent);
                    if (SequenceTimer.current)
                    {
                        window.clearTimeout(SequenceTimer.current);
                        SequenceTimer.current = undefined;
                        PreviousKeys.current = [ ];
                    }
                }

                /* We have two seconds to keep sequencing keys, otherwise we will reset the previous array. */
                SequenceTimer.current = window.setTimeout(() =>
                {
                    PreviousKeys.current = [];
                    SequenceTimer.current = undefined;
                }, Props.SequenceTimeout ?? 2000);
            }
        },
        [ Props, CreateTimer, ResetTimer ]
    );

    /** Unset the previously pressed keys. */
    const KeyUp: FKeyboardEventCallback = useCallback((Event: KeyboardEvent): void =>
    {
        /* Ignore events from F24 or its Windows 11 representation "⇒" */
        if (Event.key === "⇒" || Event.key?.toLowerCase() === "f20")
        {
            return;
        }

        const keysUp: Array<string> = [];
        const key: string = Event.key?.toLowerCase();

        if (key === "control" || Event.ctrlKey)
        {
            keysUp.push("ctrl");
        }
        if (key === "alt" || Event.altKey)
        {
            keysUp.push("alt");
        }
        if (key === "meta" || Event.metaKey)
        {
            keysUp.push("meta");
        }
        if (key === "shift" || Event.shiftKey)
        {
            keysUp.push("shift");
        }

        const SpecialKeys: Array<string> = [ "control", "alt", "meta", "shift" ];
        if (SpecialKeys.indexOf(key) < 0)
        {
            keysUp.push(key);
        }

        KeysDown.current = KeysDown.current.filter((CurrentKey: string): boolean =>
        {
            return keysUp.indexOf(CurrentKey) < 0;
        });

        ResetTimer();
    }, [ ResetTimer ]);

    /**
     * On blur of the window, we unset keyDown because the keyUp event happens outside of the window focus
     */
    const WindowBlur: FSimpleCallback = useCallback(() =>
    {
        KeysDown.current = [];
        ResetTimer();
    }, [ ResetTimer ]);

    /**
     * Register a new shortcut for the application
     *
     * Set a holdDuration to execute the shortcut only after the set keys have been pressed for the
     * configured duration.
     */
    const RegisterShortcut: FRegisterFunction = useCallback(
        (
            Method: (e?: KeyboardEvent) => unknown,
            Keys: Array<string> = [],
            Title: string,
            HoldDuration?: number
        ) =>
        {
            const NextShortcuts: Array<IShortcut> = [ ...Shortcuts.current ];

            /* Do we need to hold this shortcut? */
            const Hold: boolean = HoldDuration !== undefined;
            const Duration: number = HoldDuration !== undefined ? HoldDuration : 0;
            const TransformedKeys: Array<string> = transformKeys(Keys);

            const Shortcut: IShortcut = {
                Hold: Hold,
                HoldDuration: Duration,
                Id: Date.now().toString(36),
                Keys: TransformedKeys,
                Method: Method,
                Sequence: false,
                Title: Title
            };

            NextShortcuts.push(Shortcut);

            /* Create a listener for each key. */
            TransformedKeys.forEach((Key: string) =>
            {
                if (Hold)
                {
                    HoldDurations.current[Key] = Duration;
                    HoldListeners.current[Key] = Method;
                }
                else
                {
                    if (!Listeners.current[Key])
                    {
                        Listeners.current[Key] = [];
                    }

                    Listeners.current[Key] = [ ...Listeners.current[Key], Method ];
                }
            });

            Shortcuts.current = NextShortcuts;
            SetShortcutsState(NextShortcuts);
        },
        [ ]
    );

    type FRegisterSequenceCallback = (
        Method: FSimpleCallback,
        Keys: Array<string>,
        Title: string
    ) => void;

    /**
     * Register a shortcut that listens for a sequence of keys to be pressed.
     *
     * Unlike the registerShortcut method, the array of keys represents the keys that need to be
     * pressed in the configured order.
     */
    const RegisterSequenceShortcut: FRegisterSequenceCallback = useCallback((
        Method: FSimpleCallback,
        Keys: Array<string> = [ ],
        Title: string
    ): void =>
    {
        const NextShortcuts: Array<IShortcut> = [ ...Shortcuts.current ];

        /* Create new shortcut. */
        const Shortcut: IShortcut =
        {
            Hold: false,
            HoldDuration: 0,
            Id: Date.now().toString(36),
            Keys: Keys,
            Method: Method,
            Sequence: true,
            Title: Title
        };

        /* Check if we already have existing keys for the new keys being passed. */
        let Exists: boolean = false;
        const KeyEvent: string = Keys.join(",").toLowerCase();
        Object.keys(SequenceListeners.current).forEach((ExistingKey: string) =>
        {
            Exists = Exists || KeyEvent === ExistingKey;
        });

        if (!Exists)
        {
            NextShortcuts.push(Shortcut);

            /* Create a listener for each key. */
            SequenceListeners.current[KeyEvent] = Method;

            Shortcuts.current = NextShortcuts;

            SetShortcutsState(NextShortcuts);
        }
    }, [ ]);

    /**
     * Programatically trigger a shortcut using a key sequence
     *
     * Note: This ignores any ignored keys meaning this method is useful for bypassing otherwise
     * disabled shortcuts.
     */
    const TriggerShortcut: TSimpleFunction<string> = useCallback((Key: string) =>
    {
        const TransformedKeys: Array<string> = transformKeys([ Key ]);
        const TransformKey: string | undefined = TransformedKeys.pop();
        if (TransformKey && Listeners.current[TransformKey])
        {
            Listeners.current[TransformKey].forEach((Method: FSimpleCallback) => Method());
        }
    }, [ ]);

    type FUnregisterShortcutCallback = (Keys: Array<string>, Sequence: boolean) => void;

    /** Remove a shortcut from the application. */
    const UnregisterShortcut: FUnregisterShortcutCallback =
        useCallback((Keys: Array<string>, Sequence: boolean = false) =>
        {
            const TransformedKeys: Array<string> = transformKeys(Keys);
            if (!Sequence)
            {
                TransformedKeys.forEach((Key: string) =>
                {
                    if (Listeners.current[Key])
                    {
                        Listeners.current[Key].pop();

                        if (Listeners.current[Key].length === 0)
                        {
                            delete Listeners.current[Key];
                        }
                    }
                    delete HoldListeners.current[Key];
                    delete HoldDurations.current[Key];
                });
            }
            else
            {
                const KeyEvent: string = TransformedKeys.join(",");
                delete SequenceListeners.current[KeyEvent];
            }

            /* Delete the shortcut. */
            const NextShortcuts: Array<IShortcut> =
                Shortcuts.current.filter(({ Keys: ShortcutKeys }: Pick<IShortcut, "Keys">) =>
                {
                    let IsMatch: boolean = true;

                    ShortcutKeys.forEach((ShortcutKey: string) =>
                    {
                        IsMatch = IsMatch && TransformedKeys.indexOf(ShortcutKey) >= 0;
                    });

                    return !IsMatch;
                });

            Shortcuts.current = NextShortcuts;
            SetShortcutsState(NextShortcuts);
        }, [ ]);

    const SetEnabled: TSimpleFunction<boolean> = useCallback((enabled: boolean) =>
    {
        IsEnabled.current = enabled;
    }, [ ]);

    const value: IShortcutProviderRenderProps = useMemo(() =>
    {
        return {
            RegisterSequenceShortcut,
            RegisterShortcut: RegisterShortcut,
            SetEnabled,
            Shortcuts: ShortcutsState,
            TriggerShortcut,
            UnregisterShortcut
        };
        /** @TODO If Keybinds breaks, it is likely this dependency array. */
        /* eslint-disable-next-line @stylistic/max-len */
    }, [ RegisterSequenceShortcut, RegisterShortcut, SetEnabled, ShortcutsState, TriggerShortcut, UnregisterShortcut ]);

    useEffect(() =>
    {
        window.addEventListener("keydown", KeyDown);
        window.addEventListener("keyup", KeyUp);
        window.addEventListener("blur", WindowBlur);

        return () =>
        {
            window.removeEventListener("keydown", KeyDown);
            window.removeEventListener("keyup", KeyUp);
            window.removeEventListener("blur", WindowBlur);
        };
    }, [ KeyDown, KeyUp, WindowBlur ]);

    return (
        <ShortcutContext.Provider { ...{ value: value } }>
            { children }
        </ShortcutContext.Provider>
    );
}
);

/**
 * Default useShortcut hook.
 * Returns methods to register/unregister shortcuts.
 */
export const UseShortcut = () => useContext(ShortcutContext);
