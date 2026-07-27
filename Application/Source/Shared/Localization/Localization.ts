/**
 * Utilities for implementing localization.
 *
 * @module @sorrell/wm/Localization/Localization
 * @internal
 *
 * @file      Localization.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Brand } from "effect";
import type { FC } from "react";

export/** The type identifier for this module. */
const TypeId = "~sorrell/wm/Localization/Localization" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Text that is just `string`.
 *
 * @category L10n
 * @since 0.1.0
 */
export type PlainText = Brand.Branded<string, "PlainText">;

/**
 * Text that is generated from a simple functional component that accepts no props.
 *
 * @category L10n
 * @since 0.1.0
 */
export type RichText = Brand.Branded<FC, "RichText">;

export /** {@inheritDoc PlainText:type} */
const PlainText = Brand.nominal<PlainText>();

export /** {@inheritDoc RichText:type} */
const RichText = Brand.nominal<RichText>();

/**
 * Text that is displayed to the user, either as a simple `string`, or a
 * prop-less `react` component.
 *
 * @category L10n
 * @since 0.1.0
 */
export type Text =
    | PlainText
    | RichText;

/**
 * A `Record` that maps keys to `Text`.
 * Each module under {@link \@sorrell/wm/Localization} should export an object of this type.
 *
 * @category L10n
 * @since 0.1.0
 */
export type Domain<K extends string> =
    {
        readonly [ Key in K ]: Text;
    };
