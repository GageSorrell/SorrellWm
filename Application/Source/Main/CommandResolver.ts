/**
 * Resolve semantic hotkey activations into application commands.
 *
 * @module @sorrell/wm/Main/CommandResolver
 *
 * @file      CommandResolver.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "./Hotkey.js";
import * as Ui from "./Command/Ui.js";
import type * as Wm from "./Command/Wm.js";
import { Context, Effect, Layer, Option, Result, Stream, pipe } from "effect";

export/** The service identifier for command resolution. */
const TypeId = "~sorrell/wm/Main/CommandResolver" as const;

/** Every application command that can be emitted by the resolver. */
export type Resolved =
    | Ui.UiCommand
    | Wm.WmCommand;

const UiCommands = Ui.UiCommand();

export/** Resolve one hotkey activation without retaining input-device details. */
const Resolve = (Activation: Hotkey.Match): Option.Option<Resolved> =>
{
    switch (Activation.Keybind.Id)
    {
        case Hotkey.Id.Activate:
            if (Activation.Phase === Hotkey.Phase.Pressed)
            {
                return Option.some(UiCommands.Activate());
            }

            if (Activation.Phase === Hotkey.Phase.Released)
            {
                return Option.some(UiCommands.Deactivate());
            }

            return Option.none();

        case Hotkey.Id.Cancel:
            return Activation.Phase === Hotkey.Phase.Pressed
                ? Option.some(UiCommands.Deactivate())
                : Option.none();

        default:
            return Option.none();
    }
};

/** Operations exposed by the command resolver service. */
export interface CommandResolverImpl
{
    /** Commands resolved from hotkey activations, in activation order. */
    readonly Commands: Stream.Stream<Resolved>;

    /** Resolve an activation directly, primarily for non-stream consumers and tests. */
    readonly Resolve: (Activation: Hotkey.Match) => Option.Option<Resolved>;
}

/** Resolve configured hotkey activations into immutable application commands. */
export class CommandResolver extends
    Context.Service<CommandResolver, CommandResolverImpl>()(TypeId) { }

export/** Live command resolution derived from the current Hotkey service. */
const Live = Layer.effect(
    CommandResolver,
    Effect.gen(function*()
    {
        const Hotkeys = yield* Hotkey.Hotkey;

        return {
            Commands: pipe(
                Hotkeys.Matches,
                Stream.filterMap((Activation: Hotkey.Match) => pipe(
                    Resolve(Activation),
                    Option.match({
                        onNone: () => Result.failVoid,
                        onSome: Result.succeed
                    })
                ))
            ),
            Resolve
        } as const;
    })
);
