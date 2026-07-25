/**
 * Terminal service definitions for Effect workflows.
 *
 * @module @sorrell/ink-three/Terminal/InkThreeTerminal
 *
 * @file      InkThreeTerminal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Viewport from "../Viewport.js";
import {
    type InvalidRenderOptions,
    type InvalidViewport,
    UnsupportedTerminal
} from "../InkThreeError.js";

export/** The type ID of this module. */
const TypeId = "~sorrell/ink-ui/Three/Terminal/InkThreeTerminal" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Terminal capabilities used by terminal frame sinks.
 *
 * @category Terminal
 * @since 1.0.0
 */
export interface TerminalCapabilities
{
    readonly TrueColor: boolean;
    readonly Unicode: boolean;
}

/**
 * Service that supplies terminal dimensions and capabilities.
 *
 * @category Service
 * @since 1.0.0
 */
export class InkThreeTerminal extends Context.Service<InkThreeTerminal, {
    readonly GetViewport: Effect.Effect<Viewport.Viewport>;
    readonly GetCapabilities: Effect.Effect<TerminalCapabilities>;
    readonly RequireCapabilities:
    (Capabilities: Partial<TerminalCapabilities>) => Effect.Effect<void, UnsupportedTerminal>;
}>()(TypeId) { }

/**
 * Creates a live terminal service layer from a viewport provider.
 *
 * @category Layer
 * @since 1.0.0
 */
export function MakeInkThreeTerminalLayer(
    GetViewport: () => Viewport.Viewport,
    Capabilities: TerminalCapabilities =
        {
            TrueColor: true,
            Unicode: true
        }
): Layer.Layer<InkThreeTerminal>
{
    return Layer.succeed(InkThreeTerminal, InkThreeTerminal.of({
        GetCapabilities: Effect.succeed(Capabilities),
        GetViewport: Effect.sync(GetViewport),
        RequireCapabilities: (RequiredCapabilities: Partial<TerminalCapabilities>) => Effect.gen(function*()
        {
            if (RequiredCapabilities.TrueColor === true && Capabilities.TrueColor !== true)
            {
                return yield* Effect.fail(new UnsupportedTerminal({
                    Feature: "TrueColor",
                    Message: "The terminal does not report truecolor support."
                }));
            }

            if (RequiredCapabilities.Unicode === true && Capabilities.Unicode !== true)
            {
                return yield* Effect.fail(new UnsupportedTerminal({
                    Feature: "Unicode",
                    Message: "The terminal does not report Unicode support."
                }));
            }
        })
    }));
}

export/**
       * Returns the current validated terminal viewport.
       *
       * @category Terminal
       * @since 1.0.0
       */
const GetValidatedTerminalViewport: {
    (): Effect.Effect<Viewport.Viewport, InvalidViewport | InvalidRenderOptions, unknown>
} = Effect.fn("GetValidatedTerminalViewport")(function*()
{
    const Terminal: Context.Service.Shape<typeof InkThreeTerminal> = yield* InkThreeTerminal;
    const TheViewport: Viewport.Viewport = yield* Terminal.GetViewport;

    return yield* Viewport.ValidateViewport(TheViewport);
});

