/**
 *
 *
 * @module @sorrell/effect-ink/Component/Primitive/Branded
 * @internal
 *
 * @file      Branded.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Color from "../../Color.ts";
import { Record, Result } from "effect";
import type { Theme } from "../index.ts";

type BrandedPropKey =
    | "backgroundColor"
    | "borderStyle"
    | "color";

const BrandedPropKey: ReadonlyArray<BrandedPropKey> =
    [
        "backgroundColor",
        "borderStyle",
        "color"
    ] as const;

type BrandedRecord =
    {
        readonly backgroundColor: Color.Color;
        readonly color: Color.Color;
        readonly borderStyle: Theme.BorderStyle;
    };

export type OmitBrandedProps<PropsType> = Omit<PropsType, BrandedPropKey>;
export type ExtractBrandedProps<PropsType> = Extract<PropsType, BrandedPropKey>;
export type Make<PropsType> =
    {
        [ Key in keyof PropsType ]?: Key extends BrandedPropKey
            ? BrandedRecord[Key]
            : PropsType[Key];
    };

export type SplitProps<in out PropsType> =
    {
        readonly Extracted: ExtractBrandedProps<PropsType>;
        readonly Omitted: OmitBrandedProps<PropsType>;
    };

export const SplitPropsByBranded = <const PropsType extends object,>(
    Props: PropsType
): Readonly<SplitProps<typeof Props>> =>
{
    const Extracted: Partial<ExtractBrandedProps<typeof Props>> = { };

    const EquipWithBrandedProp = (PropName: string): void =>
    {
        if (PropName in Props)
        {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (Extracted as any)[PropName] = (Props as any)[PropName];
        }
    };

    BrandedPropKey.forEach(EquipWithBrandedProp);

    type ReadonlyPropsType = Record.ReadonlyRecord<
        Exclude<keyof typeof Props, number | symbol>,
        typeof Props[keyof typeof Props]
    >;

    const Omitted: OmitBrandedProps<typeof Props> = Record.filterMap(Props as ReadonlyPropsType, (
        Input: ReadonlyPropsType[keyof ReadonlyPropsType],
        Key: keyof ReadonlyPropsType
    ): Result.Result<never, void> | Result.Result<ReadonlyPropsType[keyof ReadonlyPropsType]> =>
    {
        return BrandedPropKey.includes(Key as BrandedPropKey)
            ? Result.failVoid
            : Result.succeed(Input);
    }) as unknown as OmitBrandedProps<typeof Props>;

    return {
        Extracted: Extracted as ExtractBrandedProps<typeof Props>,
        Omitted: Omitted as OmitBrandedProps<typeof Props>
    } as const;
};
