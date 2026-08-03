/**
 * Render Latex mathematics as a Sixel image.
 *
 * @module @sorrell/ink-ui/Latex
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import MathJax, { type MathJaxApi } from "mathjax";
import {
    Svg,
    type SvgFallback,
    type SvgProps
} from "../Svg/Svg.tsx";
import { pathToFileURL } from "node:url";
import { useTheme } from "../Theme.tsx";

/** {@inheritDoc Latex} */
export interface LatexProps extends Omit<SvgProps, "children">
{
    /** Raw tex source, such as `String.raw` followed by `\\frac{a}{b}`. */
    readonly children: string;
    /** SVG `currentColor` used by the generated formula. */
    readonly color?: string | undefined;
    /** Use display-math layout. Defaults to `true`. */
    readonly display?: boolean | undefined;
}

interface RenderResult
{
    readonly Error?: Error;
    readonly Key: string;
    readonly Svg?: string;
}

let Initialization: Promise<MathJaxApi> | undefined;

/** Render raw tex through MathJax and display its SVG output using Sixel. */
export function Latex(Props: LatexProps): React.ReactElement | null
{
    const {
        children,
        color,
        display = true,
        fallback,
        rasterization = "crisp",
        ...SizeProps
    } = Props;
    const Theme = useTheme();
    const FormulaColor: string = color ?? Theme.Text;
    const Key: string = `${ display ? "display" : "inline" }\u0000${ FormulaColor }\u0000${ children }`;
    const [ Result, SetResult ] = React.useState<RenderResult>();

    React.useEffect(() =>
    {
        let Cancelled: boolean = false;

        void RenderFormula(children, display, FormulaColor)
            .then((SvgValue: string) =>
            {
                if (!Cancelled)
                {
                    SetResult({ Key, Svg: SvgValue });
                }
            })
            .catch((ErrorValue: unknown) =>
            {
                if (!Cancelled)
                {
                    SetResult({ Error: ToError(ErrorValue), Key });
                }
            });

        return () =>
        {
            Cancelled = true;
        };
    }, [ children, display, FormulaColor, Key ]);

    if (Result?.Key !== Key)
    {
        return null;
    }
    if (Result.Error !== undefined)
    {
        return RenderFallback(fallback, Result.Error);
    }
    if (Result.Svg === undefined)
    {
        return null;
    }

    return (
        <Svg
            { ...SizeProps }
            { ...(fallback === undefined ? { } : { fallback }) }
            rasterization={ rasterization }>
            { Result.Svg }
        </Svg>
    );
}

const RenderFormula = async (
    Source: string,
    Display: boolean,
    Color: string
): Promise<string> =>
{
    const Api: MathJaxApi = await GetMathJax();
    const Container: unknown = await Api.tex2svgPromise(Source, { display: Display });
    const SvgNode: unknown | null = Api.startup.adaptor.firstChild(Container);

    if (SvgNode === null)
    {
        throw new Error("MathJax did not produce an SVG element.");
    }

    const Markup: string = Api.startup.adaptor.serializeXML(SvgNode);
    if (!/^<svg(?:\s|>)/u.test(Markup))
    {
        throw new Error("MathJax produced an invalid SVG document.");
    }

    return ImproveMathSvg(Markup, Color);
};

const DefaultRenderScale = 1.5;
const DefaultStrokeWidth = 24;

/** Increase MathJax's intrinsic raster resolution and reinforce its thin vector outlines. */
const ImproveMathSvg = (Markup: string, Color: string): string =>
{
    const RootEnd: number = Markup.indexOf(">");
    if (RootEnd < 0)
    {
        return Markup;
    }
    const Root: string = Markup.slice(0, RootEnd)
        .replace(/\b(width|height)="([\d.]+)([a-z%]+)"/giu,
            (_Match: string, Name: string, Value: string, Unit: string): string =>
                `${ Name }="${ Number(Value) * DefaultRenderScale }${ Unit }"`)
        .replace(/^<svg/u,
            `<svg color="${ EscapeXmlAttribute(Color) }" shape-rendering="geometricPrecision"`);
    const Enhanced: string = Root + Markup.slice(RootEnd);
    return Enhanced.replace(
        /stroke-width="0"/u,
        `stroke-width="${ DefaultStrokeWidth }" stroke-linejoin="round" paint-order="stroke fill"`
    );
};

const GetMathJax = (): Promise<MathJaxApi> =>
{
    Initialization ??= MathJax.init({
        loader: {
            load: [ "input/tex", "output/svg" ],
            require: ImportMathJaxModule
        },
        svg: { fontCache: "local" },
        tex: {
            formatError: (_Jax: unknown, ErrorValue: Error): never =>
            {
                throw ErrorValue;
            }
        }
    });

    return Initialization;
};

/** Convert Windows absolute paths from MathJax's loader into valid ESM URLs. */
function ImportMathJaxModule(Specifier: string): Promise<unknown>
{
    const ImportSpecifier: string = /^[A-Za-z]:[\\/]/u.test(Specifier)
        ? pathToFileURL(Specifier).href
        : Specifier;
    return import(ImportSpecifier) as Promise<unknown>;
}

const EscapeXmlAttribute = (Value: string): string =>
{
    return Value
        .replaceAll("&", "&amp;")
        .replaceAll("\"", "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
};

const RenderFallback = (Fallback: SvgFallback | undefined, ErrorValue: Error): React.ReactElement | null =>
{
    if (Fallback === undefined)
    {
        return null;
    }
    if (React.isValidElement(Fallback))
    {
        return Fallback;
    }
    return React.createElement(Fallback, { error: ErrorValue });
};

const ToError = (Value: unknown): Error =>
{
    if (Value instanceof Error)
    {
        return Value;
    }
    if (typeof Value === "object" && Value !== null && "message" in Value)
    {
        return new Error(String(Value.message));
    }
    return new Error(String(Value));
};
