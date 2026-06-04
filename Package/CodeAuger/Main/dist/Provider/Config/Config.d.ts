/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Config as EffectConfig } from "effect";
/**
 * Determine whether a given {@link CodeAugerProperty} of a provider's `package.json` is valid.
 *
 * @param CodeAugerProperty - The `"code-auger"` property of a provider's `package.json`.
 *
 * @returns {In is ExportedType} Whether the given {@link CodeAugerProperty} of a provider is valid.
 */
export declare function IsValid(CodeAugerProperty: unknown): CodeAugerProperty is Config;
export declare const ExportedType: EffectConfig.Config<ExportedType>;
export declare const Config: EffectConfig.Config<Config>;
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
export interface Config {
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
export interface ExportedType {
    readonly Name: string;
    readonly Path: string;
}
//# sourceMappingURL=Config.d.ts.map