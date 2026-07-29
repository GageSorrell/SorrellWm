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
    ResizeMode,
    OverlayScreenId as ScreenId
} from "../../Shared/OverlayCommand.ts";
import { VK } from "@sorrell/windows";

export/** The service identifier for command resolution. */
const TypeId = "~sorrell/wm/Main/Command/Resolver" as const;

/** Every application command that can be emitted by the resolver. */
export type Resolved =
    | Ui.UiCommand
    | Wm.WmCommand;

const UiCommands = Ui.UiCommand();

const IsHomeScreen = (Screen: OverlayScreenId): boolean =>
    Screen === ScreenId.FloatingHome || Screen === ScreenId.TiledHome;

const ModifierKeys = Object.freeze({
    Alt: [ VK.MENU, VK.LMENU, VK.RMENU ],
    Control: [ VK.CONTROL, VK.LCONTROL, VK.RCONTROL ],
    Shift: [ VK.SHIFT, VK.LSHIFT, VK.RSHIFT ],
    Super: [ VK.LWIN, VK.RWIN ]
} as const);

const MatchesRequiredModifiers = (
    Definition: OverlayCommandDefinition,
    PressedKeys: ReadonlyArray<VK.VK>
): boolean => Object.entries(Definition.RequiredModifiers ?? { }).every((
    [ Name, Required ]: [ string, boolean ]
): boolean =>
{
    const Keys = ModifierKeys[Name as keyof typeof ModifierKeys];
    const Held = Keys.some((Key: VK.VK): boolean => PressedKeys.includes(Key));
    return Required ? Held : !Held;
});

const ModifierSpecificity = (Definition: OverlayCommandDefinition): number =>
    Object.values(Definition.RequiredModifiers ?? { })
        .filter((Required: boolean): boolean => Required).length;

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

    if (Screen === ScreenId.FloatingHome && Id === OverlayCommandId.Focus)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.FloatingFocus
        }));
    }

    if (Screen === ScreenId.TiledHome && Id === OverlayCommandId.Focus)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.TiledFocus
        }));
    }

    if (Screen === ScreenId.FloatingHome && Id === OverlayCommandId.Move)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.FloatingMove
        }));
    }

    if (Screen === ScreenId.TiledHome && Id === OverlayCommandId.Move)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.TiledMove
        }));
    }

    if (Screen === ScreenId.TiledHome && Id === OverlayCommandId.Insert)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.TiledInsertDirection
        }));
    }

    if (Screen === ScreenId.FloatingHome && Id === OverlayCommandId.Tile)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.FloatingTile
        }));
    }

    if (Screen === ScreenId.FloatingHome && Id === OverlayCommandId.Resize)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.FloatingResize
        }));
    }

    if (Screen === ScreenId.TiledHome && Id === OverlayCommandId.Resize)
    {
        return Option.some(UiCommands.NavigateOverlayScreen({
            ScreenId: ScreenId.TiledResize
        }));
    }

    if (
        Screen === ScreenId.TiledResize
        && Id === OverlayCommandId.ToggleTiledResizeBehavior
    )
    {
        return Option.some(UiCommands.ToggleTiledResizeBehavior());
    }

    if (Screen === ScreenId.FloatingHome && Id === OverlayCommandId.TileAll)
    {
        return Option.some(UiCommands.TileAll());
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
    Screen: OverlayScreenId = ScreenId.FloatingHome,
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

            return IsHomeScreen(Screen)
                ? Option.some(UiCommands.Deactivate())
                : Option.some(UiCommands.BackOverlayScreen());

        case Hotkey.Id.Commit:
            if (Activation.Phase !== Hotkey.Phase.Pressed)
            {
                return Option.none();
            }

            if (Screen === ScreenId.TiledFocus)
            {
                return Option.some(UiCommands.CommitTiledFocus());
            }

            if (Screen === ScreenId.TiledMove)
            {
                return ResolveOverlayCommand(
                    Screen,
                    OverlayCommandId.MoveWindowIntoPanel,
                    ApplicationName
                );
            }

            if (Screen === ScreenId.TiledInsertWindow)
            {
                return ResolveOverlayCommand(
                    Screen,
                    OverlayCommandId.CommitInsertWindow,
                    ApplicationName
                );
            }

            return Screen === ScreenId.FloatingHome
                ? Option.some(UiCommands.TileAll())
                : Option.none();

        case Hotkey.Id.Back:
            return Activation.Phase === Hotkey.Phase.Pressed
                && !IsHomeScreen(Screen)
                ? Option.some(UiCommands.BackOverlayScreen())
                : Option.none();

        case Hotkey.Id.PrimaryModifier:
            if (Activation.Phase === Hotkey.Phase.Repeated)
            {
                return Option.none();
            }

            return Option.some(UiCommands.SetPrimaryModifierHeld({
                Held: Hotkey.IsKeybindPressed(Activation.Keybind, Activation.PressedKeys)
            }));

        case Hotkey.Id.FineModifier:
            if (Activation.Phase === Hotkey.Phase.Repeated)
            {
                return Option.none();
            }

            return Option.some(UiCommands.SetFineModifierHeld({
                Held: Hotkey.IsKeybindPressed(Activation.Keybind, Activation.PressedKeys)
            }));

        case Hotkey.Id.ResizeModifier:
            if (Activation.Phase === Hotkey.Phase.Repeated)
            {
                return Option.none();
            }

            return Option.some(UiCommands.SetResizeMode({
                Mode: Hotkey.IsKeybindPressed(Activation.Keybind, Activation.PressedKeys)
                    ? ResizeMode.Shrink
                    : ResizeMode.Grow
            }));

        default:
        {
            if (Activation.Phase !== Hotkey.Phase.Pressed)
            {
                return Option.none();
            }

            const Definition = [
                ...GetOverlayCommandDefinitions(Screen),
                GetOverlaySecondaryCommandDefinition(Screen)
            ].filter((
                Candidate: OverlayCommandDefinition | undefined
            ): Candidate is OverlayCommandDefinition =>
                Candidate?.HotkeyId === Activation.Keybind.Id
                && MatchesRequiredModifiers(Candidate, Activation.PressedKeys)
            ).sort((
                Left: OverlayCommandDefinition,
                Right: OverlayCommandDefinition
            ): number => ModifierSpecificity(Right) - ModifierSpecificity(Left))[0];

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
