/**
 * @file      Array.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * @module Array.Internal
 * Internal content for the {@link Array} module.
 *
 * @internal
 */

export/**
       * The `symbol` used to define the `Readonly` option type.
       * @internal
       */
const ReadonlyOption: unique symbol = Symbol("ReadonlyOption");

export/**
       * The `symbol` used to define the `DefinedOnly` option type.
       * @internal
       */
const DefinedOnlyOption: unique symbol = Symbol("DefinedOnlyOption");

export/**
       * The `symbol` used to define the `MaybeDefined` option type.
       * @internal
       */
const MaybeDefinedOption: unique symbol = Symbol("MaybeDefinedOption");
