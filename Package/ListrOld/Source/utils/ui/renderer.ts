/**
 * @file      renderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    DefaultRenderer,
    SimpleRenderer,
    TestRenderer,
    VerboseRenderer } from "@renderer/index.js";
import type {
    ListrGetRendererOptions,
    ListrOptions,
    ListrRendererSubclass,
    ListrSilentRenderer,
    SupportedRenderer } from "@interfaces/index.js";
import { ListrRendererSelection } from "@constants/index.js";
import { SilentRenderer } from "@renderer/index.js";
import { assertFunctionOrSelf } from "@utils/index.js";

// type FRenderers =
//     {
//         default: typeof DefaultRenderer;
//         silent: typeof SilentRenderer;
//         simple: typeof SimpleRenderer;
//         test: typeof TestRenderer;
//         verbose: typeof VerboseRenderer;
//     };

// const RENDERERS: FRenderers =
//     {
//         default: DefaultRenderer,
//         silent: SilentRenderer,
//         simple: SimpleRenderer,
//         test: TestRenderer,
//         verbose: VerboseRenderer
//     };

function isRendererSupported(renderer: ListrRendererSubclass): boolean
{
    return process.stdout.isTTY === true || renderer.NonTty === true;
}

// export function getRendererClass(renderer: ListrRendererSubclass): ListrRendererSubclass
// {
//     if (typeof renderer === "string")
//     {
//         return RENDERERS[renderer] ?? RENDERERS.default;
//     }

//     return typeof renderer === "function"
//         ? renderer
//         : RENDERERS.default;
// }

export function getRenderer<
    Renderer extends ListrRendererSubclass,
    FallbackRenderer extends ListrRendererSubclass
>(
    options:
    {
        Renderer: Renderer;
        RendererOptions: ListrGetRendererOptions<Renderer>;
        FallbackRenderer: FallbackRenderer;
        FallbackRendererOptions: ListrGetRendererOptions<FallbackRenderer>;
        FallbackRendererCondition?: ListrOptions["FallbackRendererCondition"];
        SilentRendererCondition?: ListrOptions["SilentRendererCondition"];
    }
): SupportedRenderer<Renderer> | SupportedRenderer<FallbackRenderer> | SupportedRenderer<ListrSilentRenderer>
{
    if (assertFunctionOrSelf(options?.SilentRendererCondition))
    {
        return {
            Renderer: SilentRenderer,
            Selection: ListrRendererSelection.SILENT
        };
    }

    const r: SupportedRenderer<Renderer> =
        {
            Options: options.RendererOptions,
            Renderer: options.Renderer,
            Selection: ListrRendererSelection.PRIMARY
        };

    if (!isRendererSupported(r.Renderer) || assertFunctionOrSelf(options?.FallbackRendererCondition))
    {
        return {
            Options: options.FallbackRendererOptions,
            Renderer: options.FallbackRenderer,
            Selection: ListrRendererSelection.SECONDARY
        };
    }

    return r;
}
// export function getRenderer(options:
// {
//     renderer: ListrDefaultRendererValue;
//     rendererOptions: ListrGetRendererOptions;
//     fallbackRenderer: ListrDefaultRendererValue;
//     fallbackRendererOptions: ListrGetRendererOptions;
//     fallbackRendererCondition?: ListrOptions["fallbackRendererCondition"];
//     silentRendererCondition?: ListrOptions["silentRendererCondition"];
// }): SupportedRenderer
// {
//     if (assertFunctionOrSelf(options?.silentRendererCondition))
//     {
//         // return DefaultRenderer;
//         return { renderer: DefaultRenderer, selection: ListrRendererSelection.SILENT };
//     }

//     const r: SupportedRenderer =
//         {
//             options: options.rendererOptions,
//             renderer: DefaultRenderer,
//             selection: ListrRendererSelection.PRIMARY
//         };

//     if (!isRendererSupported(DefaultRenderer) || assertFunctionOrSelf(options?.fallbackRendererCondition))
//     {
//         return {
//             options: options.fallbackRendererOptions,
//             renderer: DefaultRenderer,
//             selection: ListrRendererSelection.SECONDARY
//         };
//     }

//     return r;
// }
