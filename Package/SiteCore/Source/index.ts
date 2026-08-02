/**
 *
 *
 * @module @sorrell/site-core
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Shared definitions and configuration factories for generated websites.
 *
 * @module @sorrell/site-core
 */

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/site-core" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

export * from "./Schema.js";
