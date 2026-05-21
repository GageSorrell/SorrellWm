/**
 * @file      Type.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Cause {@link LeftType} to "short circuit" to `never` iff it does *not* extend {@link RightType}.
 *
 * @template LeftType - The type that is asserted to extend {@link RightType}.
 * @template RightType - The type that {@link LeftType} is asserted to extend.
 */
export type AssertIs<LeftType, RightType> = LeftType extends RightType ? LeftType : never;

/**
 * Cause {@link LeftType} to "fallback to" to {@link RightType} iff it does *not* extend {@link RightType}.
 *
 * @template LeftType - The type that is assumed to extend {@link RightType}.
 * @template RightType - The type that {@link LeftType} is assumed to extend.
 */
export type AssumeIs<LeftType, RightType> = LeftType extends RightType ? LeftType : RightType;
