/**
 * Renderer-safe application theme data.
 *
 * @module @sorrell/wm/Shared/Theme
 *
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/** The color schemes supported by the application renderer. */
const ColorScheme = Object.freeze({
    Dark: "Dark",
    Light: "Light"
} as const);

/** A renderer color scheme resolved from Electron's current native theme. */
export type ColorScheme = typeof ColorScheme[keyof typeof ColorScheme];

/** A six-digit hexadecimal accent color. */
export type AccentColor = `#${string}`;

/** The serializable theme state sent from the main process to a renderer. */
export interface RendererTheme
{
    readonly AccentColor: AccentColor | null;
    readonly ColorScheme: ColorScheme;
}

const AccentColorPattern: RegExp = /^#[0-9A-Fa-f]{6}$/u;

export/** Determine whether an IPC value is a valid renderer theme snapshot. */
const IsRendererTheme = (Value: unknown): Value is RendererTheme =>
{
    if (typeof Value !== "object" || Value === null)
    {
        return false;
    }

    const Candidate = Value as Partial<RendererTheme>;
    const IsAccentColor = Candidate.AccentColor === null
        || (typeof Candidate.AccentColor === "string"
            && AccentColorPattern.test(Candidate.AccentColor));

    return IsAccentColor
        && (Candidate.ColorScheme === ColorScheme.Dark
            || Candidate.ColorScheme === ColorScheme.Light);
};
