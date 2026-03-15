/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FSettings, TObjectPath, TTypeFromPath } from "../Shared";
import type { THandler } from "./Utility";

export type TUseSettingStateReturnType<PathType extends string> = Readonly<[
    TTypeFromPath<PathType, FSettings>,
    THandler<TTypeFromPath<PathType, FSettings>>
]>;

export type FSettingsHandlerFactory = <PathType extends TObjectPath<FSettings>>(
    Path: PathType
) => TControlledProps<TTypeFromPath<PathType, FSettings>>;

export type TControlledProps<Type> =
{
    OnChangeValue: THandler<Type>;
    Value: Type;
};

export type FUseSettingsStateReturnType = Readonly<[
    GetControlledProps: FSettingsHandlerFactory,
    Settings: FSettings
]>;
