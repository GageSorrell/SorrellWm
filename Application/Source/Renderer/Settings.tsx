/* File:      Settings.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type Context,
    type PropsWithChildren,
    type ReactNode,
    type RefObject,
    type TransitionStartFunction,
    createContext,
    useCallback,
    useContext,
    useOptimistic,
    useRef,
    useState,
    useTransition } from "react";
import { DefaultSettings, type FSettings as FAppSettings } from "../Shared/Settings";
import {
    Delay,
    GetPropertyFromPath,
    Identity,
    MakeRef,
    SetPropertyFromPath,
    type TObjectPath,
    type TRef,
    type TTypeFromPath } from "../Shared/Utility";
import type { FLogger, FSimpleCallback } from "../Shared";
import type {
    FUseSettingsStateReturnType,
    TControlledProps,
    TUseSettingStateReturnType } from "./Settings.Types";
import { IsSuccessful, UseSendIpcEvent, UseSendIpcEventDeferred } from "./Event";
import type { TInternal, TSetState } from "./Utility";
import { Toast, ToastBody, ToastTitle, ToastTrigger } from "@fluentui/react-components";
import { Button } from "./Domain/Common";
import { GetLogger } from "./Log";
import type { TIpcState } from "./Event.Types";
import { UseToaster } from "./Toast";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Settings");

export type FSettings = Readonly<FAppSettings>;

type TUpdateFunction = <PathType extends TObjectPath<FSettings>,>(
    Path: PathType,
    Value: TTypeFromPath<PathType, FSettings>
) => void;

type TUpdateAction = <PathType extends TObjectPath<FSettings>,>(
    Path: PathType,
    Value: TTypeFromPath<PathType, FSettings>
) => Promise<void>;

type TUpdateTuple<PathType extends TObjectPath<FSettings> = TObjectPath<FSettings>,> =
{
    Path: PathType;
    Value: TTypeFromPath<PathType, FSettings>;
};

type TUpdateManyFunction = <PathType extends TObjectPath<FSettings>,>(
    ...Pairs: Array<TUpdateTuple<PathType>>
) => void;

export type CSettings = TInternal<{
    IsPending: boolean;
    OptimisticSettings: FSettings;
    RealSettings: FSettings;
    StartTransition: TransitionStartFunction;
    UpdateFunction: TUpdateFunction;
    UpdateManyFunction: TUpdateManyFunction;
}>;

const DefaultContextSettings: CSettings =
{
    INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:
    {
        IsPending: false,
        OptimisticSettings: DefaultSettings,
        RealSettings: DefaultSettings,
        StartTransition: Identity,
        UpdateFunction: Identity,
        UpdateManyFunction: Identity
    }
};

const SettingsContext: Context<CSettings> = createContext<CSettings>(DefaultContextSettings);

export const UseSettings = (): Readonly<[ FSettings ]> =>
{
    const { OptimisticSettings } =
        useContext<CSettings>(SettingsContext).INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    return [ OptimisticSettings ] as const;
};

export const UseSetting = <SettingKey extends keyof FSettings,>(
    SettingKey: SettingKey
): Readonly<[ Setting: FSettings[SettingKey] ]> =>
{
    const [ Settings ] = UseSettings();
    const Setting: FSettings[SettingKey] = Settings[SettingKey];

    return [ Setting ] as const;
};

export const UseUpdateSetting = (): Readonly<[ TUpdateFunction ]> =>
{
    const { UpdateFunction } =
        useContext<CSettings>(SettingsContext).INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    return [ UpdateFunction ] as const;
};

export const UseUpdateSettings = (): Readonly<[ TUpdateManyFunction ]> =>
{
    const { UpdateManyFunction } =
        useContext<CSettings>(SettingsContext).INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

    return [ UpdateManyFunction ] as const;
};

export const UseSettingState = <PathType extends TObjectPath<FSettings>,>(
    Path: PathType
): TUseSettingStateReturnType<PathType> =>
{
    type FSetting = TTypeFromPath<PathType, FSettings>;
    const [ Settings ] = UseSettings();
    const [ UpdateSetting ] = UseUpdateSetting();
    const Setting: FSetting = GetPropertyFromPath(Settings, Path);
    const OnChangeSetting = (NewValue: FSetting): void =>
    {
        UpdateSetting(Path, NewValue);
    };

    return [ Setting, OnChangeSetting ] as const;
};

export const UseSettingsState = (): FUseSettingsStateReturnType =>
{
    const [ Settings ] = UseSettings();
    const [ UpdateSetting ] = UseUpdateSetting();
    const GetControlledProps = <PathType extends TObjectPath<FSettings>,>(
        Path: PathType
    ): TControlledProps<TTypeFromPath<PathType, FSettings>> =>
    {
        type FControlledType = TTypeFromPath<PathType, FSettings>;

        const OnChangeValue = (NewValue: FControlledType): void =>
        {
            UpdateSetting(Path, NewValue);
        };

        const Value: FControlledType = GetPropertyFromPath(Settings, Path);

        return {
            OnChangeValue,
            Value
        };
    };

    return [ GetControlledProps, Settings ] as const;
};

const UseInitializeSettings = (SetRealSettings: TSetState<FSettings>): void =>
{
    const { Data, IsPending: IsGetSettingsPending } = UseSendIpcEvent("GetSettings", undefined);
    const Pending: RefObject<boolean> = useRef<boolean>(true);
    if (Pending.current && !IsGetSettingsPending)
    {
        Pending.current = false;
        SetRealSettings((Old: FSettings): FSettings =>
        {
            if (Data !== undefined)
            {
                return Data;
            }

            return Old;
        });
    }

};

const SettingsFailureToast = (): ReactNode =>
{
    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const onMouseDown: FSimpleCallback = useCallback((): void =>
    {
        SendIpcEvent("RequestRestart", undefined);
    }, [ SendIpcEvent ]);

    const RequestRestartButton: ReactNode =
    (
        <ToastTrigger>
            <Button { ...{ onMouseDown } }>
                Restart SorrellWm
            </Button>
        </ToastTrigger>
    );

    return (
        <Toast>
            <ToastTitle action={ RequestRestartButton }>
                Failed to save settings.
            </ToastTitle>
        </Toast>
    );
};

export const SettingsProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ RealSettings, SetRealSettings ] = useState<FSettings>(DefaultSettings);
    const [ OptimisticSettings, SetOptimisticSettings ] = useOptimistic<FSettings>(RealSettings);
    const [ IsPending, StartTransition ] = useTransition();

    UseInitializeSettings(SetRealSettings);

    const [ SendIpcEvent ] = UseSendIpcEventDeferred();

    const [ DispatchFailureToast ] = UseToaster(SettingsFailureToast);

    const UpdateAction: TUpdateAction = useCallback(async <PathType extends TObjectPath<FSettings>,>(
        Path: PathType,
        Value: TTypeFromPath<PathType, FSettings>
    ): Promise<void> =>
    {
        const NewSettings: FAppSettings = { ...RealSettings };
        const NewSettingsRef: TRef<FAppSettings> = MakeRef<FAppSettings>();
        NewSettingsRef.Ref = NewSettings;
        SetPropertyFromPath(NewSettingsRef, Path, Value);
        SetOptimisticSettings(NewSettings);
        const Result: TIpcState<"UpdateSettings"> = await SendIpcEvent("UpdateSettings", NewSettings);
        if (IsSuccessful(Result))
        {
            SetRealSettings(NewSettings);
        }
        else
        {
            await Delay(1500);
            SetOptimisticSettings(RealSettings);
            DispatchFailureToast({ intent: "error" });
        }
    }, [ DispatchFailureToast, RealSettings, SendIpcEvent, SetOptimisticSettings ]);

    const UpdateManyFunction: TUpdateManyFunction =
        <PathType extends TObjectPath<FSettings>,>(
            ...Pairs: Array<TUpdateTuple<PathType>>
        ): void =>
        {
            StartTransition(async (): Promise<void> =>
            {
                await Promise.all(Pairs.map(({ Path, Value }: TUpdateTuple<PathType>): Promise<void> =>
                {
                    return UpdateAction(Path, Value);
                }));
            });
        };

    const UpdateFunction: TUpdateFunction =
        <PathType extends TObjectPath<FSettings>,>(
            Path: PathType,
            Value: TTypeFromPath<PathType, FSettings>
        ): void =>
        {
            StartTransition((): Promise<void> =>
            {
                return UpdateAction(Path, Value);
            });
        };

    const value: CSettings =
    {
        INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:
        {
            IsPending,
            OptimisticSettings,
            RealSettings,
            StartTransition,
            UpdateFunction,
            UpdateManyFunction
        }
    };

    return (
        <SettingsContext.Provider { ...{ value } }>
            { children }
        </SettingsContext.Provider>
    );
};
