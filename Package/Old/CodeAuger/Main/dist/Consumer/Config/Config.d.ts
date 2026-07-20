/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { CodeFormatter } from "./Config.Types.js";
import type { ConfigSchema } from "../../Shared/Config/Config.Types.ts";
import { Schema as EffectSchema } from "effect";
export declare const CodeFormatters: ReadonlyArray<CodeFormatter>;
export declare const Provider: EffectSchema.Struct<{
    readonly Enabled: EffectSchema.Boolean;
    readonly Watch: EffectSchema.optionalKey<EffectSchema.Boolean>;
}>;
export declare const Schema: EffectSchema.Struct<{
    readonly $Schema: EffectSchema.Literal<"code-auger/schema">;
    readonly BasePath: EffectSchema.NonEmptyString;
    readonly DisabledFormatters: EffectSchema.optionalKey<EffectSchema.$Array<EffectSchema.Literals<readonly CodeFormatter[]>>>;
    readonly PrependedLines: EffectSchema.optionalKey<EffectSchema.$Array<EffectSchema.String>>;
    readonly PrependedLinesOrder: EffectSchema.optionalKey<EffectSchema.Literals<readonly ["before", "after"]>>;
    readonly Providers: EffectSchema.$Record<EffectSchema.String, EffectSchema.Union<readonly [EffectSchema.Struct<{
        readonly Enabled: EffectSchema.Boolean;
        readonly Watch: EffectSchema.optionalKey<EffectSchema.Boolean>;
    }>, EffectSchema.Boolean]>>;
    readonly TsConfigPath: EffectSchema.NonEmptyString;
}>;
/**
 * The config of a given provider package specifies the types and export paths
 * relevant to generating the augmenting module for consumers that use the given
 * provider.
 */
export type Config = ConfigSchema<typeof Schema.Type>;
//# sourceMappingURL=Config.d.ts.map