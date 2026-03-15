/* File:      Keyboard.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { ActionKeys, type FActionKey, type FKeybinds } from "Source/Shared/Settings";
import {
    CompassNorthwestRegular,
    EditSettingsRegular,
    EyeRegular,
    LayoutRowFourFocusCenterTopFilled,
    PersonRunningRegular,
    SparkleActionRegular,
    TextEditStyleRegular } from "@fluentui/react-icons";
import {
    type Context,
    type FC,
    type ReactElement,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState } from "react";
import {
    DefaultSettings,
    type FLogger,
    type FSimpleCallback,
    GetPropertyFromPath,
    type TObjectPath } from "../../../../Shared";
import { type FSettings, UseSettings, UseUpdateSetting, UseUpdateSettings } from "@/Settings";
import { Toast, type ToastProps, ToastTitle } from "@fluentui/react-components";
import type { CKeyboardSettings } from "./Keyboard.Types";
import type { FKeyId } from "Source/Shared/Keyboard.Types";
import type { FKeybindPair } from "../Component/Keyboard/KeybindSet.Types";
import type { FSimpleCommand } from "@/Domain/Common";
import { GetLogger } from "@/Log";
import { KeyIds } from "Source/Shared/Keyboard";
import { KeybindSet } from "../Component/Keyboard/KeybindSet";
import { SettingsScreen } from "./SettingsScreen";
import { UseCommands } from "@/Command";
import { UseSendIpcEventDeferred } from "@/Event";
import { UseToaster } from "@/Toast";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Keyboard");

const EmptyContext: CKeyboardSettings =
{
    EditingKeybind: undefined,
    RequestCancel: (_In: FActionKey) => false,
    RequestEditKeybind: (_In: FActionKey) => false
};

const KeyboardSettingsContext: Context<CKeyboardSettings> = createContext<CKeyboardSettings>(EmptyContext);

export const UseKeyboardSettings = (): Readonly<CKeyboardSettings> =>
{
    const {
        EditingKeybind,
        RequestCancel,
        RequestEditKeybind
    } = useContext<CKeyboardSettings>(KeyboardSettingsContext);

    return { EditingKeybind, RequestCancel, RequestEditKeybind } as const;
};

export const Keyboard = (): ReactElement =>
{
    const [ EditingKeybind, SetEditingKeybind ] = useState<FActionKey | undefined>(undefined);

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const RequestCancel: CKeyboardSettings["RequestCancel"] =
        useCallback((In: FActionKey): boolean =>
        {
            if (In === EditingKeybind)
            {
                SetEditingKeybind((_Old: FActionKey | undefined): undefined =>
                {
                    return undefined;
                });

                SendIpcEvent("AllowActivation", undefined);

                return true;
            }
            else
            {
                return false;
            }
        }, [ EditingKeybind, SendIpcEvent ]);

    const RequestEditKeybind: CKeyboardSettings["RequestEditKeybind"] =
        useCallback((In: FActionKey): boolean =>
        {
            if (EditingKeybind === undefined)
            {
                SetEditingKeybind((_Old: FActionKey | undefined): FActionKey =>
                {
                    return In;
                });

                SendIpcEvent("PreventActivation", undefined);

                return true;
            }
            else
            {
                return false;
            }
        }, [ EditingKeybind, SendIpcEvent, SetEditingKeybind ]);

    const value: CKeyboardSettings =
    {
        EditingKeybind,
        RequestCancel,
        RequestEditKeybind
    };

    const [ Settings ] = UseSettings();

    const GetActionFromKey: ((Key: FKeyId) => FActionKey | undefined) =
        useCallback((Key: FKeyId): FActionKey | undefined =>
        {
            let Out: FActionKey | undefined = undefined;
            ActionKeys.forEach((ActionKey: FActionKey): void =>
            {
                const Path: TObjectPath<FKeybinds> =
                    ActionKey.replaceAll("]", "").replaceAll("[", ".") as TObjectPath<FKeybinds>;

                const Value: FKeyId | Array<FKeyId> | undefined =
                    GetPropertyFromPath(Settings.Keybinds, Path);

                if (Array.isArray(Value))
                {
                    if (Value.map((In: FKeyId) => In.toLowerCase()).includes(Key.toLowerCase()))
                    {
                        Out = ActionKey;
                        return;
                    }
                }
                else if (Value !== undefined && Key.toLowerCase() === Value.toLowerCase())
                {
                    Out = ActionKey;
                    return;
                }
            });

            return Out;
        }, [ Settings.Keybinds ]);

    const DirectionKeybinds: Array<FKeybindPair> =
    [
        {
            ActionKey: "Direction.Left",
            Caption: "Left",
            KeyIds: Settings.Keybinds.Direction.Left
        },
        {
            ActionKey: "Direction.Up",
            Caption: "Up",
            KeyIds: Settings.Keybinds.Direction.Up
        },
        {
            ActionKey: "Direction.Down",
            Caption: "Down",
            KeyIds: Settings.Keybinds.Direction.Down
        },
        {
            ActionKey: "Direction.Right",
            Caption: "Right",
            KeyIds: Settings.Keybinds.Direction.Right
        }
    ];

    const PrimaryKeybinds: Array<FKeybindPair> =
    [
        {
            ActionKey: "Primary[0]",
            Caption: "#1",
            KeyIds: Settings.Keybinds.Primary[0]
        },
        {
            ActionKey: "Primary[1]",
            Caption: "#2",
            KeyIds: Settings.Keybinds.Primary[1]
        },
        {
            ActionKey: "Primary[2]",
            Caption: "#3",
            KeyIds: Settings.Keybinds.Primary[2]
        },
        {
            ActionKey: "Primary[3]",
            Caption: "#4",
            KeyIds: Settings.Keybinds.Primary[3]
        }
    ];

    const SecondaryKeybinds: Array<FKeybindPair> =
    [
        {
            ActionKey: "Secondary[0]",
            Caption: "#1",
            KeyIds: Settings.Keybinds.Secondary[0]
        },
        {
            ActionKey: "Secondary[1]",
            Caption: "#2",
            KeyIds: Settings.Keybinds.Secondary[1]
        },
        {
            ActionKey: "Secondary[2]",
            Caption: "#3",
            KeyIds: Settings.Keybinds.Secondary[2]
        },
        {
            ActionKey: "Secondary[3]",
            Caption: "#4",
            KeyIds: Settings.Keybinds.Secondary[3]
        }
    ];

    const PeekKeybind: Array<FKeybindPair> =
    [
        {
            ActionKey: "Miscellaneous.Peek",
            KeyIds: Settings.Keybinds.Miscellaneous.Peek
        }
    ];

    const FocusListKeybind: Array<FKeybindPair> =
    [
        {
            ActionKey: "Miscellaneous.FocusList",
            KeyIds: Settings.Keybinds.Miscellaneous.FocusList
        }
    ];

    const FocusTextInputKeybind: Array<FKeybindPair> =
    [
        {
            ActionKey: "Miscellaneous.FocusTextInput",
            KeyIds: Settings.Keybinds.Miscellaneous.FocusTextInput
        }
    ];

    const OpenSettingsKeybind: Array<FKeybindPair> =
    [
        {
            ActionKey: "Miscellaneous.Settings",
            KeyIds: Settings.Keybinds.Miscellaneous.Settings
        }
    ];

    const CancelSetKeybindCallback: FSimpleCallback = useCallback((): void =>
    {
        SetEditingKeybind((_Old: FActionKey | undefined): undefined =>
        {
            return undefined;
        });
    }, [ SetEditingKeybind ]);

    const [ AttemptedKey, SetAttemptedKey ] = useState<string>("");

    const FailureToast: FC<ToastProps> = useCallback((_: ToastProps): ReactElement<ToastProps> =>
    {
        return (
            <Toast>
                <ToastTitle>
                    The { AttemptedKey } key cannot be used in a keybind.
                </ToastTitle>
            </Toast>
        );
    }, [ AttemptedKey ]);

    const [ DispatchToast ] = UseToaster(FailureToast);

    const CancelSetKeybindCommand: FSimpleCommand = useMemo((): FSimpleCommand =>
    {
        return {
            Action: [ "Cancel" ],
            Callback: CancelSetKeybindCallback,
            Description: "@TODO",
            Name: "Cancel"
        };
    }, [ CancelSetKeybindCallback ]);

    UseCommands(CancelSetKeybindCommand);

    const [ UpdateSetting ] = UseUpdateSetting();
    const [ UpdateSettings ] = UseUpdateSettings();

    useEffect((): void =>
    {
        if (AttemptedKey !== "")
        {
            DispatchToast({ intent: "error" });
        }
    }, [ AttemptedKey, DispatchToast ]);

    useEffect((): FSimpleCallback =>
    {
        const OnKeyDown = async (Event: KeyboardEvent): Promise<void> =>
        {
            if (EditingKeybind !== undefined)
            {
                const KeyIdsLowerCase: Array<string> = KeyIds.map((In: FKeyId): string => In.toLowerCase());
                const IsKeySupported: boolean = KeyIdsLowerCase.includes(Event.key.toLowerCase());
                if (IsKeySupported)
                {
                    const Key: FKeyId = Event.key.length === 1
                        ? (Event.key.toUpperCase()) as FKeyId
                        : Event.key as FKeyId;

                    const PreviousAction: FActionKey | undefined = GetActionFromKey(Key);

                    const KeybindPathPart: string =
                        EditingKeybind.replaceAll("]", "").replaceAll("[", ".");
                    const Path: TObjectPath<FSettings> =
                        `Keybinds.${ KeybindPathPart }` as TObjectPath<FSettings>;

                    SetAttemptedKey((_Old: string): string =>
                    {
                        return "";
                    });

                    const Value: FKeyId | Array<FKeyId> =
                        Array.isArray(GetPropertyFromPath(DefaultSettings, Path))
                            ? [ Key ]
                            : Key;

                    if (PreviousAction !== undefined && PreviousAction !== EditingKeybind)
                    {
                        const KeybindPathPart: string =
                            PreviousAction.replaceAll("]", "").replaceAll("[", ".");

                        const PreviousPath: TObjectPath<FSettings> =
                            `Keybinds.${ KeybindPathPart }` as TObjectPath<FSettings>;

                        UpdateSettings(
                            { Path: PreviousPath, Value: undefined },
                            { Path, Value: Value as FKeyId }
                        );
                    }
                    else
                    {
                        UpdateSetting(Path, Value as FKeyId);
                    }
                }
                else
                {
                    SetAttemptedKey((_Old: string): string =>
                    {
                        return Event.key;
                    });
                }

                SetEditingKeybind((_Old: FActionKey | undefined): undefined =>
                {
                    return undefined;
                });
            }
        };

        window.addEventListener("keydown", OnKeyDown);

        return (): void =>
        {
            window.removeEventListener("keydown", OnKeyDown);
        };
    }, [ DispatchToast, EditingKeybind, GetActionFromKey, SetEditingKeybind, UpdateSetting, UpdateSettings ]);

    const ActivationKeybind: Array<FKeybindPair> =
    [
        {
            ActionKey: "Activate",
            KeyIds: Settings.Keybinds.Activate
        }
    ];

    return (
        <KeyboardSettingsContext.Provider { ...{ value } }>
            <SettingsScreen Title="Keyboard">
                <KeybindSet
                    Icon={ PersonRunningRegular }
                    Keybinds={ ActivationKeybind }
                    Subtitle="Launches the SorrellWm overlay."
                    Title="Activation Key"
                />
                <KeybindSet
                    Icon={ CompassNorthwestRegular }
                    Keybinds={ DirectionKeybinds }
                    Subtitle="The direction keys."
                    Title="Direction"
                />
                <KeybindSet
                    Icon={ SparkleActionRegular }
                    Keybinds={ PrimaryKeybinds }
                    Subtitle="The primary action keys."
                    Title="Primary"
                />
                <KeybindSet
                    Icon={ SparkleActionRegular }
                    Keybinds={ SecondaryKeybinds }
                    Subtitle="The secondary action keys."
                    Title="Secondary"
                />
                <KeybindSet
                    Icon={ EyeRegular }
                    Keybinds={ PeekKeybind }
                    Subtitle="Temporarily hide the SorrellWM overlay."
                    Title="Peek"
                />
                <KeybindSet
                    Icon={ TextEditStyleRegular }
                    Keybinds={ FocusTextInputKeybind }
                    Subtitle="Focuses a displayed text input."
                    Title="Focus Text Input"
                />
                <KeybindSet
                    Icon={ LayoutRowFourFocusCenterTopFilled }
                    Keybinds={ FocusListKeybind }
                    Subtitle="Focuses a displayed list."
                    Title="Focus List"
                />
                <KeybindSet
                    Icon={ EditSettingsRegular }
                    Keybinds={ OpenSettingsKeybind }
                    Subtitle="Opens this window."
                    Title="Open Settings"
                />
            </SettingsScreen>
        </KeyboardSettingsContext.Provider>
    );
};
