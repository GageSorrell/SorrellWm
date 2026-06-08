/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { ConfigSchema } from "../../Shared/Config/Config.Types.ts";
import { Schema as EffectSchema } from "effect";
export declare const ExportedType: EffectSchema.Struct<{
    readonly Name: EffectSchema.NonEmptyString;
    readonly Path: EffectSchema.NonEmptyString;
}>;
export declare const Schema: EffectSchema.Struct<{
    readonly $Schema: EffectSchema.Literal<"code-auger/provider/schema">;
    readonly GenericProperty: EffectSchema.Struct<{
        readonly Name: EffectSchema.NonEmptyString;
        readonly Path: EffectSchema.NonEmptyString;
    }>;
    readonly Interface: EffectSchema.Struct<{
        readonly Name: EffectSchema.NonEmptyString;
        readonly Path: EffectSchema.NonEmptyString;
    }>;
}>;
/**
 * The config of a given provider package specifies the types and export paths
 * relevant to generating the augmenting module for consumers that use the given
 * provider.
 */
export type Config = ConfigSchema<typeof Schema.Type>;
//# sourceMappingURL=Config.d.ts.map