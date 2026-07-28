/**
 * Resolve semantic hotkey activations into application commands.
 *
 * @module @sorrell/wm/Main/Command/Resolver
 *
 * @file      Resolver.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Hotkey from "../Input/Hotkey.ts";
import * as OverlaySession from "../Overlay/Session.ts";
import * as Ui from "./Ui.ts";
import type * as Wm from "./Wm.ts";
import { Context, Effect, Layer, Option, Result, Stream, pipe } from "effect";
import { EncodeSettingsPath, SettingsSectionId } from "../../Shared/SettingsPath.ts";
import {
    GetOverlayCommandDefinitions,
    GetOverlaySecondaryCommandDefinition,
    type OverlayCommandDefinition,
    OverlayCommandId,
    type OverlayScreenId,
    OverlayScreenId as ScreenId
} from "../../Shared/OverlayCommand.ts";

export/** The service identifier for command resolution. */
const TypeId = "~sorrell/wm/Main/Command/Resolver" as const;

/** Every application command that can be emitted by the resolver. */
export type Resolved =
    | Ui.UiCommand
    | Wm.WmCommand;

const UiCommands = Ui.UiCommand();

export/** Resolve an available screen command without retaining renderer details. */
const ResolveOverlayCommand = (
    Screen: OverlayScreenId,
    Id: OverlayCommandId,
    ApplicationName: Option.Option<string> = Option.none()
): Option.Option<Resolved> =>
{
    const IsPrimaryCommand = GetOverlayCommandDefinitions(Screen).some((
        Definition: OverlayCommandDefinition
    ) =>
        Definition.Id === Id);
    const IsSecondaryCommand = GetOverlaySecondaryCommandDefinition(Screen)?.Id === Id;

    if (!IsPrimaryCommand && !IsSecondaryCommand)
    {
        return Option.none();
    }

    if (Screen === ScreenId.Home && Id === "Focus")
    {
        return Option.some(UiCommands.NavigateOverlayScreen({ ScreenId: ScreenId.Focus }));
    }

    if (Id === OverlayCommandId.OpenPerAppSettings)
    {
        return Option.some(UiCommands.OpenSettings({
            Path: Option.some(EncodeSettingsPath({
                Params: Option.match(ApplicationName, {
                    onNone: () => ({ }),
                    onSome: (Name: string) => ({ Name })
                }),
                Section: SettingsSectionId.PerAppSettings
            }))
        }));
    }

    return Option.some(UiCommands.NoOpOverlayCommand({ Id }));
};

export/** Resolve one hotkey activation for an overlay screen. */
const Resolve = (
    Activation: Hotkey.Match,
    Screen: OverlayScreenId = ScreenId.Home,
    ApplicationName: Option.Option<string> = Option.none()
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

            const Definition = [
                ...GetOverlayCommandDefinitions(Screen),
                GetOverlaySecondaryCommandDefinition(Screen)
            ].find((
                Candidate: OverlayCommandDefinition | undefined
            ) =>
                Candidate?.HotkeyId === Activation.Keybind.Id);

            return Definition === undefined
                ? Option.none()
                : ResolveOverlayCommand(Screen, Definition.Id, ApplicationName);
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
        const ResolveCurrent = (Activation: Hotkey.Match) => Effect.gen(function*()
        {
            const Screen = yield* Session.Current;
            const ApplicationName = yield* Session.GetActivationApplicationName;
            return Resolve(Activation, Screen, ApplicationName);
        });
        const ResolveCurrentOverlayCommand = (Id: OverlayCommandId) => Effect.gen(function*()
        {
            const Screen = yield* Session.Current;
            const ApplicationName = yield* Session.GetActivationApplicationName;
            return ResolveOverlayCommand(Screen, Id, ApplicationName);
        });

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
