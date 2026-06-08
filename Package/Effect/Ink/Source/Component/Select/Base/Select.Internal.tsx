/**
 * @file      Select.Internal.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Box, Text } from "ink";
import type { IndicatorProps, ItemProps } from "./Select.Internal.Types.ts";
import type { ReactNode } from "react";

export function Indicator({ isSelected = false }: IndicatorProps): ReactNode
{
    return (
        <Box marginRight={ 1 }>
            {
                isSelected
                    ? <Text color="blue">o</Text>
                    : <Text>{ }</Text>
            }
        </Box>
    );
}

export function SelectItem({
    // description,
    // disabled,
    isSelected = false,
    // shortDescription,
    title
}: ItemProps): ReactNode
{
    return (
        <Text
            { ...(isSelected ? { color: "blue" } : { }) }>
            { title }
        </Text>
    );
}

export function ToRotated<ElementType>(
    array: ReadonlyArray<ElementType>,
    steps: number
): Array<ElementType>
{
    if (!Number.isSafeInteger(steps))
    {
        throw new TypeError(`The \`steps\` parameter must be an integer, got ${steps}.`);
    }

    const { length } = array;
    if (length === 0)
    {
        return [ ...array ];
    }

    const NormalizedSteps: number = ((steps % length) + length) % length;
    if (NormalizedSteps === 0)
    {
        return [ ...array ];
    }

    return [
        ...array.slice(-NormalizedSteps),
        ...array.slice(0, -NormalizedSteps)
    ];
}
