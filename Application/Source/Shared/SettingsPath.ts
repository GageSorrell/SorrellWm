/**
 * Encode and decode paths into the settings window.
 *
 * @module @sorrell/wm/Shared/SettingsPath
 *
 * @file      SettingsPath.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/** Stable identifiers for the settings window's navigable sections. */
const SettingsSectionId = Object.freeze({
    Advanced: "Advanced" as const,
    General: "General" as const,
    Home: "Home" as const,
    Keybinds: "Keybinds" as const,
    Overlay: "Overlay" as const,
    PerAppSettings: "PerAppSettings" as const
} as const);

/** One of the settings window's navigable sections. */
export type SettingsSectionId = typeof SettingsSectionId[keyof typeof SettingsSectionId];

/** A navigable location within the settings window. */
export interface SettingsPath
{
    readonly Params: Readonly<Record<string, string>>;
    readonly Section: SettingsSectionId;
}

export/** Encode a settings path into the string carried by `Ui.UiCommand`'s `OpenSettings.Path`. */
const EncodeSettingsPath = (Path: SettingsPath): string =>
{
    const Query: string = new URLSearchParams(Path.Params).toString();
    return Query.length === 0 ? Path.Section : `${ Path.Section }?${ Query }`;
};

export/** Decode a settings path produced by {@link EncodeSettingsPath}. */
const DecodeSettingsPath = (Value: string): SettingsPath =>
{
    const QueryIndex: number = Value.indexOf("?");
    const MaybeSection: string = QueryIndex === -1 ? Value : Value.slice(0, QueryIndex);
    const Params: Readonly<Record<string, string>> = QueryIndex === -1
        ? { }
        : Object.fromEntries(new URLSearchParams(Value.slice(QueryIndex + 1)));

    const Section = IsSettingsSectionId(MaybeSection)
        ? MaybeSection
        : SettingsSectionId.Home;

    return { Params, Section } as const;
};

export/** Determine whether a string names a known settings section. */
const IsSettingsSectionId = (Value: string): Value is SettingsSectionId =>
    (Object.values(SettingsSectionId) as ReadonlyArray<string>).includes(Value);
