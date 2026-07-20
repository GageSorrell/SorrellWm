/**
 * An HOC that limits a given component to a single character in the terminal.
 * The HOC can be configured to either clip the given component, or display a fallback
 * character when the given component is larger than one character.
 *
 * @module @sorrell/effect-ink/Component/SingleWidthComponent
 *
 * @file      SingleWidthComponent.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Brand, Option } from "effect";
import StringWidth from "string-width";
import { dual } from "effect/Function";

export interface SingleCellFallbackOptions<Props extends object>
{
    readonly Fallback?: string;
    readonly GetMeasurementKey?: (Properties: Props) => React.Key | undefined;
}

const GetDisplayName = <PropsType,>(Component: React.ComponentType<PropsType>): string =>
{
    return Component.displayName ?? Component.name ?? "Component";
};

const GetSafeFallback = (Fallback: string): string =>
{
    if (!Fallback.includes("\n") && StringWidth(Fallback) === 1)
    {
        return Fallback;
    }

    return "×";
};


export type SingleWidthComponent<PropsType extends object = { }> =
    Brand.Branded<React.FC<PropsType>, "SingleWidthComponent">;


const SingleWidthComponent = <const PropsType extends object,>(In: React.FC<PropsType>) =>
{
    return Brand.nominal<SingleWidthComponent<PropsType>>()(In);
};

export const MakeSingleWidth: {
    <PropsType extends object,>(
        Options: SingleCellFallbackOptions<PropsType>,
        WrappedComponent: React.FC<PropsType>
    ): SingleWidthComponent<PropsType>;

    <PropsType extends object,>(
        Options?: SingleCellFallbackOptions<PropsType>
    ): (WrappedComponent: React.FC<PropsType>) => SingleWidthComponent<PropsType>;
} = dual(2, <Props extends object,>(
    Options: SingleCellFallbackOptions<Props> = { },
    WrappedComponent: React.FC<Props>
): React.FC<Props> =>
{
    const Fallback: string = GetSafeFallback(Options.Fallback ?? "×");

    const ComponentWithSingleCellFallback = (Props: Props) =>
    {
        const BoxReference: React.RefObject<Ink.DOMElement | null> =
            React.useRef<Ink.DOMElement | null>(null);

        const [ IsSingleWidth, SetIsSingleWidth ] = React.useState<Option.Option<boolean>>(Option.none());

        const MeasurementKey: React.Key | undefined = Options.GetMeasurementKey?.(Props);

        React.useEffect((): void =>
        {
            SetIsSingleWidth(Option.none());
        }, [ MeasurementKey ]);

        React.useLayoutEffect(() =>
        {
            if (BoxReference.current === null)
            {
                return;
            }

            const Measurement: { height: number; width: number; } =
                Ink.measureElement(BoxReference.current);

            const NextIsSingleWidth: Option.Option<boolean> =
                Option.some(Measurement.width <= 1 && Measurement.height <= 1);

            SetIsSingleWidth(NextIsSingleWidth);
        }, [ ]);

        if (IsSingleWidth.valueOrUndefined !== true)
        {
            return <Ink.Text>{ Fallback }</Ink.Text>;
        }

        return (
            <Ink.Box
                flexShrink={ 0 }
                ref={ BoxReference }>
                <WrappedComponent { ...Props } />
            </Ink.Box>
        );
    };

    ComponentWithSingleCellFallback.displayName =
        `WithSingleCellFallback(${ GetDisplayName(WrappedComponent) })`;

    return ComponentWithSingleCellFallback;
});
