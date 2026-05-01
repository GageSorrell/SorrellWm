/**
 * @file      Settings.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
import {
    Delay,
    GetPropertyFromPath,
    MakeRef,
    SetPropertyFromPath,
    type TRef } from "../Shared/Utility";
import type { FLogger, FSettings, FSimpleCallback } from "../Shared";
import type {
    FSettingsPath,
    FUseSettingsStateReturnType,
    TControlledProps,
    TGetSetting,
    TUseSettingStateReturnType
} from "./Settings.Types";
// import { IsSuccessful, UseSendIpcEvent, UseSendIpcEventDeferred } from "./Event.tsx.old";
import { Toast, ToastTitle, ToastTrigger } from "@fluentui/react-components";
import { UseSendEvent, UseSendEventDeferred } from "./Event";
import { Button } from "./Domain/Common";
import { DefaultSettings } from "../Shared/Settings";
import { GetLogger } from "./Log";
import { Identity } from "@sorrell/utilities/functional";
import type { TInternal } from "./Utility";
import type { TPath } from "../Shared/Utility/Object.Types";
import type { TSetState } from "@sorrell/react";
import { UseToaster } from "./Toast";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Settings");

type TUpdateFunction = <PathType extends FSettingsPath,>(
    Path: PathType,
    Value: TGetSetting<PathType>
) => void;

type TUpdateAction = <PathType extends FSettingsPath,>(
    Path: PathType,
    Value: TGetSetting<PathType>
) => Promise<void>;

type TUpdateTuple<PathType extends FSettingsPath = FSettingsPath,> =
    {
        Path: PathType;
        Value: TGetSetting<PathType>;
    };

type TUpdateManyFunction = <PathType extends FSettingsPath,>(
    ...Pairs: Array<TUpdateTuple<PathType>>
) => void;

export type CSettings =
    TInternal<{
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

export const UseSettingState = <PathType extends TPath<FSettings>,>(
    Path: PathType
): TUseSettingStateReturnType<PathType> =>
{
    type FSetting = TGetSetting<PathType>;
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
    const GetControlledProps = <PathType extends FSettingsPath,>(
        Path: PathType
    ): TControlledProps<TGetSetting<PathType>> =>
    {
        type FControlledType = TGetSetting<PathType>;

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
    const { Data, IsPending: IsGetSettingsPending } = UseSendEvent("GetSettings");
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
    const [ SendIpcEvent ] = UseSendEventDeferred();

    const onMouseDown: FSimpleCallback = useCallback((): void =>
    {
        SendIpcEvent("RequestRestart");
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

    const [ SendEvent ] = UseSendEventDeferred();

    const [ DispatchFailureToast ] = UseToaster(SettingsFailureToast);

    const UpdateAction: TUpdateAction = useCallback(async <PathType extends FSettingsPath,>(
        Path: PathType,
        Value: TGetSetting<PathType>
    ): Promise<void> =>
    {
        const NewSettings: FSettings = { ...RealSettings };
        const NewSettingsRef: TRef<FSettings> = MakeRef<FSettings>();
        NewSettingsRef.Ref = NewSettings;
        SetPropertyFromPath(NewSettingsRef, Path, Value);
        SetOptimisticSettings(NewSettings);
        // const Result: TSendEventDeferredReturnType<"UpdateSettings", IFrontendEventRegistrar> =
        // const Result: any =
        //     await SendEvent("UpdateSettings", NewSettings);

        // if (IsEventSuccess(Result))
        // @TODO Temporary.
        if (true)
        {
            SetRealSettings(NewSettings);
        }
        else
        {
            await Delay(1500);
            SetOptimisticSettings(RealSettings);
            DispatchFailureToast({ intent: "error" });
        }
    }, [ DispatchFailureToast, RealSettings, SendEvent, SetOptimisticSettings ]);

    const UpdateManyFunction: TUpdateManyFunction =
        <PathType extends FSettingsPath,>(
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
        <PathType extends FSettingsPath,>(
            Path: PathType,
            Value: TGetSetting<PathType>
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
