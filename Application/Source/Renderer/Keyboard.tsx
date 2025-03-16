/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
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
import { Identity } from "./Utility";

type FKeybinds = Map<string, (Event: KeyboardEvent) => void>;

type CKeyboard =
{
    RegisterKeybind: (Key: string, Action: () => void) => void;
    UnregisterKeybind: (Key: string) => void;
};

const EmptyContext: CKeyboard =
{
    RegisterKeybind: Identity,
    UnregisterKeybind: Identity
};

const KeyboardContext: Context<CKeyboard> = createContext<CKeyboard>(EmptyContext);

export const UseKeyboard = (Key: string, Action: () => void): void =>
{
    const { RegisterKeybind, UnregisterKeybind } = useContext(KeyboardContext);
    useEffect((): ReturnType<EffectCallback> =>
    {
        RegisterKeybind(Key, Action);
        return (): void =>
        {
            console.log("Unregistered Keybind");
            UnregisterKeybind(Key);
        };
    }, [ Key, Action, RegisterKeybind, UnregisterKeybind ]);
};

export const KeyboardProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ Keybinds, SetKeybinds ] = useState<FKeybinds>(new Map<string, (Event: KeyboardEvent) => void>());

    const RegisterKeybind = (Key: string, Action: () => void): void =>
    {
        if (Keybinds.has(Key))
        {
            return;
        }

        const EventListener = (Event: KeyboardEvent): void =>
        {
            if (Event.key === Key.toLowerCase())
            {
                Action();
            }
        };

        document.body.addEventListener("keydown", EventListener);

        SetKeybinds((OldKeybinds: FKeybinds): FKeybinds =>
        {
            const NewMap: FKeybinds = new Map<string, (Event: KeyboardEvent) => void>(OldKeybinds);
            NewMap.set(Key, EventListener);
            return NewMap;
        });
    };

    const UnregisterKeybind = (Key: string): void =>
    {
        document.body.removeEventListener("keydown", Keybinds.get(Key) as (Event: KeyboardEvent) => void);
        SetKeybinds((OldKeybinds: FKeybinds): FKeybinds =>
        {
            const NewMap: FKeybinds = new Map<string, (Event: KeyboardEvent) => void>(OldKeybinds);
            NewMap.delete(Key);
            return NewMap;
        });
    };

    const value: CKeyboard =
    {
        RegisterKeybind,
        UnregisterKeybind
    };

    return (
        <KeyboardContext.Provider { ...{ value } }>
            { children }
        </KeyboardContext.Provider>
    );
};
