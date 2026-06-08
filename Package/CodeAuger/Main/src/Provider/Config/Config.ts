/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { $SchemaKey } from "../../Shared/Config/Config.ts";
import { Code } from "@sorrell/cli-utilities/format";
import type { ConfigSchema } from "../../Shared/Config/Config.Types.ts";
import { Schema as EffectSchema } from "effect";

/* eslint-disable @typescript-eslint/typedef */

export/**
       * A basic description of a given type that `code-auger` uses to augment a provider's
       * "type registry" with consumer-defined types.
       */
const ExportedType = EffectSchema.Struct({
    Name: EffectSchema.NonEmptyString.annotateKey({
        description: (
            `The ${ Code("export") }ed name of the ${ Code("type") }/${ Code("interface") } ` +
            "described by this."
        ),
        title: "name"
    }),
    Path: EffectSchema.NonEmptyString.annotateKey({
        description: (
            "The path specified in the provider's `package.json` \"exports\" " +
            "property, *i.e.*, the relevant property key from which the interface " +
            "to augment is exported."
        ),
        title: "path"
    }).annotate({
        description: (
            "A basic description of a given type that `code-auger` uses to augment a provider's " +
            "\"type registry\" with consumer-defined types."
        ),
        identifier: "ExportedType"
    })
});

export/**
       * The config of a given provider package specifies the types and export paths
       * relevant to generating the augmenting module for consumers that use the given
       * provider.
       */
const Schema = EffectSchema.Struct({
    [ $SchemaKey ]: EffectSchema.Literal("code-auger/provider/schema")
        .annotateKey({
            default: "code-auger/provider/schema",
            description: "The JSON schema for this config file.",
            title: "$schema"
        }),
    GenericProperty: ExportedType
        .annotateKey({
            description: (
                "The name of the generic type that the provider exports, such that *concrete* " +
                "types defined by the consumer with this type will be used to augment the provider's " +
                "interface."
            ),
            title: "genericProperty"
        }),
    Interface: ExportedType
        .annotateKey({
            description: (
                "The exported interface that is augmented with properties whose types are derived from the " +
                "(generic) property type given by the other property in this object."
            ),
            title: "interface"
        })
}).annotate({
    description: (
        "The configuration that informs `code-auger` how it should generate the module augmentation for " +
        "your provider package."
    ),
    identifier: "Config",
    title: "code-auger.provider.json"
});

/* eslint-enable @typescript-eslint/typedef */

/**
 * The config of a given provider package specifies the types and export paths
 * relevant to generating the augmenting module for consumers that use the given
 * provider.
 */
export type Config = ConfigSchema<typeof Schema.Type>;
