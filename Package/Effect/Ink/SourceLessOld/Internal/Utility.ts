/**
 * Internal, general-purpose utilities for {@link \@sorrell/effect-ink}.
 *
 * @module @sorrell/effect-ink/Internal/Utility
 * @internal
 */

import { Record, Result } from "effect";

/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const ApplyOptional = <SourceType extends object>(
    OutName: string,
    Source: SourceType,
    PropertyName: keyof SourceType
/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
): { [ Key in typeof OutName ]: typeof Source[typeof PropertyName]; } | { } =>
{
    return PropertyName in Source
        ? { [ OutName ]: Source[PropertyName] }
        : { };
};

export const ApplyOptionalMany = <
    SourceType extends object
>(
    Source: SourceType,
    Mapping: Record<string, keyof typeof Source>
) =>
{
    return Record.filterMap(Mapping, (Value: keyof SourceType, _Key: keyof typeof Mapping) =>
    {
        return Value in Source
            ? Result.succeed(Value)
            : Result.failVoid;
    });
};

export type Untagged<Type extends object> = Omit<Type, "_tag">;
