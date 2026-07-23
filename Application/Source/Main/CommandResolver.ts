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
import * as OverlaySession from "./OverlaySession.js";
import * as Ui from "./Command/Ui.js";
import type * as Wm from "./Command/Wm.js";
import { Context, Effect, Layer, Option, Result, Stream, pipe } from "effect";
import {
    GetOverlayCommandDefinitions,
    type OverlayCommandDefinition,
    type OverlayCommandId,
    type OverlayScreenId,
    OverlayScreenId as ScreenId
} from "../Shared/OverlayCommand.js";

export/** The service identifier for command resolution. */
const TypeId = "~sorrell/wm/Main/CommandResolver" as const;

/** Every application command that can be emitted by the resolver. */
export type Resolved =
    | Ui.UiCommand
    | Wm.WmCommand;

const UiCommands = Ui.UiCommand();

export/** Resolve an available screen command without retaining renderer details. */
const ResolveOverlayCommand = (
    Screen: OverlayScreenId,
    Id: OverlayCommandId
): Option.Option<Resolved> =>
{
    const IsAvailable = GetOverlayCommandDefinitions(Screen).some((
        Definition: OverlayCommandDefinition
    ) =>
        Definition.Id === Id);

    if (!IsAvailable)
    {
        return Option.none();
    }

    return Screen === ScreenId.Home && Id === "Focus"
        ? Option.some(UiCommands.NavigateOverlayScreen({ ScreenId: ScreenId.Focus }))
        : Option.some(UiCommands.NoOpOverlayCommand({ Id }));
};

export/** Resolve one hotkey activation for an overlay screen. */
const Resolve = (
    Activation: Hotkey.Match,
    Screen: OverlayScreenId = ScreenId.Home
): Option.Option<Resolved> =>
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
            if (Activation.Phase !== Hotkey.Phase.Pressed)
            {
                return Option.none();
            }

            return Screen === ScreenId.Home
                ? Option.some(UiCommands.Deactivate())
                : Option.some(UiCommands.BackOverlayScreen());

        case Hotkey.Id.Back:
            return Activation.Phase === Hotkey.Phase.Pressed
                && Screen !== ScreenId.Home
                ? Option.some(UiCommands.BackOverlayScreen())
                : Option.none();

        default:
        {
            if (Activation.Phase !== Hotkey.Phase.Pressed)
            {
                return Option.none();
            }

            const Definition = GetOverlayCommandDefinitions(Screen).find((
                Candidate: OverlayCommandDefinition
            ) =>
                Candidate.HotkeyId === Activation.Keybind.Id);

            return Definition === undefined
                ? Option.none()
                : ResolveOverlayCommand(Screen, Definition.Id);
        }
    }
};

/** Operations exposed by the command resolver service. */
export interface CommandResolverImpl
{
    /** Commands resolved from hotkey activations, in activation order. */
    readonly Commands: Stream.Stream<Resolved>;

    /** Resolve an activation directly, primarily for non-stream consumers and tests. */
    readonly Resolve: (
        Activation: Hotkey.Match
    ) => Effect.Effect<Option.Option<Resolved>>;

    /** Resolve a renderer invocation against the current screen. */
    readonly ResolveOverlayCommand: (
        Id: OverlayCommandId
    ) => Effect.Effect<Option.Option<Resolved>>;
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
        const Session = yield* OverlaySession.OverlaySession;
        const ResolveCurrent = (Activation: Hotkey.Match) => Session.Current.pipe(
            Effect.map((Screen: OverlayScreenId) => Resolve(Activation, Screen))
        );
        const ResolveCurrentOverlayCommand = (Id: OverlayCommandId) => Session.Current.pipe(
            Effect.map((Screen: OverlayScreenId) => ResolveOverlayCommand(Screen, Id))
        );

        return {
            Commands: pipe(
                Hotkeys.Matches,
                Stream.mapEffect(ResolveCurrent),
                Stream.filterMap((Command: Option.Option<Resolved>) => pipe(
                    Command,
                    Option.match({
                        onNone: () => Result.failVoid,
                        onSome: Result.succeed
                    })
                ))
            ),
            Resolve: ResolveCurrent,
            ResolveOverlayCommand: ResolveCurrentOverlayCommand
        } as const;
    })
);
