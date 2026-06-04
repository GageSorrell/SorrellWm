/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Config as EffectConfig, pipe } from "@sorrell/effect";
import { Code } from "@sorrell/cli-utilities/format";
import { IsValidTypeName } from "@sorrell/utilities/type";
import { Param } from "effect/unstable/cli";

/**
 * Determine whether a given {@link CodeAugerProperty} of a provider's `package.json` is valid.
 *
 * @param CodeAugerProperty - The `"code-auger"` property of a provider's `package.json`.
 *
 * @returns {In is ExportedType} Whether the given {@link CodeAugerProperty} of a provider is valid.
 */
export function IsValid(CodeAugerProperty: unknown): CodeAugerProperty is Config
{
    return (
        typeof CodeAugerProperty === "object" &&
        CodeAugerProperty !== null &&
        "Interface" in CodeAugerProperty &&
        "GenericProperty" in CodeAugerProperty &&
        typeof CodeAugerProperty.Interface === "string" &&
        typeof CodeAugerProperty.GenericProperty === "string" &&
        IsValidTypeName(CodeAugerProperty.Interface) &&
        IsValidTypeName(CodeAugerProperty.GenericProperty)
    );
}

/* eslint-disable @typescript-eslint/typedef */

export const ExportedType: EffectConfig.Config<ExportedType> = EffectConfig.all({
    Name: pipe(
        EffectConfig.nonEmptyString("name"),
        EffectConfig.withDescription(
            `The ${ Code("export") }ed name of the ${ Code("type") }/${ Code("interface") } ` +
            "described by this."
        )
    ),
    Path: pipe(
        EffectConfig.nonEmptyString("path"),
        EffectConfig.withDescription(
            ""
            // `The path specified in the provider's ${ Code("package.json") } ${ Code("\"exports\"") } ` +
            // `property (${ Chalk.italic("i.e.") }, the relevant property ${ Chalk("key") } from ` +
            // `which the interface to augment is ${ Code("export") }ed.`
        )
    )
});

export const Config: EffectConfig.Config<Config> = EffectConfig.all({
    GenericProperty: pipe(
        ExportedType,
        EffectConfig.nested("genericProperty"),
        EffectConfig.withDescription(
            ""
            // `The name of the generic ${ Code("type") } that the provider exports, ` +
            // `such that ${ Chalk.italic("concrete") } ${ Code("type") }s defined by the ` +
            // `consumer with this ${ Code("type") } will be used to augment the provider's ` +
            // `${ Code("interface") }.`
        )
    ),
    Interface: pipe(
        ExportedType,
        EffectConfig.nested("interface"),
        EffectConfig.withDescription(
            `The exported ${ Code("interface") } that is augmented with properties ` +
            "whose types are derived from the (generic) property type given by the other " +
            "property in this object."
        )
    ),
    "~Schema": pipe(
        EffectConfig.nonEmptyString("$schema"),
        EffectConfig.withDefault("code-auger/provider/schema"),
        EffectConfig.withDescription(
            `The ${ Code("JSON") } schema for this config file.`
        )
    )
});

/* eslint-enable @typescript-eslint/typedef */

/**
 * The config of a given provider package specifies the types and export paths
 * relevant to generating the augmenting module for consumers that use the given
 * provider.
 *
 * @property {ExportedType} Interface - The {@link ExportedType | exported interface} that
 * is augmented with properties whose types are derived from the
 * {@link GenericProperty | (generic) property type}.
 *
 * @property {ExportedType} GenericProperty - The name of the generic type that the
 * provider exports, such that concrete types defined by the consumer with this type
 * will be used to augment the provider's {@link Interface!Name}.
 */
export interface Config
{
    readonly Interface: ExportedType;
    readonly GenericProperty: ExportedType;
    readonly "~Schema": string;
}

/**
 * A basic description of a given type that `code-auger` uses to augment a provider's
 * "type registry" with consumer-defined types.
 *
 * @property {string} Name - The name of the type that is exported by the provider.
 * @property {string} Path - The path specified in the provider's `package.json`
 * `"exports"` property (*i.e.*, the relevant property *key*) from which the interface
 * to augment is exported.
 */
export interface ExportedType
{
    readonly Name: string;
    readonly Path: string;
}
