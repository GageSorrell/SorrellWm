/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TFromPath, TPath } from "@sorrell/utilities/record";
import type { FSettings } from "../Shared";
import type { THandler } from "@sorrell/react";

export type TUseSettingStateReturnType<PathType extends TPath<FSettings>> =
    readonly [
        TFromPath<FSettings, PathType>,
        THandler<TFromPath<FSettings, PathType>>
    ];

export type FSettingsHandlerFactory = <PathType extends TPath<FSettings>>(
    Path: PathType
) => TControlledProps<TFromPath<FSettings, PathType>>;

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
export type TGetSetting<PathType extends FSettingsPath> = TFromPath<FSettings, PathType>;
