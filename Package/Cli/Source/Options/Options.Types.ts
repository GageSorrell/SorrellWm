/**
 * @file      Options.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Options } from "@effect/cli";

type FRequirementsBase =
    {
        [ Key: string ]:
            | Args.Args<unknown>
            | Options.Options<unknown>
    };

// type THandleRequirements<RequirementsType extends Partial<FRequirementsBase>> =
//     FGlobalRequirements extends RequirementsType
//         ? FGlobalRequirements
//         : [ Extract<keyof RequirementsType, keyof FGlobalRequirements> ] extends [ never ]
//         ? {
//             [ Key in keyof RequirementsType ]: RequirementsType[Key];
//         }
//         : never;

export type FGlobalRequirements =
    {
        Silent: Options.Options<boolean>;
    };

export type TRequirementsArgument<RequirementsType extends TRequirements> =
    {
        [ Key in keyof RequirementsType ]:
            RequirementsType[Key] extends Options.Options<infer Type>
                ? Type
                : RequirementsType[Key] extends Args.Args<infer Type>
                    ? Type
                    : never;
    };

export type TRequirements<RequirementsType extends FRequirementsBase = FGlobalRequirements> =
    FGlobalRequirements &
    RequirementsType;

export type Config<RequirementsType extends TRequirements> =
    {
        readonly [ Key in keyof RequirementsType ]: RequirementsType[Key] extends Args.Args<unknown> | Options.Options<unknown>
            ? RequirementsType[Key]
            : never;
    };

export type ConfigArgument<RequirementsType extends TRequirements> =
    {
        readonly [ Key in keyof RequirementsType as Key extends keyof FGlobalRequirements ? never : Key ]: Config<RequirementsType>[Key]
    };
