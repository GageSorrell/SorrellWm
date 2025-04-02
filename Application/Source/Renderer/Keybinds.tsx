/* File:      Keybinds.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
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

/** Shortcut. */
export interface IShortcut
{
    description: string;
    hold: boolean;
    holdDuration: number;
    id: string;
    keys: Array<string>;
    method: (Props: KeyboardEvent) => unknown;
    sequence: boolean;
    title: string;
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
    ignoreKeys?: Array<string>;
    ignoreTagNames?: Array<string>;
    preventDefault?: boolean;
    sequenceTimeout?: number;
}

/**
 * Shortcut State
 */
export type IShortcutProviderState = Array<IShortcut>;

/**
 * Shortcut Render Props
 */
export type IShortcutProviderRenderProps = {
    registerShortcut: (
        method: (e?: KeyboardEvent) => any,
        keys: Array<string>,
        title: string,
        description: string,
        holdDuration?: number,
    ) => void;
    registerSequenceShortcut: (
        method: () => any,
        keys: Array<string>,
        title: string,
        description: string,
    ) => void;
    setEnabled: (enabled: boolean) => void;
    triggerShortcut: (key: string) => unknown;
    unregisterShortcut: (keys: Array<string>) => void;
} & { shortcuts: IShortcutProviderState };

/**
 * Listener Interface
 */
interface ISingleShortcutListener
{
    [key: string]: (e?: KeyboardEvent) => unknown;
}

/**
 * MultiListener Interface
 * Uses an array to store multiple different shortcuts. Only applies to standard shortcuts
 */
interface IShortcutListener
{
    [ Key: string ]: Array<(e?: KeyboardEvent) => unknown>;
}

type FKeyboardEventCallback = (Event: KeyboardEvent) => void;
type FRegisterFunction = (
    Method: () => unknown,
    Keys: Array<string>,
    Title: string,
    Description: string
) => void;

/**
 * Default tags to ignore shortcuts when focused
 */
const ignoreForTagNames = [ "input", "textarea", "select" ];

const ShortcutContext = createContext<IShortcutProviderRenderProps | undefined>(undefined);

