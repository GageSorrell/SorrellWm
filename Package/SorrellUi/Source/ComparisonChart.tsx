/**
 * A small SVG line/area chart comparing up to a few series, with a "draw in" reveal
 * animation the first time it scrolls into view.
 *
 * @module @sorrell/ui/ComparisonChart
 *
 * @file      ComparisonChart.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useEffect, useId, useRef, useState } from "react";
import type * as React from "react";

import { Cn } from "./ClassName.js";

const ObserverThreshold = 0.35;
const HorizontalGridLineCount = 5;
const VerticalGridLineCount = 3;

const AxisLabelClassName = "font-mono text-[10px] tracking-wide text-zinc-400/75 uppercase";

/** A single line/area series in a {@link ComparisonChart}. */
export interface ComparisonSeries
{
    /** SVG path `d` for the filled area under the line (should close back to the baseline). */
    readonly areaPath: string;
    /** CSS color, e.g. `"rgb(239 68 68)"`. */
    readonly color: string;
    /** Length of the drawn stroke, used as both `stroke-dasharray` and the reveal distance. */
    readonly dashLength: number;
    readonly label: string;
    /** SVG path `d` for the line itself. */
    readonly linePath: string;
}

/** Props for {@link ComparisonChart}. */
export interface ComparisonChartProps
{
    readonly className?: string;
    readonly description: string;
    readonly height?: number;
    readonly series: ReadonlyArray<ComparisonSeries>;
    readonly title: string;
    readonly width?: number;
    readonly xAxisEndLabel?: string;
    readonly xAxisStartLabel?: string;
}

/**
 * @category Component
 * @since 1.0.0
 */
export const ComparisonChart = (
    {
        className: ClassName,
        description: Description,
        height: Height = 140,
        series: Series,
        title: Title,
        width: Width = 400,
        xAxisEndLabel: XAxisEndLabel,
        xAxisStartLabel: XAxisStartLabel
    }: ComparisonChartProps
): React.JSX.Element =>
{
    const TitleId = useId();
    const DescriptionId = useId();
    const ContainerRef = useRef<HTMLDivElement>(null);
    const [ IsInView, SetIsInView ] = useState(false);

    useEffect(() =>
    {
        const Container = ContainerRef.current;

        if (Container === null)
        {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        {
            SetIsInView(true);
            return;
        }

        const Observer = new IntersectionObserver((Entries) =>
        {
            const [ Entry ] = Entries;

            if (Entry?.isIntersecting !== true)
            {
                return;
            }

            SetIsInView(true);
            Observer.disconnect();
        }, { threshold: ObserverThreshold });

        Observer.observe(Container);

        return () =>
        {
            Observer.disconnect();
        };
    }, []);

    const HorizontalGridLines = Array.from(
        { length: HorizontalGridLineCount },
        (_Value, Index) => (Height / (HorizontalGridLineCount - 1)) * Index
    );
    const VerticalGridLines = Array.from(
        { length: VerticalGridLineCount },
        (_Value, Index) => (Width / (VerticalGridLineCount + 1)) * (Index + 1)
    );

    return (
        <div className={ Cn("block w-full", ClassName) }
            data-in-view={ IsInView }
            ref={ ContainerRef }>
            <div className="relative h-36 w-full overflow-hidden md:h-44">
                <svg aria-labelledby={ `${ TitleId } ${ DescriptionId }` }
                    className="h-full w-full"
                    preserveAspectRatio="none"
                    role="img"
                    viewBox={ `0 0 ${ Width } ${ Height }` }>
                    <title id={ TitleId }>{ Title }</title>
                    <desc id={ DescriptionId }>{ Description }</desc>

                    <defs>
                        {
                            Series.map((SeriesItem) =>
                                (
                                    <linearGradient id={ `${ TitleId }-${ SeriesItem.label }-area` }
                                        key={ SeriesItem.label }
                                        x1="0%"
                                        x2="0%"
                                        y1="0%"
                                        y2="100%">
                                        <stop offset="0%"
                                            stopColor={ SeriesItem.color }
                                            stopOpacity="0.12" />
                                        <stop offset="100%"
                                            stopColor={ SeriesItem.color }
                                            stopOpacity="0" />
                                    </linearGradient>
                                ))
                        }
                    </defs>

                    {
                        HorizontalGridLines.map((Y) =>
                            (
                                <line className="sorrell-ui-chart-grid-line"
                                    key={ `h-${ Y }` }
                                    stroke="rgb(39 39 42 / 0.5)"
                                    strokeWidth="0.8"
                                    x1="0"
                                    x2={ Width }
                                    y1={ Y }
                                    y2={ Y } />
                            ))
                    }

                    {
                        VerticalGridLines.map((X) =>
                            (
                                <line className="sorrell-ui-chart-grid-line"
                                    key={ `v-${ X }` }
                                    stroke="rgb(39 39 42 / 0.35)"
                                    strokeWidth="0.8"
                                    x1={ X }
                                    x2={ X }
                                    y1="0"
                                    y2={ Height } />
                            ))
                    }

                    {
                        Series.map((SeriesItem) =>
                            (
                                <path className="sorrell-ui-chart-area"
                                    d={ SeriesItem.areaPath }
                                    fill={ `url(#${ TitleId }-${ SeriesItem.label }-area)` }
                                    key={ `area-${ SeriesItem.label }` } />
                            ))
                    }

                    {
                        Series.map((SeriesItem, Index) =>
                            (
                                <path className="sorrell-ui-chart-line"
                                    d={ SeriesItem.linePath }
                                    fill="none"
                                    key={ `line-${ SeriesItem.label }` }
                                    stroke={ SeriesItem.color }
                                    strokeDasharray={ SeriesItem.dashLength }
                                    strokeDashoffset={ IsInView ? 0 : SeriesItem.dashLength }
                                    strokeLinecap="round"
                                    strokeWidth="1.2"
                                    style={ { transitionDelay: `${ Index * 0.12 }s` } } />
                            ))
                    }
                </svg>
            </div>

            {
                XAxisStartLabel !== undefined || XAxisEndLabel !== undefined ?
                    <div className="mt-3 flex justify-between">
                        <span className={ AxisLabelClassName }>{ XAxisStartLabel }</span>
                        <span className={ AxisLabelClassName }>{ XAxisEndLabel }</span>
                    </div> :
                    undefined
            }

            <div className="mt-5 flex items-center justify-center gap-6">
                {
                    Series.map((SeriesItem) =>
                        (
                            <div className="flex items-center gap-1.5"
                                key={ SeriesItem.label }>
                                <div className="h-1.5 w-1.5 rounded-full"
                                    style={ { backgroundColor: SeriesItem.color } } />
                                <span className="font-mono text-xs text-zinc-400 uppercase">
                                    { SeriesItem.label }
                                </span>
                            </div>
                        ))
                }
            </div>
        </div>
    );
};
