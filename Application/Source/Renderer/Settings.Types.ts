/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TPath, TGetType } from "../Shared/Utility/Object.Types";
import type { FSettings } from "../Shared";
import type { THandler } from "./Utility";

export type TUseSettingStateReturnType<PathType extends TPath<FSettings>> = Readonly<[
    TGetType<FSettings, PathType>,
    THandler<TGetType<FSettings, PathType>>
]>;

export type FSettingsHandlerFactory = <PathType extends TPath<FSettings>>(
    Path: PathType
) => TControlledProps<TGetType<FSettings, PathType>>;

export type TControlledProps<Type, PropertyNameType extends string = "Value"> =
{
    [ Key in `OnChange${ PropertyNameType }` ]: THandler<Type>;
} &
{
    [ Key in PropertyNameType ]: Type;
};

export type FUseSettingsStateReturnType = Readonly<[
    GetControlledProps: FSettingsHandlerFactory,
    Settings: FSettings
]>;

export type FSettingsPath = TPath<FSettings>;
export type TGetSetting<PathType extends FSettingsPath> = TGetType<FSettings, PathType>;