/**
 * Route known keys to their proper executed counterpart
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

type FShortcutProvider = React.MemoExoticComponent<({ children, ...Props }: PropsWithChildren<IShortcutProviderProps>) => JSX.Element>;

/* eslint-disable-next-line @stylistic/max-len */
export const ShortcutProvider: FShortcutProvider = memo(({ children, ...props }: PropsWithChildren<IShortcutProviderProps>) =>
{
    const holdDurations = useRef<{ [ Key: string ]: number; }>({ });
    const holdInterval = useRef<number>();
    const holdListeners = useRef<ISingleShortcutListener>({});
    const holdTimer = useRef<number>(0);
    const keysDown = useRef<Array<string>>([]);
    const listeners = useRef<IShortcutListener>({});
    const previousKeys = useRef<Array<string>>([]);
    const sequenceListeners = useRef<ISingleShortcutListener>({});
    const sequenceTimer = useRef<number | undefined>();
    const shortcuts = useRef<IShortcutProviderState>([]);

    const [ shortcutsState, setShortcutsState ] = useState<IShortcutProviderState>([]);
    const isEnabled = useRef<boolean>(true);

    /**
     * Create an interval timer to check the duration of held keypresses
     */
    const createTimer = useCallback((callback: () => void) =>
    {
        holdInterval.current = window.setInterval(() =>
        {
            callback();
            holdTimer.current += 100;
        }, 100);
    }, []);

    /**
     * Reset the keypress timer
     */
    const resetTimer = useCallback(() =>
    {
        if (holdInterval.current !== undefined)
        {
            window.clearInterval(holdInterval.current);
            holdInterval.current = undefined;
            holdTimer.current = 0;
        }
    }, []);

    /**
     * Handle "keydown" events and run the appropriate registered method
     */
    const KeyDown: FKeyboardEventCallback = useCallback(
        (e: KeyboardEvent) =>
        {
            // Ignore events from F24 or its Windows 11 representation "⇒"
            if (e.key === "⇒" || e.key?.toLowerCase() === "f24")
            {
                return;
            }

            if (!isEnabled.current)
            {
                return;
            }

            const { ignoreKeys = [], ignoreTagNames, preventDefault = true } = props;
            const target = e.target as HTMLElement;
            // ignore listening when certain elements are focused
            const ignore = ignoreTagNames
                ? ignoreTagNames.map(tag => tag.toLowerCase())
                : ignoreForTagNames;
                // The currently pressed key
            const key: string = e.key?.toLowerCase();

            // ensure that we're not focused on an element such as an <input />
            if (
                key &&
          ignore.indexOf(target.tagName.toLowerCase()) < 0 &&
          keysDown.current.indexOf(key) < 0
            )
            {
                const nextKeysDown: Array<string> = [];
                const nextModKeys: Array<string> = [];
                if ((key === "control" || e.ctrlKey) && ignoreKeys.indexOf("ctrl") < 0)
                {
                    if (keysDown.current.indexOf("ctrl") < 0)
                    {
                        nextKeysDown.push("ctrl");
                    }
                    if (key === "control")
                    {
                        nextModKeys.push(key);
                    }
                }
                if ((key === "alt" || e.altKey) && ignoreKeys.indexOf("alt") < 0)
                {
                    if (keysDown.current.indexOf("alt") < 0)
                    {
                        nextKeysDown.push("alt");
                    }
                    if (key === "alt")
                    {
                        nextModKeys.push(key);
                    }
                }
                if (
                    (key === "meta" || e.metaKey) &&
            ignoreKeys.indexOf("meta") < 0 &&
            ignoreKeys.indexOf("cmd") < 0
                )
                {
                    if (keysDown.current.indexOf("meta") < 0)
                    {
                        nextKeysDown.push("meta");
                    }
                    if (key === "meta")
                    {
                        nextModKeys.push(key);
                    }
                }
                if ((key === "shift" || e.shiftKey) && ignoreKeys.indexOf("shift") < 0)
                {
                    if (keysDown.current.indexOf("shift") < 0)
                    {
                        nextKeysDown.push("shift");
                    }
                    if (key === "shift")
                    {
                        nextModKeys.push(key);
                    }
                }

                if ([ ...ignoreKeys, ...nextModKeys ].indexOf(key) < 0)
                {
                    nextKeysDown.push(key);
                }

                keysDown.current = [ ...keysDown.current, ...nextKeysDown ];

                const KeyPress: string = keysDown.current.join("+");
                if (listeners.current[KeyPress])
                {
                    // automatically preventDefault on the key
                    if (preventDefault)
                    {
                        e.preventDefault();
                    }
                    listeners.current[KeyPress].forEach(method => method(e));
                }

                // create an interval to check the duration every 100ms
                resetTimer();
                createTimer(() =>
                {
                    nextKeysDown.forEach(key =>
                    {
                        if (holdTimer.current >= holdDurations.current[key])
                        {
                            // we're passed the duration - execute and reset the timer check
                            holdListeners.current?.[KeyPress](e);
                            resetTimer();
                        }
                    });
                });

                // check if we fulfilled a sequence
                if (sequenceTimer.current !== undefined)
                {
                    window.clearTimeout(sequenceTimer.current);
                }

                // Track previously pressed keys
                previousKeys.current.push(...nextKeysDown);

                const SequenceKeys: string = previousKeys.current.join(",");
                if (sequenceListeners.current[SequenceKeys] !== undefined)
                {
                    sequenceListeners.current[SequenceKeys](e);
                    if (sequenceTimer.current)
                    {
                        window.clearTimeout(sequenceTimer.current);
                        sequenceTimer.current = undefined;
                        previousKeys.current = [];
                    }
                }

                // we have 2s to keep sequencing keys otherwise we'll reset the previous array
                sequenceTimer.current = window.setTimeout(() =>
                {
                    previousKeys.current = [];
                    sequenceTimer.current = undefined;
                }, props.sequenceTimeout ?? 2000);
            }
        },
        [ props, createTimer, resetTimer ]
    );

    /** Unset the previously pressed keys. */
    const KeyUp: FKeyboardEventCallback = useCallback((Event: KeyboardEvent): void =>
    {
        /* Ignore events from F24 or its Windows 11 representation "⇒" */
        if (Event.key === "⇒" || Event.key?.toLowerCase() === "f24")
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

        keysDown.current = keysDown.current.filter((CurrentKey: string): boolean =>
        {
            return keysUp.indexOf(CurrentKey) < 0;
        });

        resetTimer();
    }, [ resetTimer ]);

    /**
     * On blur of the window, we unset keyDown because the keyUp event happens outside of the window focus
     */
    const windowBlur = useCallback(() =>
    {
        keysDown.current = [];
        resetTimer();
    }, [ resetTimer ]);

    /**
     * Register a new shortcut for the application
     *
     * Set a holdDuration to execute the shortcut only after the set keys have been pressed for the
     * configured duration.
     */
    const registerShortcut: FRegisterFunction = useCallback(
        (
            method: (e?: KeyboardEvent) => unknown,
            keys: Array<string> = [],
            title: string,
            description: string,
            holdDuration?: number
        ) =>
        {
            const NextShortcuts: Array<IShortcut> = [ ...shortcuts.current ];

            // do we need to hold this shortcut?
            const Hold: boolean = holdDuration !== undefined;
            const Duration: number = holdDuration !== undefined ? holdDuration : 0;
            const TransformedKeys: Array<string> = transformKeys(keys);

            // create new shortcut
            const shortcut: IShortcut = {
                description,
                id: Date.now().toString(36),
                hold: Hold,
                holdDuration: Duration,
                keys: TransformedKeys,
                method,
                sequence: false,
                title
            };
                // add it to the list of shortcuts
            NextShortcuts.push(shortcut);

            // create a listener for each key
            TransformedKeys.forEach(key =>
            {
                if (Hold)
                {
                    holdDurations.current[key] = Duration;
                    holdListeners.current[key] = method;
                }
                else
                {
                    if (!listeners.current[key])
                    {
                        listeners.current[key] = [];
                    }

                    listeners.current[key] = [ ...listeners.current[key], method ];
                }
            });

            shortcuts.current = NextShortcuts;
            setShortcutsState(NextShortcuts);
        },
        [ ]
    );

    /**
     * Register a shortcut that listens for a sequence of keys to be pressed
     *
     * Unlike the registerShortcut method, the array of keys represents the keys that need to be
     * pressed in the configured order
     */
    const registerSequenceShortcut = useCallback(
        (Method: () => any, Keys: Array<string> = [], Title: string, Description: string): void =>
        {
            const nextShortcuts = [ ...shortcuts.current ];

            // create new shortcut
            const shortcut: IShortcut = {
                id: Date.now().toString(36),
                description: Description,
                hold: false,
                holdDuration: 0,
                keys: Keys,
                method: Method,
                sequence: true,
                title: Title
            };

            // check if we already have existing keys for the new keys being passed
            let exists = false;
            const keyEvent = Keys.join(",").toLowerCase();
            Object.keys(sequenceListeners.current).forEach(existingKey =>
            {
                exists = exists || keyEvent === existingKey;
            });

            if (!exists)
            {
                nextShortcuts.push(shortcut);

                // create a listener for each key
                sequenceListeners.current[keyEvent] = Method;

                shortcuts.current = nextShortcuts;

                setShortcutsState(nextShortcuts);
            }
        },
        []
    );

    /**
     * Programatically trigger a shortcut using a key sequence
     *
     * Note: This ignores any ignored keys meaning this method is useful for bypassing otherwise
     * disabled shortcuts.
     */
    const triggerShortcut = useCallback((key: string) =>
    {
        const transformedKeys = transformKeys([ key ]);
        const transformKey = transformedKeys.pop();
        if (transformKey && listeners.current[transformKey])
        {
            listeners.current[transformKey].forEach(method => method());
        }
    }, []);

    /**
     * Remove a shortcut from the application
     */
    const unregisterShortcut = useCallback((keys: Array<string>, sequence: boolean = false) =>
    {
        const transformedKeys = transformKeys(keys);
        if (!sequence)
        {
            transformedKeys.forEach(key =>
            {
                if (listeners.current[key])
                {
                    listeners.current[key].pop();

                    if (listeners.current[key].length === 0)
                    {
                        delete listeners.current[key];
                    }
                }
                delete holdListeners.current[key];
                delete holdDurations.current[key];
            });
        }
        else
        {
            const keyEvent = transformedKeys.join(",");
            delete sequenceListeners.current[keyEvent];
        }

        // Delete the shortcut
        const nextShortcuts = shortcuts.current.filter(({ keys: shortcutKeys }) =>
        {
            let match = true;
            shortcutKeys.forEach(shortcutKey =>
            {
                match = match && transformedKeys.indexOf(shortcutKey) >= 0;
            });
            return !match;
        });

        shortcuts.current = nextShortcuts;
        setShortcutsState(nextShortcuts);
    }, []);

    const setEnabled = useCallback((enabled: boolean) =>
    {
        isEnabled.current = enabled;
    }, []);

    const value: IShortcutProviderRenderProps = useMemo(() =>
    {
        return {
            registerSequenceShortcut,
            registerShortcut,
            setEnabled,
            shortcuts: shortcutsState,
            triggerShortcut,
            unregisterShortcut
        };
        /** @TODO If Keybinds breaks, it is likely this dependency array. */
        /* eslint-disable-next-line @stylistic/max-len */
    }, [ registerSequenceShortcut, registerShortcut, setEnabled, shortcutsState, triggerShortcut, unregisterShortcut ]);

    useEffect(() =>
    {
        window.addEventListener("keydown", KeyDown);
        window.addEventListener("keyup", KeyUp);
        window.addEventListener("blur", windowBlur);

        return () =>
        {
            window.removeEventListener("keydown", KeyDown);
            window.removeEventListener("keyup", KeyUp);
            window.removeEventListener("blur", windowBlur);
        };
    }, [ KeyDown, KeyUp, windowBlur ]);

    return (
        <ShortcutContext.Provider { ...{ value } }>
            { children }
        </ShortcutContext.Provider>
    );
}
);

/**
 * Default useShortcut hook
 *
 * Returns methods to register/unregister shortcuts
 */
export const useShortcut = () => useContext(ShortcutContext);
