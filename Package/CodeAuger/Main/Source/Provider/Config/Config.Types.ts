/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * A basic description of a given type that `code-auger` uses to augment a provider's
 * "type registry" with consumer-defined types.
 *
 * @property {string} Name - The name of the type that is exported by the provider.
 * @property {string} Path - The path specified in the provider's `package.json`
 * `"exports"` property (*i.e.*, the relevant property *key*) from which the interface
 * to augment is exported.
 */
export type ExportedType =
    Readonly<{
        Name: string;
        Path: string;
    }>;

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
export type Config =
    Readonly<{
        Interface: ExportedType;
        GenericProperty: ExportedType;
    }>;
