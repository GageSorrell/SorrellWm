/**
 * Windows API types and operations for theme.
 *
 * @module @sorrell/windows/Theme
 *
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Option, pipe } from "effect";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.js";

/** A Windows accent color represented as a six-digit hexadecimal color. */
export type AccentColor = `#${string}`;

const AccentColorPattern: RegExp = /^#[0-9A-F]{6}$/u;

export/** Get the user's current Windows accent color, or `None` when it cannot be read. */
const GetAccentColor = (): Option.Option<AccentColor> => pipe(
    Binding.Theme.GetAccentColor(),
    Attempt.AsOption,
    Option.filter((Value: string) => AccentColorPattern.test(Value)),
    Option.map((Value: string) => Value as AccentColor)
);
