/* File:      Keyboard.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import {
    type Context,
    type EffectCallback,
    type PropsWithChildren,
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useState } from "react";
import type { FKeyboardEvent } from "#/Keyboard.Types";
import type { FVirtualKey } from "./Domain/Common/Component/Keyboard/Keyboard.Types";
import { Identity } from "./Utility";
import { On } from "./Api";

/**
 * Register a key combination that is valid until the component in which
 * the key combination was registered is no longer alive.
 */
export const UseKeyCombination = (KeyCombination: FKeyCombination): void =>
{
    const { RegisterKeyCombination, UnregisterKeyCombination } = UseKeyboardContext();
    useEffect((): ReturnType<EffectCallback> =>
    {
        RegisterKeyCombination(KeyCombination);
        return (): void =>
        {
            UnregisterKeyCombination(KeyCombination.Action);
        };
    }, [ KeyCombination, RegisterKeyCombination, UnregisterKeyCombination ]);
};

/**
 * Register a key combination that is valid until the returned callback is called.
 */
export const UsePersistentKeyCombination = (KeyCombination: FKeyCombination): (() => void) =>
{
    const { RegisterKeyCombination, UnregisterKeyCombination } = UseKeyboardContext();

    useEffect((): ReturnType<EffectCallback> =>
    {
        RegisterKeyCombination(KeyCombination);
    }, [ KeyCombination, RegisterKeyCombination, UnregisterKeyCombination ]);

    return (): void =>
    {
        UnregisterKeyCombination(KeyCombination.Action);
    };
};

export type CKeyboard =
{
    RegisterKeyCombination: (KeyCombination: FKeyCombination) => void;
    UnregisterKeyCombination: (Name: string) => void;
};

const EmptyContext: CKeyboard =
{
    RegisterKeyCombination: Identity,
    UnregisterKeyCombination: Identity
};

const KeyboardContext: Context<CKeyboard> = createContext<CKeyboard>(EmptyContext);

/** This will likely stay not exported. */
const UseKeyboardContext = (): CKeyboard =>
{
    return useContext<CKeyboard>(KeyboardContext);
};

export const KeyboardProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    /** The keys that are currently pressed. */
    const [ KeysDown, SetKeysDown ] = useState<Array<FVirtualKey>>([ ]);
    const [ KeyCombinations, SetKeyCombinations ] = useState<Array<FKeyCombination>>([ ]);

    const RegisterKeyCombination = (KeyCombination: FKeyCombination): void =>
    {
        SetKeyCombinations((Old: Array<FKeyCombination>): Array<FKeyCombination> =>
        {
            return Old.includes(KeyCombination)
                ? Old
                : [ ...Old, KeyCombination ];
        });
    };

    const UnregisterKeyCombination = (Name: string): void =>
    {
        SetKeyCombinations((Old: Array<FKeyCombination>): Array<FKeyCombination> =>
        {
            const New: Array<FKeyCombination> = [ ...Old ];

            const Index: number = New.findIndex((Item: FKeyCombination): boolean =>
            {
                return Item.Action === Name;
            });

            if (Index !== -1)
            {
                New.splice(Index, 1);
            }

            return New;
        });
    };

    useEffect((): void =>
    {
        KeyCombinations.forEach(({ Callback, Keys, Action: Name }: FKeyCombination): void =>
        {
            let HasDistinctEntry: boolean = Keys.length === KeysDown.length;
            const NumEntries: number = Math.min(KeyCombinations.length, KeysDown.length);
            for (let Index: number = 0; Index < NumEntries; Index++)
            {
                if (HasDistinctEntry)
                {
                    break;
                }
                else
                {
                    HasDistinctEntry = !Keys.includes(KeysDown[Index]);
                }
            }

            if (!HasDistinctEntry)
            {
                console.log(`Calling Key Combination Callback ${ Name }.`);
                Callback();
            }
        });
    }, [ KeyCombinations, KeysDown ]);

    useEffect((): void =>
    {
        On("Keyboard", (...Arguments: Array<unknown>): void =>
        {
            const { State, VkCode }: FKeyboardEvent = Arguments[0] as FKeyboardEvent;
            if (State === "Down")
            {
                SetKeysDown((Old: Array<FVirtualKey>): Array<FVirtualKey> =>
                {
                    return [ ...Old, VkCode ];
                });
            }
            else
            {
                SetKeysDown((Old: Array<FVirtualKey>): Array<FVirtualKey> =>
                {
                    const New: Array<FVirtualKey> = [ ...Old ];
                    const OldKeyIndex: number = Old.indexOf(VkCode);

                    if (OldKeyIndex !== -1)
                    {
                        New.splice(OldKeyIndex, 1);
                    }

                    return New;
                });
            }
        });
    }, [ SetKeysDown ]);

    const value: CKeyboard =
    {
        RegisterKeyCombination,
        UnregisterKeyCombination
    };

    return (
        <KeyboardContext.Provider { ...{ value } }>
            { children }
        </KeyboardContext.Provider>
    );
};
