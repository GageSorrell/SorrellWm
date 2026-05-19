/**
 * @file      Config.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type EnsureCustomOptions<
    KeyType extends string,
    OptionsType extends Record<string, unknown>
> =
    Extract<keyof OptionsType, KeyType> extends never
        ? OptionsType
        : never;

